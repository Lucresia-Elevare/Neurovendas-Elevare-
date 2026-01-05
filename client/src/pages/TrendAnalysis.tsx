import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function TrendAnalysis() {
  const [, setLocation] = useLocation();
  const { data: trends, isLoading } = trpc.aiAdvanced.analyzeTrends.useQuery();

  const handleUseStyle = (trend: any) => {
    // Navegar para o Studio
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Análise de Tendências</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Análise de Tendências</h1>
        </div>
        <p className="text-muted-foreground">
          Top 10 tendências virais do Instagram para clínicas de estética
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trends?.map((trend: any, index: number) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h3 className="text-xl font-bold">#{index + 1} {trend.title}</h3>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{trend.description}</p>

            <div className="space-y-3 mb-4">
              <div>
                <p className="text-sm font-semibold mb-1">Cores Dominantes:</p>
                <div className="flex gap-2">
                  {trend.colors.map((color: string, i: number) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold">Estilo de Fonte:</p>
                <p className="text-sm text-muted-foreground">{trend.fontStyle}</p>
              </div>

              <div>
                <p className="text-sm font-semibold">Tipo de Layout:</p>
                <p className="text-sm text-muted-foreground">{trend.layoutType}</p>
              </div>
            </div>

            <Button
              onClick={() => handleUseStyle(trend)}
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Usar Este Estilo
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
