import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { COLOR_PALETTES, PALETTE_CATEGORIES } from "../../../shared/colorPalettes";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Heart } from "lucide-react";

export default function ColorPalettes() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favoritePaletteIds, setFavoritePaletteIds] = useState<Set<string>>(new Set());

  const { data: favoritePalettes } = trpc.favoritePalettes.list.useQuery();
  const addFavoriteMutation = trpc.favoritePalettes.add.useMutation();
  const removeFavoriteMutation = trpc.favoritePalettes.remove.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (favoritePalettes) {
      setFavoritePaletteIds(new Set(favoritePalettes.map(f => f.paletteId)));
    }
  }, [favoritePalettes]);

  const filteredPalettes = selectedCategory
    ? COLOR_PALETTES.filter((p) => p.category === selectedCategory)
    : COLOR_PALETTES;

  const handleApplyPalette = (paletteId: string) => {
    const palette = COLOR_PALETTES.find((p) => p.id === paletteId);
    if (palette) {
      // Salvar paleta no localStorage para aplicar no Studio
      localStorage.setItem("selectedPalette", JSON.stringify(palette));
      toast.success(`Paleta "${palette.name}" aplicada! Abra o Estúdio para usar.`);
      // Redirecionar para o Studio
      window.location.href = "/";
    }
  };

  const handleToggleFavorite = async (palette: typeof COLOR_PALETTES[0]) => {
    const isFavorite = favoritePaletteIds.has(palette.id);
    
    if (isFavorite) {
      await removeFavoriteMutation.mutateAsync({ paletteId: palette.id });
      setFavoritePaletteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(palette.id);
        return newSet;
      });
      toast.success("Paleta removida dos favoritos");
    } else {
      await addFavoriteMutation.mutateAsync({
        paletteId: palette.id,
        paletteName: palette.name,
        colors: [palette.colors.primary, palette.colors.secondary, palette.colors.accent],
      });
      setFavoritePaletteIds(prev => new Set(prev).add(palette.id));
      toast.success("Paleta adicionada aos favoritos!");
    }
    
    utils.favoritePalettes.list.invalidate();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Paletas de Cores</h1>
          <p className="text-slate-600">
            Escolha entre 23 paletas profissionais específicas para estética
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            Todas ({COLOR_PALETTES.length})
          </Button>
          {PALETTE_CATEGORIES.map((cat) => {
            const count = COLOR_PALETTES.filter((p) => p.category === cat.value).length;
            return (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Grid de Paletas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPalettes.map((palette) => (
            <Card key={palette.id} className="p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">{palette.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{palette.description}</p>

              {/* Preview de Cores */}
              <div className="space-y-2 mb-4">
                <div className="flex gap-2 items-center">
                  <div
                    className="w-12 h-12 rounded-2xl shadow-md border border-slate-200"
                    style={{ backgroundColor: palette.colors.primary }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700">Principal</p>
                    <p className="text-xs text-slate-500">{palette.colors.primary}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div
                    className="w-12 h-12 rounded-2xl shadow-md border border-slate-200"
                    style={{ backgroundColor: palette.colors.secondary }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700">Secundária</p>
                    <p className="text-xs text-slate-500">{palette.colors.secondary}</p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div
                    className="w-12 h-12 rounded-2xl shadow-md border border-slate-200"
                    style={{ backgroundColor: palette.colors.accent }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700">Destaque</p>
                    <p className="text-xs text-slate-500">{palette.colors.accent}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div
                    className="w-12 h-12 rounded-2xl shadow-md border border-slate-200"
                    style={{ backgroundColor: palette.colors.background }}
                  />
                  <div
                    className="w-12 h-12 rounded-2xl shadow-md border border-slate-200 flex items-center justify-center"
                    style={{
                      backgroundColor: palette.colors.background,
                      color: palette.colors.text,
                    }}
                  >
                    <span className="text-xs font-bold">Aa</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleToggleFavorite(palette)}
                  className={favoritePaletteIds.has(palette.id) ? "text-red-500 hover:text-red-600" : ""}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={favoritePaletteIds.has(palette.id) ? "currentColor" : "none"}
                  />
                </Button>
                <Button
                  onClick={() => handleApplyPalette(palette.id)}
                  className="flex-1"
                >
                  Aplicar Paleta
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
