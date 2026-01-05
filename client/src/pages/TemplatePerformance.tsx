import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, Heart, MessageCircle, Share2, Eye, Trophy } from "lucide-react";
import { Link } from "wouter";

export default function TemplatePerformance() {
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");
  
  const { data: performance, isLoading } = trpc.templatePerformance.getAll.useQuery({ period });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const champion = performance && performance.length > 0 ? performance[0] : null;
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">📊 Performance de Templates</h1>
        <p className="text-slate-600">
          Descubra quais templates geram mais engajamento e otimize sua estratégia de conteúdo
        </p>
      </div>
      
      {/* Filtro de período */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Período:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={period === "7" ? "default" : "outline"}
              onClick={() => setPeriod("7")}
            >
              Últimos 7 dias
            </Button>
            <Button
              size="sm"
              variant={period === "30" ? "default" : "outline"}
              onClick={() => setPeriod("30")}
            >
              Últimos 30 dias
            </Button>
            <Button
              size="sm"
              variant={period === "90" ? "default" : "outline"}
              onClick={() => setPeriod("90")}
            >
              Últimos 90 dias
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Template Campeão */}
      {champion && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-900">🏆 Template Campeão</h2>
              <p className="text-yellow-700">Melhor performance no período selecionado</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">{champion.templateName}</h3>
              <p className="text-sm text-slate-600 mb-4">
                {champion.postCount} posts publicados
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-slate-600">Curtidas Médias</p>
                    <p className="text-lg font-semibold">{champion.avgLikes.toFixed(1)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-slate-600">Comentários Médios</p>
                    <p className="text-lg font-semibold">{champion.avgComments.toFixed(1)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-slate-600">Compartilhamentos</p>
                    <p className="text-lg font-semibold">{champion.avgShares.toFixed(1)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-slate-600">Alcance Médio</p>
                    <p className="text-lg font-semibold">{champion.avgReach.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {champion.thumbnailUrl && (
              <div className="flex items-center justify-center">
                <img
                  src={champion.thumbnailUrl}
                  alt={champion.templateName}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <Link href="/studio">
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Usar Este Template
              </Button>
            </Link>
          </div>
        </Card>
      )}
      
      {/* Ranking de Templates */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📈 Ranking Completo</h2>
        
        {!performance || performance.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-600">
              Nenhum template com dados de performance no período selecionado.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Publique posts usando seus templates para ver as métricas aqui.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {performance.map((template, index) => (
              <Card key={template.templateId} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Posição no ranking */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-700">#{index + 1}</span>
                  </div>
                  
                  {/* Thumbnail */}
                  {template.thumbnailUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={template.thumbnailUrl}
                        alt={template.templateName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Informações */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{template.templateName}</h3>
                    <p className="text-sm text-slate-600">{template.postCount} posts publicados</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        {template.avgLikes.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        {template.avgComments.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4 text-green-500" />
                        {template.avgShares.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-purple-500" />
                        {template.avgReach.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Engajamento total */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-slate-600">Engajamento Total</p>
                    <p className="text-2xl font-bold text-primary">{template.totalEngagement}</p>
                  </div>
                  
                  {/* Botão de ação */}
                  <div className="flex-shrink-0">
                    <Link href="/studio">
                      <Button size="sm" variant="outline">
                        Usar Template
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
