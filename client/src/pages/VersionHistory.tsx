import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Clock, ArrowLeft, GitCompare } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import VersionCompareModal from "@/components/VersionCompareModal";

export default function VersionHistory() {
  const [, setLocation] = useLocation();
  const [showCompareModal, setShowCompareModal] = useState(false);
  const creationId = new URLSearchParams(window.location.search).get("id");

  const { data: versions, isLoading } = trpc.creations.listVersions.useQuery(
    { creationId: Number(creationId) },
    { enabled: !!creationId }
  );

  const restoreVersionMutation = trpc.creations.restoreVersion.useMutation({
    onSuccess: () => {
      toast.success("Versão restaurada com sucesso!");
      setLocation("/galeria");
    },
    onError: () => {
      toast.error("Erro ao restaurar versão");
    },
  });

  if (!creationId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-600">ID de criação não fornecido</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleRestore = (versionId: number) => {
    if (confirm("Deseja restaurar esta versão? A versão atual será salva como nova versão.")) {
      restoreVersionMutation.mutate({ versionId });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setLocation("/galeria")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Histórico de Versões</h1>
                <p className="text-slate-600">
                  Visualize e restaure versões anteriores desta criação
                </p>
              </div>
            </div>
            
            {versions && versions.length >= 2 && (
              <Button
                onClick={() => setShowCompareModal(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Comparar Versões
              </Button>
            )}
          </div>
        </div>

        {!versions || versions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600">Nenhuma versão encontrada</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {versions.map((version, index) => (
              <Card key={version.id} className="p-6 shadow-lg">
                <div className="flex items-start gap-6">
                  {/* Preview da imagem */}
                  {version.exportedImageUrl && (
                    <img
                      src={version.exportedImageUrl}
                      alt={`Versão ${version.versionNumber}`}
                      className="w-32 h-32 object-cover rounded-2xl shadow-md"
                    />
                  )}

                  {/* Informações da versão */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">
                        Versão {version.versionNumber}
                        {index === 0 && (
                          <span className="ml-3 text-sm font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">
                            Atual
                          </span>
                        )}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <Clock className="w-4 h-4" />
                      {new Date(version.createdAt).toLocaleString("pt-BR")}
                    </div>

                    <div className="text-sm text-slate-700 space-y-1">
                      <p>
                        <strong>Texto:</strong> {version.text || "Sem texto"}
                      </p>
                      <p>
                        <strong>Formato:</strong> {version.format}
                      </p>
                      <p>
                        <strong>Modelo:</strong> {version.model}
                      </p>
                      <p>
                        <strong>Fonte:</strong> {version.font} ({version.fontSize}%)
                      </p>
                      {version.tags && (
                        <p>
                          <strong>Tags:</strong> {version.tags}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col gap-2">
                    {index !== 0 && (
                      <Button
                        onClick={() => handleRestore(version.id)}
                        disabled={restoreVersionMutation.isPending}
                      >
                        {restoreVersionMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Restaurando...
                          </>
                        ) : (
                          "Restaurar"
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setLocation(`/?edit=${version.id}`);
                      }}
                    >
                      Visualizar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de comparação de versões */}
      {versions && versions.length >= 2 && (
        <VersionCompareModal
          open={showCompareModal}
          onOpenChange={setShowCompareModal}
          versions={versions}
        />
      )}
    </div>
  );
}
