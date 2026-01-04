import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { graphicElementsData, type GraphicElementData } from "@shared/graphicElements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Elements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Favoritos
  const { data: favorites = [], refetch: refetchFavorites } = trpc.favorites.list.useQuery();
  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: () => {
      toast.success("Adicionado aos favoritos!");
      refetchFavorites();
    },
  });
  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      toast.success("Removido dos favoritos!");
      refetchFavorites();
    },
  });
  
  const isFavorite = (elementId: string) => favorites.includes(elementId);
  
  const toggleFavorite = (elementId: string) => {
    if (isFavorite(elementId)) {
      removeFavoriteMutation.mutate({ elementId });
    } else {
      addFavoriteMutation.mutate({ elementId });
    }
  };
  
  // Filtrar elementos
  const filteredElements = graphicElementsData.filter((element) => {
    const matchesSearch = searchQuery === "" ||
      element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      element.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
      (selectedCategory === "favorites" ? isFavorite(element.id) : element.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });
  
  // Agrupar por categoria
  const categories = [
    { id: "all", label: "Todos", count: graphicElementsData.length },
    { id: "favorites", label: "❤️ Favoritos", count: favorites.length },
    { id: "sticker", label: "Stickers", count: graphicElementsData.filter((e) => e.category === "sticker").length },
    { id: "seal", label: "Selos", count: graphicElementsData.filter((e) => e.category === "seal").length },
    { id: "icon", label: "Ícones", count: graphicElementsData.filter((e) => e.category === "icon").length },
    { id: "frame", label: "Molduras", count: graphicElementsData.filter((e) => e.category === "frame").length },
    { id: "product", label: "Produtos", count: graphicElementsData.filter((e) => e.category === "product").length },
    { id: "decorative", label: "Decorativos", count: graphicElementsData.filter((e) => e.category === "decorative").length },
  ];
  
  const copyElementId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID copiado! Cole no editor para adicionar o elemento");
  };
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Biblioteca de Elementos Gráficos
          </h1>
          <p className="text-slate-600">
            Stickers, ícones, molduras e elementos decorativos para enriquecer suas composições
          </p>
        </div>
        
        {/* Barra de pesquisa */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar elementos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
        
        {/* Tabs de categorias */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="whitespace-nowrap">
                {category.label} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Grid de elementos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredElements.map((element) => (
            <Card key={element.id} className="p-4 hover:shadow-xl transition-all cursor-pointer group relative">
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 z-10 w-8 h-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(element.id);
                }}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite(element.id)
                      ? "fill-red-500 text-red-500"
                      : "text-slate-400 hover:text-red-500"
                  }`}
                />
              </Button>
              <div
                className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center mb-3 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: element.svg }}
              />
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">{element.name}</h3>
                <div className="flex flex-wrap gap-1">
                  {element.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyElementId(element.id)}
                >
                  Copiar ID
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredElements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Nenhum elemento encontrado</p>
            <p className="text-slate-400 text-sm mt-2">Tente ajustar sua busca</p>
          </div>
        )}
        
        {/* Instruções */}
        <Card className="p-6 mt-8 bg-gradient-to-br from-primary/5 to-accent/5">
          <h2 className="text-lg font-semibold mb-3">Como usar os elementos</h2>
          <ol className="space-y-2 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="font-semibold text-primary">1.</span>
              <span>Navegue pela biblioteca e encontre o elemento desejado</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">2.</span>
              <span>Clique em "Copiar ID" para copiar o identificador do elemento</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">3.</span>
              <span>No editor (Estúdio), cole o ID no campo de elementos gráficos</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-primary">4.</span>
              <span>Posicione, redimensione e rotacione o elemento conforme necessário</span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
