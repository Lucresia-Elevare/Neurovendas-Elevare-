import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, ExternalLink, Download, CheckCircle2, XCircle } from "lucide-react";

export default function CanvaIntegration() {
  const { data: connection, refetch: refetchConnection } = trpc.canva.getConnection.useQuery();
  const { data: authUrl } = trpc.canva.getAuthUrl.useQuery();
  const { data: designs = [], isLoading: loadingDesigns, refetch: refetchDesigns } = trpc.canva.listDesigns.useQuery(undefined, {
    enabled: !!connection?.connected,
  });

  const importMutation = trpc.canva.importDesign.useMutation({
    onSuccess: () => {
      toast.success("Design importado com sucesso!");
      refetchDesigns();
    },
    onError: (error) => {
      toast.error(`Erro ao importar: ${error.message}`);
    },
  });

  const disconnectMutation = trpc.canva.disconnect.useMutation({
    onSuccess: () => {
      toast.success("Desconectado do Canva!");
      refetchConnection();
    },
    onError: (error) => {
      toast.error(`Erro ao desconectar: ${error.message}`);
    },
  });

  const handleConnect = () => {
    if (authUrl?.url) {
      window.location.href = authUrl.url;
    }
  };

  const handleImport = (designId: string, title: string) => {
    importMutation.mutate({ designId, title });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Integração com Canva</h1>
        <p className="text-muted-foreground mt-2">
          Importe seus designs do Canva diretamente para o Elevare
        </p>
      </div>

      {/* Status da Conexão */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Status da Conexão</h2>
            <div className="flex items-center gap-2">
              {connection?.connected ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">Conectado ao Canva</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <span className="text-muted-foreground">Não conectado</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {connection?.connected ? (
              <Button
                variant="outline"
                onClick={() => disconnectMutation.mutate()}
                disabled={disconnectMutation.isPending}
              >
                {disconnectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Desconectar
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Conectar com Canva
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de Designs */}
      {connection?.connected && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Seus Designs do Canva</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchDesigns()}
              disabled={loadingDesigns}
            >
              {loadingDesigns && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar
            </Button>
          </div>

          {loadingDesigns ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : designs.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                Nenhum design encontrado no Canva.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Crie designs no Canva e eles aparecerão aqui.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design: any) => (
                <Card key={design.id} className="overflow-hidden">
                  {design.thumbnail?.url && (
                    <img
                      src={design.thumbnail.url}
                      alt={design.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold truncate">{design.title || "Sem título"}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleImport(design.id, design.title || "Design do Canva")}
                        disabled={importMutation.isPending}
                      >
                        {importMutation.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        <Download className="mr-2 h-3 w-3" />
                        Importar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://www.canva.com/design/${design.id}`, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instruções */}
      {!connection?.connected && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-3">Como usar:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Clique em "Conectar com Canva" acima</li>
            <li>Faça login na sua conta do Canva</li>
            <li>Autorize o Elevare a acessar seus designs</li>
            <li>Seus designs aparecerão aqui automaticamente</li>
            <li>Clique em "Importar" para trazer o design para o Elevare</li>
          </ol>
        </Card>
      )}
    </div>
  );
}
