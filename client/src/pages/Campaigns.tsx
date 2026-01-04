import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar, Trash2, Play, Pause, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Campaigns() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(7);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCreations, setSelectedCreations] = useState<number[]>([]);
  
  const utils = trpc.useUtils();
  
  const { data: campaigns, isLoading } = trpc.campaigns.list.useQuery();
  const { data: creations } = trpc.creations.list.useQuery();
  
  const createMutation = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      toast.success("Campanha criada com sucesso!");
      setShowCreateDialog(false);
      setTitle("");
      setDescription("");
      setDuration(7);
      setSelectedCreations([]);
      utils.campaigns.list.invalidate();
    },
  });
  
  const toggleMutation = trpc.campaigns.toggle.useMutation({
    onSuccess: () => {
      utils.campaigns.list.invalidate();
    },
  });
  
  const deleteMutation = trpc.campaigns.delete.useMutation({
    onSuccess: () => {
      toast.success("Campanha deletada!");
      utils.campaigns.list.invalidate();
    },
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">📅 Campanhas de Posts</h1>
          <p className="text-slate-600">
            Crie séries conectadas de posts para campanhas de 7-30 dias
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </Button>
      </div>
      
      {!campaigns || campaigns.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-semibold mb-2">Nenhuma campanha criada</h2>
          <p className="text-slate-600 mb-4">
            Crie sua primeira campanha para automatizar séries de posts
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Campanha
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {campaigns.map((campaign: any) => {
            const start = new Date(campaign.startDate);
            const end = new Date(start);
            end.setDate(end.getDate() + campaign.duration);
            
            return (
              <Card key={campaign.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{campaign.title}</h3>
                    {campaign.description && (
                      <p className="text-slate-600 mb-4">{campaign.description}</p>
                    )}
                    <div className="flex gap-6 text-sm text-slate-600">
                      <div>
                        <strong>Duração:</strong> {campaign.duration} dias
                      </div>
                      <div>
                        <strong>Posts:</strong> {campaign.creationIds.length}
                      </div>
                      <div>
                        <strong>Início:</strong> {start.toLocaleDateString("pt-BR")}
                      </div>
                      <div>
                        <strong>Fim:</strong> {end.toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={campaign.isActive ? "outline" : "default"}
                      onClick={() => toggleMutation.mutate({ id: campaign.id })}
                    >
                      {campaign.isActive ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Retomar
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja deletar esta campanha?")) {
                          deleteMutation.mutate({ id: campaign.id });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Timeline de posts */}
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-3">Timeline de Publicações:</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {campaign.creationIds.map((creationId: number, index: number) => {
                      const postDate = new Date(start);
                      postDate.setDate(postDate.getDate() + Math.floor(index * (campaign.duration / campaign.creationIds.length)));
                      
                      return (
                        <div
                          key={index}
                          className="bg-slate-100 rounded-lg p-2 text-center text-xs"
                        >
                          <div className="font-semibold text-primary">Dia {Math.floor(index * (campaign.duration / campaign.creationIds.length)) + 1}</div>
                          <div className="text-slate-600 mt-1">
                            {postDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Dialog de criação */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📅 Nova Campanha de Posts</DialogTitle>
            <DialogDescription>
              Crie uma série conectada de posts para uma campanha de 7-30 dias
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label>Título da Campanha</Label>
              <Input
                placeholder="Ex: Desafio de Skincare de 21 dias"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Descrição (Opcional)</Label>
              <Textarea
                placeholder="Descreva o objetivo da campanha..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duração (dias)</Label>
                <Input
                  type="number"
                  min={1}
                  max={90}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Selecione os Posts da Campanha</Label>
              <p className="text-sm text-slate-600 mb-2">
                Os posts serão distribuídos automaticamente ao longo dos {duration} dias
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                {creations?.map((creation: any) => (
                  <div
                    key={creation.id}
                    className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
                      selectedCreations.includes(creation.id)
                        ? "border-primary bg-primary/10"
                        : "border-slate-200 hover:border-primary/50"
                    }`}
                    onClick={() => {
                      if (selectedCreations.includes(creation.id)) {
                        setSelectedCreations(selectedCreations.filter(id => id !== creation.id));
                      } else {
                        setSelectedCreations([...selectedCreations, creation.id]);
                      }
                    }}
                  >
                    <p className="text-sm font-medium truncate">{creation.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{creation.format}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {selectedCreations.length} posts selecionados
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (!title || selectedCreations.length === 0) {
                  toast.error("Preencha o título e selecione pelo menos um post");
                  return;
                }
                
                createMutation.mutate({
                  title,
                  description,
                  duration,
                  startDate: new Date(startDate),
                  creationIds: selectedCreations,
                });
              }}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando...</>
              ) : (
                "📅 Criar Campanha"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
