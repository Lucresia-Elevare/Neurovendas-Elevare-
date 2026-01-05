import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar as CalendarIcon, Clock, Grid3x3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState<any>(null);
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [showBulkScheduleDialog, setShowBulkScheduleDialog] = useState(false);
  const [selectedCreationsForBulk, setSelectedCreationsForBulk] = useState<number[]>([]);
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [recurringTitle, setRecurringTitle] = useState("");
  const [recurringFrequency, setRecurringFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [recurringDayOfWeek, setRecurringDayOfWeek] = useState(1); // Segunda-feira
  const [recurringDayOfMonth, setRecurringDayOfMonth] = useState(1);
  const [recurringTime, setRecurringTime] = useState("09:00");
  
  const utils = trpc.useUtils();
  
  // Buscar criações do usuário
  const { data: creations, isLoading: loadingCreations } = trpc.creations.list.useQuery();
  
  // Buscar posts agendados
  const { data: scheduledPosts, isLoading: loadingScheduled } = trpc.schedule.list.useQuery();
  
  // Buscar sugestões de melhores horários do Analytics
  const { data: bestTimes } = trpc.analytics.getBestTimes.useQuery();
  
  // Buscar publicações recorrentes
  const { data: recurringPosts } = trpc.recurring.list.useQuery();
  
  // Mutations para publicações recorrentes
  const createRecurringMutation = trpc.recurring.create.useMutation({
    onSuccess: () => {
      toast.success("Publicação recorrente criada!");
      setShowRecurringDialog(false);
      utils.recurring.list.invalidate();
    },
  });
  
  const toggleRecurringMutation = trpc.recurring.toggle.useMutation({
    onSuccess: () => {
      utils.recurring.list.invalidate();
    },
  });
  
  const deleteRecurringMutation = trpc.recurring.delete.useMutation({
    onSuccess: () => {
      toast.success("Publicação recorrente deletada!");
      utils.recurring.list.invalidate();
    },
  });
  
  // Horários recomendados baseados em analytics
  const recommendedTimes = bestTimes?.slice(0, 3).map(bt => ({
    time: `${bt.hour.toString().padStart(2, '0')}:00`,
    label: `${bt.hour}h - ${bt.avgEngagement.toFixed(1)}% engajamento`,
    engagement: bt.avgEngagement
  })) || [
    { time: "09:00", label: "9h - Horário padrão", engagement: 0 },
    { time: "12:00", label: "12h - Horário padrão", engagement: 0 },
    { time: "18:00", label: "18h - Horário padrão", engagement: 0 },
  ];
  
  // Mutation para agendar post
  const scheduleMutation = trpc.schedule.create.useMutation({
    onSuccess: () => {
      utils.schedule.list.invalidate();
      toast.success("Post agendado com sucesso!");
      setShowScheduleDialog(false);
      setSelectedCreation(null);
      setCaption("");
      setHashtags("");
    },
    onError: () => {
      toast.error("Erro ao agendar post");
    },
  });
  
  // Mutation para cancelar agendamento
  const cancelMutation = trpc.schedule.cancel.useMutation({
    onSuccess: () => {
      utils.schedule.list.invalidate();
      toast.success("Agendamento cancelado!");
    },
    onError: () => {
      toast.error("Erro ao cancelar agendamento");
    },
  });
  
  const handleSchedulePost = () => {
    if (!selectedCreation || !selectedDate) return;
    
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const scheduledFor = new Date(selectedDate);
    scheduledFor.setHours(hours, minutes, 0, 0);
    
    scheduleMutation.mutate({
      creationId: selectedCreation.id,
      scheduledFor,
      caption,
      hashtags,
    });
  };
  
  const openScheduleDialog = (creation: any) => {
    setSelectedCreation(creation);
    setShowScheduleDialog(true);
  };
  
  // Filtrar posts agendados por data selecionada
  const postsForSelectedDate = scheduledPosts?.filter((post: any) => {
    if (!selectedDate) return false;
    const postDate = new Date(post.scheduledFor);
    return (
      postDate.getDate() === selectedDate.getDate() &&
      postDate.getMonth() === selectedDate.getMonth() &&
      postDate.getFullYear() === selectedDate.getFullYear()
    );
  });
  
  if (loadingCreations || loadingScheduled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Agendamento de Posts
          </h1>
          <p className="text-slate-600">
            Planeje e agende suas publicações no Instagram com antecedência
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Calendário
            </h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-2xl border"
            />
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2 text-sm text-slate-700">Legenda:</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>Posts agendados</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Publicados</span>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Posts agendados para a data selecionada */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Posts em {selectedDate?.toLocaleDateString("pt-BR")}
            </h2>
            
            {postsForSelectedDate && postsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {postsForSelectedDate.map((post: any) => {
                  const creation = creations?.find((c: any) => c.id === post.creationId);
                  const time = new Date(post.scheduledFor).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  
                  return (
                    <div key={post.id} className="flex items-center gap-4 p-4 bg-muted rounded-2xl">
                      {creation?.exportedImageUrl && (
                        <img
                          src={creation.exportedImageUrl}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{time}</span>
                          <span className={`px-2 py-0.5 rounded-lg text-xs ${
                            post.status === "pending" ? "bg-primary/20 text-primary" :
                            post.status === "published" ? "bg-green-500/20 text-green-700" :
                            "bg-red-500/20 text-red-700"
                          }`}>
                            {post.status === "pending" ? "Agendado" : post.status === "published" ? "Publicado" : "Falhou"}
                          </span>
                        </div>
                        {post.caption && (
                          <p className="text-sm text-slate-600 line-clamp-2">{post.caption}</p>
                        )}
                      </div>
                      {post.status === "pending" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => cancelMutation.mutate({ id: post.id })}
                          disabled={cancelMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum post agendado para esta data</p>
              </div>
            )}
          </Card>
        </div>
        
        {/* Agendamento inteligente em lote */}
        {bestTimes && bestTimes.length > 0 && bestTimes[0].postCount > 0 && (
          <Card className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Agendamento Inteligente
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Agende múltiplas criações automaticamente nos horários de maior engajamento baseados nos seus dados de analytics.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {recommendedTimes.slice(0, 3).map((rt, idx) => (
                    <div key={idx} className="px-3 py-1 text-xs rounded-xl bg-primary/10 text-primary border border-primary/20">
                      {rt.label}
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => setShowBulkScheduleDialog(true)}
                disabled={!creations || creations.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                <Clock className="w-4 h-4 mr-2" />
                Agendar em Lote
              </Button>
              <Button
                onClick={() => setShowRecurringDialog(true)}
                disabled={!creations || creations.length === 0}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/10"
              >
                🔄 Nova Publicação Recorrente
              </Button>
            </div>
          </Card>
        )}
        
        {/* Criações disponíveis para agendar */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Grid3x3 className="w-6 h-6 text-primary" />
            Suas Criações
          </h2>
          <p className="text-slate-600 mb-6">Selecione uma criação para agendar individualmente</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {creations?.map((creation: any) => (
              <Card
                key={creation.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => openScheduleDialog(creation)}
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
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2">{creation.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Dialog de agendamento */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Publicação</DialogTitle>
            <DialogDescription>
              Configure a data, hora e legenda para seu post
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate?.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
              
              {/* Horários recomendados baseados em Analytics */}
              {recommendedTimes.length > 0 && recommendedTimes[0].engagement > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Horários com melhor engajamento:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {recommendedTimes.map((rt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setScheduledTime(rt.time)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors flex items-center gap-1.5"
                      >
                        <Clock className="w-3 h-3" />
                        {rt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="caption">Legenda</Label>
              <Textarea
                id="caption"
                placeholder="Escreva a legenda do seu post..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                placeholder="#estetica #beleza #harmonizacao"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSchedulePost} disabled={scheduleMutation.isPending}>
              {scheduleMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog de agendamento em lote inteligente */}
      <Dialog open={showBulkScheduleDialog} onOpenChange={setShowBulkScheduleDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agendamento Inteligente em Lote</DialogTitle>
            <DialogDescription>
              Selecione as criações que deseja agendar nos melhores horários baseados no seu histórico de engajamento
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Horários que serão usados */}
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Horários de maior engajamento:
              </h4>
              <div className="flex gap-2 flex-wrap">
                {recommendedTimes.map((rt, idx) => (
                  <div key={idx} className="px-3 py-1.5 text-xs rounded-xl bg-primary/10 text-primary border border-primary/20">
                    {rt.label}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                As criações selecionadas serão distribuídas nesses horários ao longo dos próximos dias
              </p>
            </div>
            
            {/* Seleção de data inicial */}
            <div>
              <Label htmlFor="bulk-start-date">Data inicial</Label>
              <Input
                id="bulk-start-date"
                type="date"
                value={selectedDate?.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            
            {/* Grid de seleção de criações */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Selecione as criações ({selectedCreationsForBulk.length} selecionadas)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (selectedCreationsForBulk.length === creations?.length) {
                      setSelectedCreationsForBulk([]);
                    } else {
                      setSelectedCreationsForBulk(creations?.map((c: any) => c.id) || []);
                    }
                  }}
                >
                  {selectedCreationsForBulk.length === creations?.length ? "Desselecionar Todas" : "Selecionar Todas"}
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                {creations?.map((creation: any) => {
                  const isSelected = selectedCreationsForBulk.includes(creation.id);
                  return (
                    <div
                      key={creation.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCreationsForBulk(prev => prev.filter(id => id !== creation.id));
                        } else {
                          setSelectedCreationsForBulk(prev => [...prev, creation.id]);
                        }
                      }}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected ? "border-primary shadow-lg" : "border-transparent hover:border-primary/30"
                      }`}
                    >
                      {creation.exportedImageUrl ? (
                        <img
                          src={creation.exportedImageUrl}
                          alt={creation.text}
                          className="w-full aspect-square object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-2xl">✨</span>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowBulkScheduleDialog(false);
              setSelectedCreationsForBulk([]);
            }}>
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                if (selectedCreationsForBulk.length === 0) {
                  toast.error("Selecione pelo menos uma criação");
                  return;
                }
                
                if (!selectedDate) {
                  toast.error("Selecione uma data inicial");
                  return;
                }
                
                // Distribuir as criações pelos melhores horários
                const timesToUse = recommendedTimes.map(rt => rt.time);
                let currentDate = new Date(selectedDate);
                let timeIndex = 0;
                
                try {
                  for (const creationId of selectedCreationsForBulk) {
                    const [hours, minutes] = timesToUse[timeIndex].split(":").map(Number);
                    const scheduledFor = new Date(currentDate);
                    scheduledFor.setHours(hours, minutes, 0, 0);
                    
                    await scheduleMutation.mutateAsync({
                      creationId,
                      scheduledFor,
                      caption: "",
                      hashtags: "",
                    });
                    
                    // Avançar para o próximo horário
                    timeIndex++;
                    if (timeIndex >= timesToUse.length) {
                      timeIndex = 0;
                      currentDate.setDate(currentDate.getDate() + 1);
                    }
                  }
                  
                  toast.success(`${selectedCreationsForBulk.length} posts agendados com sucesso!`);
                  setShowBulkScheduleDialog(false);
                  setSelectedCreationsForBulk([]);
                } catch (error) {
                  toast.error("Erro ao agendar posts em lote");
                }
              }}
              disabled={selectedCreationsForBulk.length === 0 || scheduleMutation.isPending}
            >
              {scheduleMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Agendar {selectedCreationsForBulk.length} Posts
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de publicação recorrente */}
      <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>🔄 Nova Publicação Recorrente</DialogTitle>
            <DialogDescription>
              Configure um post que será publicado automaticamente em intervalos regulares
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label>Título da Recorrência</Label>
              <Input
                placeholder="Ex: Dica de Segunda, Promoção de Sexta"
                value={recurringTitle}
                onChange={(e) => setRecurringTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Selecione a Criação</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedCreation?.id || ""}
                onChange={(e) => {
                  const creation = creations?.find(c => c.id === Number(e.target.value));
                  setSelectedCreation(creation);
                }}
              >
                <option value="">Escolha uma criação</option>
                {creations?.map((creation) => (
                  <option key={creation.id} value={creation.id}>
                    {creation.text.substring(0, 50)}...
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label>Frequência</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={recurringFrequency === "daily" ? "default" : "outline"}
                  onClick={() => setRecurringFrequency("daily")}
                  size="sm"
                >
                  Diária
                </Button>
                <Button
                  variant={recurringFrequency === "weekly" ? "default" : "outline"}
                  onClick={() => setRecurringFrequency("weekly")}
                  size="sm"
                >
                  Semanal
                </Button>
                <Button
                  variant={recurringFrequency === "monthly" ? "default" : "outline"}
                  onClick={() => setRecurringFrequency("monthly")}
                  size="sm"
                >
                  Mensal
                </Button>
              </div>
            </div>
            
            {recurringFrequency === "weekly" && (
              <div>
                <Label>Dia da Semana</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={recurringDayOfWeek}
                  onChange={(e) => setRecurringDayOfWeek(Number(e.target.value))}
                >
                  <option value={0}>Domingo</option>
                  <option value={1}>Segunda-feira</option>
                  <option value={2}>Terça-feira</option>
                  <option value={3}>Quarta-feira</option>
                  <option value={4}>Quinta-feira</option>
                  <option value={5}>Sexta-feira</option>
                  <option value={6}>Sábado</option>
                </select>
              </div>
            )}
            
            {recurringFrequency === "monthly" && (
              <div>
                <Label>Dia do Mês</Label>
                <Input
                  type="number"
                  min={1}
                  max={31}
                  value={recurringDayOfMonth}
                  onChange={(e) => setRecurringDayOfMonth(Number(e.target.value))}
                />
              </div>
            )}
            
            <div>
              <Label>Horário</Label>
              <Input
                type="time"
                value={recurringTime}
                onChange={(e) => setRecurringTime(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecurringDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (!recurringTitle || !selectedCreation) {
                  toast.error("Preencha todos os campos");
                  return;
                }
                
                createRecurringMutation.mutate({
                  creationId: selectedCreation.id,
                  title: recurringTitle,
                  frequency: recurringFrequency,
                  dayOfWeek: recurringFrequency === "weekly" ? recurringDayOfWeek : undefined,
                  dayOfMonth: recurringFrequency === "monthly" ? recurringDayOfMonth : undefined,
                  time: recurringTime,
                });
              }}
              disabled={createRecurringMutation.isPending}
            >
              {createRecurringMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Criando...</>
              ) : (
                "🔄 Criar Recorrência"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seção de publicações recorrentes ativas */}
      {recurringPosts && recurringPosts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">🔄 Publicações Recorrentes</h2>
          <div className="grid gap-4">
            {recurringPosts.map((post: any) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p className="text-sm text-slate-600">
                      {post.frequency === "daily" && "Todos os dias"}
                      {post.frequency === "weekly" && `Toda semana (${["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"][post.dayOfWeek || 0]})`}
                      {post.frequency === "monthly" && `Todo mês (dia ${post.dayOfMonth})`}
                      {" às "}{post.time}
                    </p>
                    {post.nextExecutionAt && (
                      <p className="text-xs text-slate-500 mt-1">
                        Próxima publicação: {new Date(post.nextExecutionAt).toLocaleString("pt-BR")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={post.isActive ? "outline" : "default"}
                      onClick={() => toggleRecurringMutation.mutate({ id: post.id })}
                    >
                      {post.isActive ? "Pausar" : "Retomar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja deletar esta publicação recorrente?")) {
                          deleteRecurringMutation.mutate({ id: post.id });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
