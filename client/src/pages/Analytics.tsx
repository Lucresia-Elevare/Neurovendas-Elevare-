import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, Heart, MessageCircle, Share2, Bookmark, Eye, Clock } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Analytics() {
  const [showAddMetricsDialog, setShowAddMetricsDialog] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    reach: 0,
    impressions: 0,
  });
  
  const utils = trpc.useUtils();
  
  // Buscar analytics
  const { data: analytics, isLoading: loadingAnalytics } = trpc.analytics.list.useQuery();
  
  // Buscar criações
  const { data: creations, isLoading: loadingCreations } = trpc.creations.list.useQuery();
  
  // Buscar insights
  const { data: insights } = trpc.analytics.insights.useQuery();
  
  // Mutation para adicionar métricas
  const addMetricsMutation = trpc.analytics.create.useMutation({
    onSuccess: () => {
      utils.analytics.list.invalidate();
      utils.analytics.insights.invalidate();
      toast.success("Métricas adicionadas com sucesso!");
      setShowAddMetricsDialog(false);
      setSelectedCreation(null);
      setMetrics({ likes: 0, comments: 0, shares: 0, saves: 0, reach: 0, impressions: 0 });
    },
    onError: () => {
      toast.error("Erro ao adicionar métricas");
    },
  });
  
  const handleAddMetrics = () => {
    if (!selectedCreation) return;
    
    addMetricsMutation.mutate({
      creationId: selectedCreation.id,
      ...metrics,
      publishedAt: new Date(),
    });
  };
  
  const openAddMetricsDialog = (creation: any) => {
    setSelectedCreation(creation);
    setShowAddMetricsDialog(true);
  };
  
  // Calcular totais
  const totals = analytics?.reduce(
    (acc: any, item: any) => ({
      likes: acc.likes + (item.likes || 0),
      comments: acc.comments + (item.comments || 0),
      shares: acc.shares + (item.shares || 0),
      saves: acc.saves + (item.saves || 0),
      reach: acc.reach + (item.reach || 0),
      impressions: acc.impressions + (item.impressions || 0),
    }),
    { likes: 0, comments: 0, shares: 0, saves: 0, reach: 0, impressions: 0 }
  );
  
  // Calcular taxa de engajamento média
  const avgEngagementRate = totals && totals.reach > 0
    ? (((totals.likes + totals.comments + totals.shares + totals.saves) / totals.reach) * 100).toFixed(2)
    : 0;
  
  if (loadingAnalytics || loadingCreations) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analytics de Engajamento
          </h1>
          <p className="text-slate-600">
            Acompanhe o desempenho dos seus posts e descubra os melhores horários para publicar
          </p>
        </div>
        
        {/* Cards de Métricas Totais */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-slate-600">Curtidas</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totals?.likes || 0}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-600">Comentários</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totals?.comments || 0}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-slate-600">Compartilhamentos</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totals?.shares || 0}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-slate-600">Salvamentos</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totals?.saves || 0}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-slate-600">Alcance</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totals?.reach || 0}</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm text-slate-600">Engajamento</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{avgEngagementRate}%</p>
          </Card>
        </div>
        
        {/* Insights e Recomendações */}
        {insights && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Melhores Horários para Publicar
              </h2>
              <div className="space-y-3">
                {insights.bestHours?.slice(0, 5).map((hour: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-2xl">
                    <div>
                      <p className="font-semibold">{hour.hour}:00</p>
                      <p className="text-sm text-slate-600">
                        {hour.dayOfWeek === 0 ? "Domingo" :
                         hour.dayOfWeek === 1 ? "Segunda" :
                         hour.dayOfWeek === 2 ? "Terça" :
                         hour.dayOfWeek === 3 ? "Quarta" :
                         hour.dayOfWeek === 4 ? "Quinta" :
                         hour.dayOfWeek === 5 ? "Sexta" : "Sábado"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">{hour.avgEngagement.toFixed(1)}%</p>
                      <p className="text-xs text-slate-500">engajamento médio</p>
                    </div>
                  </div>
                ))}
                {(!insights.bestHours || insights.bestHours.length === 0) && (
                  <p className="text-center text-slate-500 py-4">
                    Adicione métricas de posts para ver recomendações
                  </p>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Posts com Melhor Performance
              </h2>
              <div className="space-y-3">
                {analytics?.slice(0, 5).map((post: any) => {
                  const creation = creations?.find((c: any) => c.id === post.creationId);
                  const engagement = post.reach > 0
                    ? (((post.likes + post.comments + post.shares + post.saves) / post.reach) * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <div key={post.id} className="flex items-center gap-3 p-3 bg-muted rounded-2xl">
                      {creation?.exportedImageUrl && (
                        <img
                          src={creation.exportedImageUrl}
                          alt="Post"
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{creation?.text || "Post"}</p>
                        <div className="flex gap-3 text-xs text-slate-600 mt-1">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>🔖 {post.saves}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{engagement}%</p>
                      </div>
                    </div>
                  );
                })}
                {(!analytics || analytics.length === 0) && (
                  <p className="text-center text-slate-500 py-4">
                    Nenhuma métrica registrada ainda
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}
        
        {/* Lista de Criações para Adicionar Métricas */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Adicionar Métricas de Posts</h2>
          <p className="text-sm text-slate-600 mb-4">
            Registre o desempenho dos seus posts publicados no Instagram
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {creations?.map((creation: any) => {
              const hasMetrics = analytics?.some((a: any) => a.creationId === creation.id);
              
              return (
                <div
                  key={creation.id}
                  className="relative cursor-pointer rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all"
                  onClick={() => !hasMetrics && openAddMetricsDialog(creation)}
                >
                  {creation.exportedImageUrl ? (
                    <img
                      src={creation.exportedImageUrl}
                      alt={creation.text}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-4xl">✨</span>
                    </div>
                  )}
                  {hasMetrics && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      ✓ Registrado
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs line-clamp-2">{creation.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      
      {/* Dialog para adicionar métricas */}
      <Dialog open={showAddMetricsDialog} onOpenChange={setShowAddMetricsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Métricas do Post</DialogTitle>
            <DialogDescription>
              Insira os dados de engajamento do Instagram
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="likes">Curtidas</Label>
                <Input
                  id="likes"
                  type="number"
                  value={metrics.likes}
                  onChange={(e) => setMetrics({ ...metrics, likes: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="comments">Comentários</Label>
                <Input
                  id="comments"
                  type="number"
                  value={metrics.comments}
                  onChange={(e) => setMetrics({ ...metrics, comments: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shares">Compartilhamentos</Label>
                <Input
                  id="shares"
                  type="number"
                  value={metrics.shares}
                  onChange={(e) => setMetrics({ ...metrics, shares: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="saves">Salvamentos</Label>
                <Input
                  id="saves"
                  type="number"
                  value={metrics.saves}
                  onChange={(e) => setMetrics({ ...metrics, saves: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reach">Alcance</Label>
                <Input
                  id="reach"
                  type="number"
                  value={metrics.reach}
                  onChange={(e) => setMetrics({ ...metrics, reach: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="impressions">Impressões</Label>
                <Input
                  id="impressions"
                  type="number"
                  value={metrics.impressions}
                  onChange={(e) => setMetrics({ ...metrics, impressions: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMetricsDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddMetrics} disabled={addMetricsMutation.isPending}>
              {addMetricsMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Salvar Métricas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
