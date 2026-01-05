import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Download, ArrowLeft, ArrowRight, Grid3x3 } from "lucide-react";
import { toast } from "sonner";

export default function Carousel() {
  const [selectedCreations, setSelectedCreations] = useState<any[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  
  const { data: creations, isLoading } = trpc.creations.list.useQuery();
  
  const addToCarousel = (creation: any) => {
    if (selectedCreations.length >= 10) {
      toast.error("Máximo de 10 imagens por carrossel");
      return;
    }
    if (selectedCreations.find((c) => c.id === creation.id)) {
      toast.error("Esta criação já está no carrossel");
      return;
    }
    setSelectedCreations([...selectedCreations, creation]);
    toast.success("Adicionado ao carrossel");
  };
  
  const removeFromCarousel = (index: number) => {
    setSelectedCreations(selectedCreations.filter((_, i) => i !== index));
    if (previewIndex >= selectedCreations.length - 1) {
      setPreviewIndex(Math.max(0, selectedCreations.length - 2));
    }
  };
  
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...selectedCreations];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setSelectedCreations(newOrder);
  };
  
  const moveDown = (index: number) => {
    if (index === selectedCreations.length - 1) return;
    const newOrder = [...selectedCreations];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setSelectedCreations(newOrder);
  };
  
  const downloadCarousel = async () => {
    if (selectedCreations.length < 2) {
      toast.error("Adicione pelo menos 2 imagens ao carrossel");
      return;
    }
    
    // Criar um ZIP com todas as imagens numeradas
    toast.success(`Preparando download de ${selectedCreations.length} imagens...`);
    
    for (let i = 0; i < selectedCreations.length; i++) {
      const creation = selectedCreations[i];
      if (creation.exportedImageUrl) {
        const response = await fetch(creation.exportedImageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `carrossel-${i + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Pequeno delay entre downloads
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
    
    toast.success("Download concluído!");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Carregando criações...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Modo Carrossel
          </h1>
          <p className="text-slate-600">
            Crie sequências de 2-10 imagens para posts carrossel no Instagram
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview do Carrossel */}
          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Preview do Carrossel</h2>
                <span className="text-sm text-slate-600">
                  {selectedCreations.length}/10 imagens
                </span>
              </div>
              
              {selectedCreations.length > 0 ? (
                <div>
                  {/* Preview da imagem atual */}
                  <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl overflow-hidden mb-4">
                    {selectedCreations[previewIndex]?.exportedImageUrl ? (
                      <img
                        src={selectedCreations[previewIndex].exportedImageUrl}
                        alt={`Slide ${previewIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">✨</span>
                      </div>
                    )}
                    
                    {/* Indicador de posição */}
                    <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {previewIndex + 1}/{selectedCreations.length}
                    </div>
                  </div>
                  
                  {/* Controles de navegação */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                      disabled={previewIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewIndex(Math.min(selectedCreations.length - 1, previewIndex + 1))}
                      disabled={previewIndex === selectedCreations.length - 1}
                    >
                      Próximo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  
                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedCreations.map((creation, index) => (
                      <div
                        key={index}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 ${
                          index === previewIndex ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setPreviewIndex(index)}
                      >
                        {creation.exportedImageUrl ? (
                          <img
                            src={creation.exportedImageUrl}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="text-xl">✨</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={downloadCarousel}
                    disabled={selectedCreations.length < 2}
                    className="w-full mt-4"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Carrossel ({selectedCreations.length} imagens)
                  </Button>
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                  <Grid3x3 className="w-16 h-16 text-primary/30 mb-4" />
                  <p className="text-slate-600 mb-2">Nenhuma imagem selecionada</p>
                  <p className="text-sm text-slate-500">
                    Adicione de 2 a 10 criações para formar seu carrossel
                  </p>
                </div>
              )}
            </Card>
            
            {/* Ordem do Carrossel */}
            {selectedCreations.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">Ordem das Imagens</h2>
                <div className="space-y-2">
                  {selectedCreations.map((creation, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted rounded-2xl"
                    >
                      <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      {creation.exportedImageUrl && (
                        <img
                          src={creation.exportedImageUrl}
                          alt={creation.text}
                          className="w-12 h-12 object-cover rounded-xl"
                        />
                      )}
                      <p className="flex-1 text-sm line-clamp-1">{creation.text}</p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveDown(index)}
                          disabled={index === selectedCreations.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCarousel(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          {/* Biblioteca de Criações */}
          <div>
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Suas Criações</h2>
              <p className="text-sm text-slate-600 mb-4">
                Clique em uma criação para adicionar ao carrossel
              </p>
              
              <div className="grid grid-cols-2 gap-3 max-h-[800px] overflow-y-auto">
                {creations?.map((creation: any) => (
                  <div
                    key={creation.id}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedCreations.find((c) => c.id === creation.id)
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-primary/50"
                    }`}
                    onClick={() => addToCarousel(creation)}
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
                    {selectedCreations.find((c) => c.id === creation.id) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs line-clamp-2">{creation.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
