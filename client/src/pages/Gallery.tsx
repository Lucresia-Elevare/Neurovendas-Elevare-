import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Edit, Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
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

export default function Gallery() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showGridPreview, setShowGridPreview] = useState(false);
  const utils = trpc.useUtils();
  
  const handleEdit = (creation: any) => {
    // Salvar criação no localStorage para carregar no editor
    localStorage.setItem("editingCreation", JSON.stringify(creation));
    window.location.href = "/";
  };
  
  const { data: creations, isLoading } = trpc.creations.list.useQuery();
  const deleteMutation = trpc.creations.delete.useMutation({
    onSuccess: () => {
      utils.creations.list.invalidate();
      toast.success("Cria\u00e7\u00e3o deletada!");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao deletar cria\u00e7\u00e3o");
    },
  });
  
  // Edição em lote
  const [selectedForBatch, setSelectedForBatch] = useState<Set<number>>(new Set());
  const [showBatchEdit, setShowBatchEdit] = useState(false);
  const [batchUpdates, setBatchUpdates] = useState<any>({});

  const batchEditMutation = trpc.batchEdit.update.useMutation({
    onSuccess: (data) => {
      utils.creations.list.invalidate();
      toast.success(`${data.count} criações atualizadas!`);
      setShowBatchEdit(false);
      setSelectedForBatch(new Set());
      setBatchUpdates({});
    },
    onError: () => {
      toast.error("Erro ao editar em lote");
    },
  });

  const convertToStoryMutation = trpc.storyConversion.convertToStory.useMutation({
    onSuccess: () => {
      utils.creations.list.invalidate();
      toast.success("Convertido para story com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao converter para story");
    },
  });

  const duplicateMutation = trpc.creations.duplicate.useMutation({
    onSuccess: (newCreation) => {
      utils.creations.list.invalidate();
      toast.success("Cria\u00e7\u00e3o duplicada!");
      // Abrir no editor
      localStorage.setItem("editingCreation", JSON.stringify(newCreation));
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Erro ao duplicar cria\u00e7\u00e3o");
    },
  });
  
  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (!creations) return;
    if (selectedIds.length === filteredCreations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCreations.map(c => c.id));
    }
  };
  
  const handleBulkExport = async () => {
    if (selectedIds.length === 0) {
      toast.error("Selecione pelo menos uma cria\u00e7\u00e3o");
      return;
    }
    
    setIsExporting(true);
    try {
      const selectedCreations = creations?.filter(c => selectedIds.includes(c.id)) || [];
      
      // Criar ZIP usando JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Adicionar cada imagem ao ZIP
      for (const creation of selectedCreations) {
        if (creation.exportedImageUrl) {
          try {
            const response = await fetch(creation.exportedImageUrl);
            const blob = await response.blob();
            const filename = `elevare-${creation.id}-${creation.format}.png`;
            zip.file(filename, blob);
          } catch (error) {
            console.error(`Erro ao adicionar ${creation.id}:`, error);
          }
        }
      }
      
      // Gerar e baixar ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `elevare-export-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`${selectedIds.length} cria\u00e7\u00f5es exportadas!`);
      setSelectedIds([]);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error("Erro ao exportar cria\u00e7\u00f5es");
    } finally {
      setIsExporting(false);
    }
  };
  
  if (isLoading) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-slate-600">Carregando suas criações...</p>
      </div>
    </div>
  );
  }
  
  if (!creations || creations.length === 0) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="p-12 text-center max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Nenhuma criação ainda</h2>
        <p className="text-slate-600 mb-6">
          Comece criando sua primeira composição visual no Estúdio!
        </p>
        <Button onClick={() => window.location.href = "/"}>
          Ir para o Estúdio
        </Button>
      </Card>
    </div>
  );
  }
  
  // Filtrar criações por busca e tags
  const filteredCreations = creations.filter((creation) => {
    const matchesSearch = creation.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!selectedTag) return matchesSearch;
    
    const tags = creation.tags ? JSON.parse(creation.tags) : [];
    return matchesSearch && tags.includes(selectedTag);
  });
  
  // Extrair todas as tags únicas
  const allTags = Array.from(
    new Set(
      creations
        .map((c) => (c.tags ? JSON.parse(c.tags) : []))
        .flat()
    )
  );
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Suas Criações</h1>
        
        {/* Filtros de Busca e Tags */}
        <div className="mb-6 space-y-4">
          <Input
            placeholder="Buscar por texto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                Todas
              </Button>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* Botões de Exportação em Lote */}
        {filteredCreations.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSelectAll}
            >
              {selectedIds.length === filteredCreations.length ? "Desselecionar Todas" : "Selecionar Todas"}
            </Button>
            
            {selectedForBatch.size > 0 && (
              <Button
                onClick={() => setShowBatchEdit(true)}
                variant="default"
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar {selectedForBatch.size} em Lote
              </Button>
            )}
            
            {selectedIds.length > 0 && (
              <Button
                onClick={handleBulkExport}
                disabled={isExporting}
                className="bg-gradient-to-r from-primary to-accent"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  `Exportar ${selectedIds.length} Selecionada${selectedIds.length > 1 ? 's' : ''}`
                )}
              </Button>
            )}
          </div>
        )}
        
        {/* Preview de Grid do Instagram */}
        {filteredCreations.length >= 3 && (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowGridPreview(!showGridPreview)}
              className="mb-4"
            >
              {showGridPreview ? "Ocultar" : "Mostrar"} Preview de Grid do Instagram
            </Button>
            
            {showGridPreview && (
              <Card className="p-6 shadow-xl">
                <h3 className="font-semibold mb-4 text-slate-900">Como ficará no seu perfil do Instagram</h3>
                <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
                  {filteredCreations.slice(0, 9).map((creation, index) => (
                    <div key={index} className="aspect-square bg-slate-100 rounded overflow-hidden">
                      {creation.exportedImageUrl && (
                        <img
                          src={creation.exportedImageUrl}
                          alt={creation.text}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600 text-center mt-4">
                  Mostrando as {Math.min(9, filteredCreations.length)} criações mais recentes
                </p>
              </Card>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreations.map((creation) => (
            <Card key={creation.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow relative">
              {/* Checkbox de Seleção */}
              <div className="absolute top-3 left-3 z-10 flex gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(creation.id)}
                  onChange={() => toggleSelection(creation.id)}
                  className="w-5 h-5 rounded border-2 border-white shadow-lg cursor-pointer accent-primary"
                  title="Exportação em lote"
                />
                <input
                  type="checkbox"
                  checked={selectedForBatch.has(creation.id)}
                  onChange={() => {
                    const newSet = new Set(selectedForBatch);
                    if (newSet.has(creation.id)) {
                      newSet.delete(creation.id);
                    } else {
                      newSet.add(creation.id);
                    }
                    setSelectedForBatch(newSet);
                  }}
                  className="w-5 h-5 rounded border-2 border-white shadow-lg cursor-pointer accent-purple-500"
                  title="Edição em lote"
                />
              </div>
              
              {creation.exportedImageUrl && (
                <img
                  src={creation.exportedImageUrl}
                  alt={creation.text}
                  className="w-full h-64 object-cover"
                />
              )}
              
              <div className="p-4">
                <p className="font-medium mb-2 line-clamp-2 text-slate-900">{creation.text}</p>
                <div className="flex gap-2 text-xs text-slate-600 mb-4">
                  <span className="px-2 py-1 bg-accent/30 rounded-xl">
                    {creation.format === "square" ? "Quadrado" : creation.format === "portrait" ? "Retrato" : "História"}
                  </span>
                  <span className="px-2 py-1 bg-accent/30 rounded-xl">
                    {creation.model === "classic" ? "Clássico" : creation.model === "bold" ? "Audacioso" : creation.model === "fade" ? "Desaparecer" : "Destaque"}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(creation)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateMutation.mutate({ id: creation.id })}
                      disabled={duplicateMutation.isPending}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicar
                    </Button>
                  </div>
                  {creation.format !== "story" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => convertToStoryMutation.mutate({ creationId: creation.id })}
                      disabled={convertToStoryMutation.isPending}
                      className="w-full mt-2"
                    >
                      📱 Converter em Story
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(creation.id)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta criação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate({ id: deleteId });
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Edição em Lote */}
      <AlertDialog open={showBatchEdit} onOpenChange={setShowBatchEdit}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>✏️ Editar {selectedForBatch.size} Criações em Lote</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione as propriedades que deseja alterar. Apenas os campos modificados serão aplicados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Fonte</label>
              <select
                className="w-full p-2 border rounded"
                value={batchUpdates.font || ""}
                onChange={(e) => setBatchUpdates({ ...batchUpdates, font: e.target.value || undefined })}
              >
                <option value="">Manter atual</option>
                <option value="Oswald">Oswald</option>
                <option value="Serif">Serif</option>
                <option value="Mono">Mono</option>
                <option value="Inter">Inter</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Cor do Texto</label>
              <select
                className="w-full p-2 border rounded"
                value={batchUpdates.textColor || ""}
                onChange={(e) => setBatchUpdates({ ...batchUpdates, textColor: e.target.value || undefined })}
              >
                <option value="">Manter atual</option>
                <option value="white">Branco</option>
                <option value="black">Preto</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Modelo</label>
              <select
                className="w-full p-2 border rounded"
                value={batchUpdates.model || ""}
                onChange={(e) => setBatchUpdates({ ...batchUpdates, model: e.target.value || undefined })}
              >
                <option value="">Manter atual</option>
                <option value="classic">Clássico</option>
                <option value="bold">Audacioso</option>
                <option value="fade">Desaparecer</option>
                <option value="highlight">Destaque</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Alinhamento Horizontal</label>
              <select
                className="w-full p-2 border rounded"
                value={batchUpdates.alignHorizontal || ""}
                onChange={(e) => setBatchUpdates({ ...batchUpdates, alignHorizontal: e.target.value || undefined })}
              >
                <option value="">Manter atual</option>
                <option value="left">Esquerda</option>
                <option value="center">Centro</option>
                <option value="right">Direita</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Alinhamento Vertical</label>
              <select
                className="w-full p-2 border rounded"
                value={batchUpdates.alignVertical || ""}
                onChange={(e) => setBatchUpdates({ ...batchUpdates, alignVertical: e.target.value || undefined })}
              >
                <option value="">Manter atual</option>
                <option value="top">Topo</option>
                <option value="middle">Meio</option>
                <option value="bottom">Baixo</option>
              </select>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowBatchEdit(false);
              setBatchUpdates({});
            }}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (Object.keys(batchUpdates).length === 0) {
                  toast.error("Selecione pelo menos uma propriedade para alterar");
                  return;
                }
                batchEditMutation.mutate({
                  creationIds: Array.from(selectedForBatch),
                  updates: batchUpdates,
                });
              }}
              disabled={batchEditMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
            >
              {batchEditMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Aplicando...
                </>
              ) : (
                "Aplicar Mudanças"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
