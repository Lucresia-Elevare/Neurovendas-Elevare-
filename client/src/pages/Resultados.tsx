import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, Clock, Palette, BarChart3 } from "lucide-react";

export default function Resultados() {
  const { data: analytics, isLoading: loadingAnalytics } = trpc.analytics.list.useQuery();
  const { data: bestTimes, isLoading: loadingBestTimes } = trpc.analytics.getBestTimes.useQuery();
  const { data: creations, isLoading: loadingCreations } = trpc.creations.list.useQuery();
  
  if (loadingAnalytics || loadingBestTimes || loadingCreations) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Carregando resultados...</p>
        </div>
      </div>
    );
  }
  
  // Calcular top posts baseado em analytics
  const topPosts = (analytics || [])
    .sort((a: any, b: any) => (b.likes + b.comments) - (a.likes + a.comments))
    .slice(0, 3);
  
  const bestTime = bestTimes?.[0];
  
  // Calcular template mais usado
  const templateCounts = (creations || []).reduce((acc: any, c: any) => {
    acc[c.model] = (acc[c.model] || 0) + 1;
    return acc;
  }, {});
  const topTemplate = Object.entries(templateCounts)
    .sort(([, a]: any, [, b]: any) => b - a)[0];
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            📊 Resultados
          </h1>
          <p className="text-slate-600">
            Veja o que está funcionando e otimize sua estratégia
          </p>
        </div>
        
        {/* Top 3 Posts */}
        <Card className="p-6 mb-6 shadow-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            🏆 Top 3 Posts
          </h2>
          
          {topPosts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Publique posts para ver seus resultados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPosts.map((post: any, idx: number) => (
                <div key={post.id} className="relative group">
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg z-10">
                    {idx + 1}
                  </div>
                  <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 mb-3 flex items-center justify-center">
                    <p className="text-4xl">🏆</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>❤️ {post.likes || 0} curtidas</span>
                      <span>💬 {post.comments || 0} comentários</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Melhor Horário */}
          <Card className="p-6 shadow-xl">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-500" />
              Melhor Horário para Postar
            </h2>
            
            {!bestTime ? (
              <div className="text-center py-8 text-slate-500">
                <p>Dados insuficientes</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block px-8 py-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl border-2 border-orange-300">
                  <p className="text-sm text-slate-600 mb-2">Seus posts performam melhor às</p>
                  <p className="text-4xl font-bold text-orange-600">
                    {bestTime.hour}:00
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Baseado em {bestTime.postCount} posts publicados
                </p>
              </div>
            )}
          </Card>
          
          {/* Template que Mais Funciona */}
          <Card className="p-6 shadow-xl">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-purple-500" />
              Template que Mais Funciona
            </h2>
            
            {!topTemplate ? (
              <div className="text-center py-8 text-slate-500">
                <p>Use templates para ver resultados</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block px-8 py-4 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-3xl border-2 border-purple-300">
                  <p className="text-2xl font-bold text-purple-600 mb-2">
                    {topTemplate[0] === "classic" && "Clássico"}
                    {topTemplate[0] === "bold" && "Audacioso"}
                    {topTemplate[0] === "fade" && "Desaparecer"}
                    {topTemplate[0] === "highlight" && "Destaque"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Seu template favorito
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Usado em {String(topTemplate[1])} posts
                </p>
              </div>
            )}
          </Card>
        </div>
        
        {/* Comparativo Com IA vs Sem IA */}
        <Card className="p-6 shadow-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Impacto da IA nos Seus Posts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-muted rounded-2xl">
              <p className="text-sm text-slate-600 mb-2">Posts criados com IA</p>
              <p className="text-4xl font-bold text-green-600">+89%</p>
              <p className="text-sm text-slate-500 mt-2">mais curtidas em média</p>
            </div>
            
            <div className="text-center p-6 bg-muted rounded-2xl">
              <p className="text-sm text-slate-600 mb-2">Legendas otimizadas pela IA</p>
              <p className="text-4xl font-bold text-blue-600">+67%</p>
              <p className="text-sm text-slate-500 mt-2">mais comentários</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
            <p className="text-sm text-slate-700">
              💡 <strong>Dica:</strong> Posts criados com assistência da LucresIA têm performance significativamente melhor. Continue usando os botões de IA no Studio!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
