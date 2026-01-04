import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  const { data: posts = [], refetch } = trpc.calendar.getMonthPosts.useQuery({ year, month });
  const rescheduleMutation = trpc.calendar.reschedule.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Post reagendado!");
    },
    onError: () => {
      toast.error("Erro ao reagendar post");
    },
  });

  // Gerar dias do mês
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0-6
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  
  // Dias vazios antes do primeiro dia
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const getPostsForDay = (day: number) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledFor);
      return postDate.getDate() === day;
    });
  };

  const handleDragStart = (e: React.DragEvent, postId: number) => {
    e.dataTransfer.setData("postId", postId.toString());
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    const postId = parseInt(e.dataTransfer.getData("postId"));
    const newDate = new Date(year, month - 1, day, 12, 0, 0); // Meio-dia
    
    rescheduleMutation.mutate({
      scheduledPostId: postId,
      newDate,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">📅 Calendário de Conteúdo</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg font-semibold min-w-[200px] text-center">
            {monthNames[month - 1]} {year}
          </span>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="text-center font-semibold text-sm text-slate-600 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayPosts = day ? getPostsForDay(day) : [];
          const isToday = day === new Date().getDate() && 
                         month === new Date().getMonth() + 1 && 
                         year === new Date().getFullYear();
          
          return (
            <Card
              key={index}
              className={`min-h-[120px] p-2 ${!day ? "bg-slate-50" : ""} ${isToday ? "ring-2 ring-primary" : ""}`}
              onDrop={day ? (e) => handleDrop(e, day) : undefined}
              onDragOver={day ? handleDragOver : undefined}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${isToday ? "text-primary" : "text-slate-700"}`}>
                      {day}
                    </span>
                    {dayPosts.length === 0 && (
                      <span className="text-xs text-red-500">Gap</span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, post.id)}
                        className="bg-primary/10 p-1.5 rounded text-xs cursor-move hover:bg-primary/20 transition-colors"
                        title={post.text || ""}
                      >
                        <div className="flex items-center gap-1">
                          {post.format === "square" && "🟦"}
                          {post.format === "portrait" && "📱"}
                          {post.format === "story" && "📖"}
                          <span className="truncate flex-1">
                            {post.text?.substring(0, 20) || "Post"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {dayPosts.length === 0 && (
                    <button
                      onClick={() => {
                        window.location.href = "/";
                      }}
                      className="w-full mt-2 p-1 border border-dashed border-slate-300 rounded hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1 text-xs text-slate-500"
                    >
                      <Plus className="w-3 h-3" />
                      Criar
                    </button>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Dica</h3>
        <p className="text-sm text-slate-700">
          Arraste e solte posts para reagendar. Dias marcados com "Gap" não têm conteúdo agendado.
        </p>
      </div>
    </div>
  );
}
