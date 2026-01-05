import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Trash2, Copy, Edit, Play } from "lucide-react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyTemplates() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const { data: templates = [], isLoading, refetch } = trpc.userTemplates.list.useQuery();
  const deleteMutation = trpc.userTemplates.delete.useMutation({
    onSuccess: () => {
      toast.success("Template deletado!");
      refetch();
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao deletar template");
    },
  });
  
  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleLoadTemplate = (template: typeof templates[0]) => {
    // Salvar template no localStorage para carregar no Studio
    localStorage.setItem("selectedTemplate", JSON.stringify({
      format: template.format,
      model: template.model,
      font: template.font,
      fontSize: template.fontSize,
      textColor: template.textColor,
      horizontalAlign: template.horizontalAlign,
      verticalAlign: template.verticalAlign,
      textOutline: template.textOutline,
      fadeOverlay: template.fadeOverlay,
      blur: template.blur,
      brightness: template.brightness,
      contrast: template.contrast,
    }));
    
    toast.success("Template carregado!");
    setLocation("/");
  };
  
  const handleDuplicate = async (template: typeof templates[0]) => {
    try {
      await trpc.userTemplates.create.useMutation().mutateAsync({
        name: `${template.name} (cópia)`,
        description: template.description || undefined,
        format: template.format,
        model: template.model,
        font: template.font,
        fontSize: template.fontSize,
        textColor: template.textColor,
        horizontalAlign: template.horizontalAlign,
        verticalAlign: template.verticalAlign,
        textOutline: template.textOutline,
        fadeOverlay: template.fadeOverlay,
        blur: template.blur,
        brightness: template.brightness,
        contrast: template.contrast,
      });
      
      toast.success("Template duplicado!");
      refetch();
    } catch (error) {
      toast.error("Erro ao duplicar template");
    }
  };
  
  const formatLabels: Record<string, string> = {
    square: "Quadrado",
    portrait: "Retrato",
    story: "História",
  };
  
  const modelLabels: Record<string, string> = {
    classic: "Clássico",
    bold: "Audacioso",
    fade: "Desaparecer",
    highlight: "Destaque",
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Meus Templates</h1>
          <p className="text-slate-600">Gerencie seus templates personalizados salvos</p>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-500 text-lg">
              {searchTerm ? "Nenhum template encontrado" : "Você ainda não tem templates salvos"}
            </p>
            <p className="text-slate-400 mt-2">
              Crie composições no Estúdio e salve como template para reutilizar
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="mt-6"
            >
              Ir para o Estúdio
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="p-6 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{template.name}</h3>
                  {template.description && (
                    <p className="text-slate-600 text-sm">{template.description}</p>
                  )}
                </div>
                
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Formato:</span>
                    <span className="font-medium text-slate-900">{formatLabels[template.format]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modelo:</span>
                    <span className="font-medium text-slate-900">{modelLabels[template.model]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fonte:</span>
                    <span className="font-medium text-slate-900">{template.font}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tamanho:</span>
                    <span className="font-medium text-slate-900">{template.fontSize}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleLoadTemplate(template)}
                    size="sm"
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Usar
                  </Button>
                  <Button
                    onClick={() => handleDuplicate(template)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicar
                  </Button>
                </div>
                
                <Button
                  onClick={() => setDeleteId(template.id)}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Deletar
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Template</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este template? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate({ id: deleteId })}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
