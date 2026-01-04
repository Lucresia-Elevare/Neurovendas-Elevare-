import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Coins, ShoppingCart, History, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Credits() {
  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<"small" | "medium" | "large" | null>(null);

  const { data: balance, isLoading: loadingBalance, refetch: refetchBalance } = trpc.credits.getBalance.useQuery();
  const { data: transactions, isLoading: loadingTransactions } = trpc.credits.getTransactions.useQuery({ limit: 50 });
  const purchaseMutation = trpc.credits.purchase.useMutation({
    onSuccess: () => {
      toast.success("Créditos adicionados com sucesso!");
      refetchBalance();
      setShowPurchase(false);
      setSelectedPackage(null);
    },
    onError: (error) => {
      toast.error(`Erro ao comprar créditos: ${error.message}`);
    },
  });

  const packages = [
    {
      id: "small" as const,
      name: "Pacote Básico",
      credits: 10,
      price: 9.90,
      pricePerCredit: 0.99,
      popular: false,
    },
    {
      id: "medium" as const,
      name: "Pacote Profissional",
      credits: 50,
      price: 39.90,
      pricePerCredit: 0.80,
      popular: true,
    },
    {
      id: "large" as const,
      name: "Pacote Premium",
      credits: 100,
      price: 69.90,
      pricePerCredit: 0.70,
      popular: false,
    },
  ];

  const handlePurchase = () => {
    if (!selectedPackage) return;
    purchaseMutation.mutate({ package: selectedPackage });
  };

  if (loadingBalance) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header com saldo */}
        <Card className="p-8 shadow-xl bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Meus Créditos</h1>
              <p className="text-slate-600">Use créditos para remover fundos de imagens e recursos premium</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Coins className="w-8 h-8 text-primary" />
                <span className="text-5xl font-bold text-primary">{balance?.balance || 0}</span>
              </div>
              <p className="text-sm text-slate-600">créditos disponíveis</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
            <div>
              <p className="text-sm text-slate-600">Total comprado</p>
              <p className="text-2xl font-semibold text-slate-900">{balance?.totalPurchased || 0}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total usado</p>
              <p className="text-2xl font-semibold text-slate-900">{balance?.totalUsed || 0}</p>
            </div>
          </div>
        </Card>

        {/* Pacotes de compra */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Comprar Créditos</h2>
            <Button onClick={() => setShowPurchase(true)} className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Comprar Agora
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative ${
                  pkg.popular ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedPackage(pkg.id);
                  setShowPurchase(true);
                }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-4xl font-bold text-primary">{pkg.credits}</span>
                    <span className="text-slate-600">créditos</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-slate-900">R$ {pkg.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    R$ {pkg.pricePerCredit.toFixed(2)} por crédito
                  </p>
                  <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                    Selecionar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Histórico de transações */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <History className="w-6 h-6 text-slate-900" />
            <h2 className="text-2xl font-bold text-slate-900">Histórico de Transações</h2>
          </div>
          
          <Card className="p-6 shadow-xl">
            {loadingTransactions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : "-"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{transaction.description}</p>
                        <p className="text-sm text-slate-600">
                          {new Date(transaction.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-bold ${
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount}
                      </p>
                      {transaction.relatedService && (
                        <p className="text-xs text-slate-500">{transaction.relatedService}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600">
                <p>Nenhuma transação ainda</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Modal de confirmação de compra */}
      <Dialog open={showPurchase} onOpenChange={setShowPurchase}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              Você está prestes a comprar créditos para usar em recursos premium
            </DialogDescription>
          </DialogHeader>
          
          {selectedPackage && (
            <div className="space-y-4">
              <Card className="p-6 bg-slate-50">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {packages.find((p) => p.id === selectedPackage)?.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-4xl font-bold text-primary">
                      {packages.find((p) => p.id === selectedPackage)?.credits}
                    </span>
                    <span className="text-slate-600">créditos</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-slate-900">
                      R$ {packages.find((p) => p.id === selectedPackage)?.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
              
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm text-blue-900">
                  <strong>Nota:</strong> Esta é uma simulação. Em produção, o pagamento seria processado via Stripe.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowPurchase(false);
                    setSelectedPackage(null);
                  }}
                  disabled={purchaseMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handlePurchase}
                  disabled={purchaseMutation.isPending}
                >
                  {purchaseMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Confirmar Compra
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
