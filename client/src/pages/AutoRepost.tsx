import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Plus, Play, Pause, Trash2, RefreshCw, Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function AutoRepost() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [newRule, setNewRule] = useState({
    title: "",
    minEngagement: 50,
    intervalDays: 30,
  });

  const { data: rules = [], refetch: refetchRules } = trpc.autoRepost.listRules.useQuery();
  const { data: eligiblePosts = [] } = trpc.autoRepost.getEligiblePosts.useQuery(
    { ruleId: selectedRuleId! },
    { enabled: selectedRuleId !== null }
  );

  const createRuleMutation = trpc.autoRepost.createRule.useMutation({
    onSuccess: () => {
      toast.success("Regra criada com sucesso!");
      refetchRules();
      setIsCreateModalOpen(false);
      setNewRule({ title: "", minEngagement: 50, intervalDays: 30 });
    },
  });

  const toggleRuleMutation = trpc.autoRepost.toggleRule.useMutation({
    onSuccess: () => {
      toast.success("Status da regra atualizado!");
      refetchRules();
    },
  });

  const deleteRuleMutation = trpc.autoRepost.deleteRule.useMutation({
    onSuccess: () => {
      toast.success("Regra deletada!");
      refetchRules();
      setSelectedRuleId(null);
    },
  });

  const executeRepostMutation = trpc.autoRepost.executeRepost.useMutation({
    onSuccess: (data) => {
      toast.success(`Post agendado para ${new Date(data.scheduledFor).toLocaleDateString()}!`);
    },
  });

  const handleCreateRule = () => {
    if (!newRule.title.trim()) {
      toast.error("Digite um título para a regra");
      return;
    }

    createRuleMutation.mutate(newRule);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Auto-Repost
          </h1>
          <p className="text-muted-foreground mt-2">
            Republique automaticamente seus posts de maior sucesso
          </p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Nova Regra
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Regra de Auto-Repost</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Título da Regra</Label>
                <Input
                  placeholder="Ex: Posts com +50 curtidas"
                  value={newRule.title}
                  onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Engajamento Mínimo (curtidas + comentários + compartilhamentos)</Label>
                <Input
                  type="number"
                  min="1"
                  value={newRule.minEngagement}
                  onChange={(e) => setNewRule({ ...newRule, minEngagement: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Intervalo Mínimo (dias desde publicação original)</Label>
                <Input
                  type="number"
                  min="1"
                  max="365"
                  value={newRule.intervalDays}
                  onChange={(e) => setNewRule({ ...newRule, intervalDays: parseInt(e.target.value) })}
                />
              </div>
              <Button
                onClick={handleCreateRule}
                disabled={createRuleMutation.isPending}
                className="w-full"
              >
                {createRuleMutation.isPending ? "Criando..." : "Criar Regra"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Regras */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Suas Regras</h2>
        {rules.length === 0 ? (
          <Card className="p-8 text-center">
            <RefreshCw className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhuma regra criada ainda. Crie sua primeira regra para começar!
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card
                key={rule.id}
                className={`p-6 cursor-pointer transition-all ${
                  selectedRuleId === rule.id ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setSelectedRuleId(rule.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{rule.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.isActive === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {rule.isActive === 1 ? "Ativa" : "Pausada"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Engajamento mínimo: {rule.minEngagement}</p>
                      <p>• Intervalo: {rule.intervalDays} dias</p>
                      <p className="text-xs mt-2">
                        Criada em {new Date(rule.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRuleMutation.mutate({ id: rule.id });
                      }}
                    >
                      {rule.isActive === 1 ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Deletar esta regra?")) {
                          deleteRuleMutation.mutate({ id: rule.id });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Posts Elegíveis */}
      {selectedRuleId && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Posts Elegíveis para Repost (Top 10)
          </h2>
          {eligiblePosts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Nenhum post elegível encontrado para esta regra.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {eligiblePosts.map((post: any) => {
                const engagement = (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
                return (
                  <Card key={post.publicationId} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            {post.format}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Publicado em {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-3 line-clamp-2">{post.text}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-blue-500" />
                            <span>{post.comments || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4 text-green-500" />
                            <span>{post.shares || 0}</span>
                          </div>
                          <div className="ml-auto font-semibold text-purple-600">
                            Total: {engagement}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => executeRepostMutation.mutate({ creationId: post.creationId })}
                        disabled={executeRepostMutation.isPending}
                        className="ml-4"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Repostar
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
