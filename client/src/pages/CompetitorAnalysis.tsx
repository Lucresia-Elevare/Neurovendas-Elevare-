import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Plus, Trash2, TrendingUp, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export default function CompetitorAnalysis() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [username, setUsername] = useState("");

  const { data: comparison, refetch } = trpc.competitors.getComparison.useQuery();
  const { data: competitors = [] } = trpc.competitors.list.useQuery();

  const addMutation = trpc.competitors.add.useMutation({
    onSuccess: () => {
      toast.success("Concorrente adicionado!");
      refetch();
      setIsAddModalOpen(false);
      setUsername("");
    },
  });

  const deleteMutation = trpc.competitors.delete.useMutation({
    onSuccess: () => {
      toast.success("Concorrente removido!");
      refetch();
    },
  });

  const maxEngagement = Math.max(
    comparison?.user?.avgEngagement || 0,
    ...((comparison?.competitors || []).map((c: any) => c.avgEngagement))
  );

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Análise de Concorrentes
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare seu engajamento com outras contas da região
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Concorrente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Concorrente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Username do Instagram</Label>
                <Input
                  placeholder="@clinica_exemplo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Os dados serão simulados para demonstração
                </p>
              </div>
              <Button
                onClick={() => {
                  if (!username.trim()) {
                    toast.error("Digite um username");
                    return;
                  }
                  addMutation.mutate({ username: username.trim() });
                }}
                disabled={addMutation.isPending}
                className="w-full"
              >
                {addMutation.isPending ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gráfico Comparativo */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Engajamento Médio
        </h2>
        <div className="space-y-4">
          {/* Você */}
          {comparison?.user && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-600">Você</span>
                <span className="text-sm text-muted-foreground">
                  {comparison.user.avgEngagement.toFixed(1)} curtidas/comentários
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                  style={{
                    width: `${(comparison.user.avgEngagement / maxEngagement) * 100}%`,
                  }}
                >
                  {comparison.user.avgEngagement > 0 && comparison.user.avgEngagement.toFixed(1)}
                </div>
              </div>
            </div>
          )}

          {/* Concorrentes */}
          {comparison?.competitors.map((competitor: any) => (
            <div key={competitor.id}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{competitor.name}</span>
                <span className="text-sm text-muted-foreground">
                  {competitor.avgEngagement.toFixed(1)} curtidas/comentários
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-gray-400 h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium"
                  style={{
                    width: `${(competitor.avgEngagement / maxEngagement) * 100}%`,
                  }}
                >
                  {competitor.avgEngagement > 0 && competitor.avgEngagement.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Lista de Concorrentes */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Concorrentes Monitorados</h2>
        {competitors.length === 0 ? (
          <Card className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum concorrente adicionado ainda. Adicione para começar a comparar!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitors.map((competitor: any) => (
              <Card key={competitor.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{competitor.displayName || competitor.username}</h3>
                    <p className="text-sm text-muted-foreground">@{competitor.username}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate({ id: competitor.id })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{competitor.followers?.toLocaleString()} seguidores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span>{competitor.avgEngagement?.toFixed(1)}% engajamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span>{competitor.postsPerWeek?.toFixed(1)} posts/semana</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      {comparison?.user && comparison.competitors.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <h2 className="text-xl font-semibold mb-4">💡 Insights</h2>
          <div className="space-y-2 text-sm">
            {comparison.user.avgEngagement > Math.max(...comparison.competitors.map((c: any) => c.avgEngagement)) ? (
              <p>✅ Seu engajamento está acima da média dos concorrentes! Continue assim.</p>
            ) : (
              <p>📈 Há oportunidade de melhorar seu engajamento. Analise os posts de maior sucesso dos concorrentes.</p>
            )}
            <p>
              📊 Média de engajamento dos concorrentes:{" "}
              {(comparison.competitors.reduce((sum: number, c: any) => sum + c.avgEngagement, 0) / comparison.competitors.length).toFixed(1)}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
