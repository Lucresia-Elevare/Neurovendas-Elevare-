import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Postar() {
  const [, setLocation] = useLocation();
  
  const { data: scheduledPosts, isLoading: loadingScheduled } = trpc.schedule.list.useQuery();
  const { data: campaigns, isLoading: loadingCampaigns } = trpc.campaigns.list.useQuery();
  
  if (loadingScheduled || loadingCampaigns) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  const upcomingPosts = scheduledPosts?.filter((p: any) => p.status === "scheduled") || [];
  const publishedToday = scheduledPosts?.filter((p: any) => {
    const today = new Date().toDateString();
    return p.status === "published" && new Date(p.publishedAt || "").toDateString() === today;
  }) || [];
  const activeCampaigns = campaigns?.filter((c: any) => c.status === "active") || [];
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            📅 Postar
          </h1>
          <p className="text-slate-600">
            Gerencie seus posts agendados, campanhas ativas e publicações
          </p>
        </div>
        
        {/* Próximos Posts Agendados */}
        <Card className="p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Próximos Posts Agendados ({upcomingPosts.length})
            </h2>
            <Button onClick={() => setLocation("/schedule")} variant="outline">
              Ver Calendário Completo
            </Button>
          </div>
          
          {upcomingPosts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Nenhum post agendado</p>
              <Button onClick={() => setLocation("/")} className="mt-4">
                Criar e Agendar Post
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingPosts.slice(0, 5).map((post: any) => (
                <div key={post.id} className="p-4 bg-muted rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{post.caption?.slice(0, 60)}...</p>
                      <p className="text-sm text-slate-500">
                        {new Date(post.scheduledFor).toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Campanhas Ativas */}
        <Card className="p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Campanhas Ativas ({activeCampaigns.length})
            </h2>
            <Button onClick={() => setLocation("/campanhas")} variant="outline">
              Gerenciar Campanhas
            </Button>
          </div>
          
          {activeCampaigns.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>Nenhuma campanha ativa</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCampaigns.map((campaign: any) => (
                <div key={campaign.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                  <h3 className="font-semibold text-slate-900 mb-2">{campaign.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{campaign.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {campaign._count?.creations || 0} posts
                    </span>
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        {/* Publicados Hoje */}
        <Card className="p-6 shadow-xl">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            Publicados Hoje ({publishedToday.length})
          </h2>
          
          {publishedToday.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>Nenhum post publicado hoje</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {publishedToday.map((post: any) => (
                <div key={post.id} className="relative group">
                  {post.imageUrl && (
                    <img 
                      src={post.imageUrl} 
                      alt="" 
                      className="w-full aspect-square rounded-2xl object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
