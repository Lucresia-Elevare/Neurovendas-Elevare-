import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Instagram, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function InstagramSettings() {
  const [, setLocation] = useLocation();
  
  const { data: connection, isLoading, refetch } = trpc.instagram.getConnection.useQuery();
  const { data: authData } = trpc.instagram.getAuthUrl.useQuery();
  
  const connectMutation = trpc.instagram.connect.useMutation({
    onSuccess: (data) => {
      toast.success(`Instagram conectado: @${data.username}`);
      refetch();
      // Limpar código da URL
      window.history.replaceState({}, document.title, "/instagram-settings");
    },
    onError: (error) => {
      toast.error(`Erro ao conectar: ${error.message}`);
    },
  });

  // Verificar se há código OAuth na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    
    if (code && !connectMutation.isPending) {
      connectMutation.mutate({ code });
    }
  }, []);

  const handleConnect = () => {
    if (authData?.authUrl) {
      window.location.href = authData.authUrl;
    } else {
      toast.error("Credenciais do Instagram não configuradas");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isConnected = !!connection;
  const isExpired = connection && new Date(connection.tokenExpiresAt) < new Date();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <Instagram className="w-10 h-10 text-primary" />
            Configurações do Instagram
          </h1>
          <p className="text-slate-600">
            Conecte sua conta do Instagram para publicar posts automaticamente
          </p>
        </div>

        <Card className="p-8 shadow-xl">
          {isConnected ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {isExpired ? (
                  <XCircle className="w-12 h-12 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                )}
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {isExpired ? "Token Expirado" : "Conta Conectada"}
                  </h3>
                  <p className="text-slate-600">
                    @{connection.instagramUsername || "Usuário Instagram"}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                <p className="text-sm text-slate-700">
                  <strong>ID do Instagram:</strong> {connection.instagramUserId}
                </p>
                <p className="text-sm text-slate-700">
                  <strong>Token expira em:</strong>{" "}
                  {new Date(connection.tokenExpiresAt).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-sm text-slate-700">
                  <strong>Conectado em:</strong>{" "}
                  {new Date(connection.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>

              {isExpired && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                  <p className="text-sm text-rose-700">
                    Seu token de acesso expirou. Reconecte sua conta para continuar publicando.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleConnect}
                  disabled={connectMutation.isPending}
                  variant={isExpired ? "default" : "outline"}
                >
                  {connectMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Reconectando...
                    </>
                  ) : (
                    "Reconectar Conta"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setLocation("/")}>
                  Voltar ao Estúdio
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <Instagram className="w-24 h-24 text-primary opacity-50" />
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                  Conectar Instagram
                </h3>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Para publicar posts automaticamente, conecte sua conta do Instagram. Você
                  precisará de uma conta Business ou Creator conectada a uma página do Facebook.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left">
                <h4 className="font-semibold text-amber-900 mb-2">Requisitos:</h4>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>Conta Instagram Business ou Creator</li>
                  <li>Página do Facebook conectada</li>
                  <li>Credenciais da API configuradas pelo administrador</li>
                </ul>
              </div>

              <Button
                onClick={handleConnect}
                disabled={connectMutation.isPending || !authData}
                size="lg"
                className="w-full max-w-md"
              >
                {connectMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Instagram className="w-5 h-5 mr-2" />
                    Conectar com Instagram
                  </>
                )}
              </Button>

              {!authData && (
                <p className="text-sm text-rose-600">
                  As credenciais do Instagram não estão configuradas. Entre em contato com o
                  administrador.
                </p>
              )}
            </div>
          )}
        </Card>

        <Card className="mt-6 p-6 bg-slate-50">
          <h4 className="font-semibold text-slate-900 mb-3">Como funciona?</h4>
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
            <li>Conecte sua conta do Instagram usando OAuth</li>
            <li>Crie suas composições visuais no Estúdio</li>
            <li>Clique em "Publicar no Instagram" para enviar diretamente</li>
            <li>Acompanhe o status das publicações na página de Analytics</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
