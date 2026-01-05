import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import type { Template } from "@shared/templates";

const categories = [
  { id: "antes-depois", name: "Antes & Depois", icon: "✨" },
  { id: "promocao", name: "Promoções", icon: "🎁" },
  { id: "depoimento", name: "Depoimentos", icon: "💬" },
  { id: "procedimento", name: "Procedimentos", icon: "💉" },
  { id: "dica", name: "Dicas", icon: "💡" },
  { id: "resultado", name: "Resultados", icon: "⭐" },
] as const;

export default function Templates() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: allTemplates, isLoading } = trpc.templates.list.useQuery();
  
  const filteredTemplates = selectedCategory
    ? allTemplates?.filter((t: Template) => t.category === selectedCategory)
    : allTemplates;
  
  const handleUseTemplate = (template: Template) => {
    // Armazenar template selecionado no localStorage para usar no Studio
    localStorage.setItem("selectedTemplate", JSON.stringify(template));
    setLocation("/");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600">Carregando templates...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Templates para Estética</h1>
          <p className="text-slate-600">
            Escolha um template profissional otimizado para clínicas e profissionais de estética
          </p>
        </div>
        
        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>
        
        {/* Grid de Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates?.map((template: Template) => (
            <Card key={template.id} className="overflow-hidden shadow-xl hover:shadow-2xl transition-all">
              {/* Preview do Template */}
              <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-6 relative">
                <div
                  className="text-center"
                  style={{
                    fontFamily: template.settings.font === "Mono" ? "monospace" : template.settings.font,
                    fontSize: `${Math.min(template.settings.fontSize / 8, 20)}px`,
                    color: template.settings.textColor === "white" ? "#ffffff" : "#000000",
                    textShadow: template.settings.textOutline === 1 
                      ? `2px 2px 4px ${template.settings.textColor === "white" ? "#000000" : "#ffffff"}`
                      : "none",
                  }}
                >
                  {template.placeholderText.split("\n").map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                
                {/* Badge de Categoria */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-primary/90 text-white text-xs rounded-xl font-medium">
                  {categories.find((c) => c.id === template.category)?.icon}{" "}
                  {categories.find((c) => c.id === template.category)?.name}
                </div>
              </div>
              
              {/* Informações */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 text-slate-900">{template.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                
                {/* Detalhes */}
                <div className="flex gap-2 text-xs text-slate-500 mb-4 flex-wrap">
                  <span className="px-2 py-1 bg-accent/30 rounded-lg">
                    {template.settings.format === "square" ? "Quadrado" : template.settings.format === "portrait" ? "Retrato" : "História"}
                  </span>
                  <span className="px-2 py-1 bg-accent/30 rounded-lg">
                    {template.settings.font}
                  </span>
                  <span className="px-2 py-1 bg-accent/30 rounded-lg">
                    {template.settings.model === "classic" ? "Clássico" : template.settings.model === "bold" ? "Audacioso" : template.settings.model === "fade" ? "Desaparecer" : "Destaque"}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Usar Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {filteredTemplates && filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">Nenhum template encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
