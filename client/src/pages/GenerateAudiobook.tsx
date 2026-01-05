import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import ProgressStepper from "../components/ProgressStepper";
import { useToast } from "../components/Toast";

const steps = [
  { number: 1, title: "Conteúdo", description: "Tema e objetivo" },
  { number: 2, title: "Diagramação", description: "Editar conteúdo" },
  { number: 3, title: "Capa", description: "Template visual" },
  { number: 4, title: "Audiobook", description: "Gerar áudio" },
];

export default function GenerateAudiobook() {
  const [, setLocation] = useLocation();
  const [projectId, setProjectId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const { showToast, ToastComponent } = useToast();

  // Load projectId from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("projectId");
    
    if (!id) {
      setError("ID do projeto não encontrado. Redirecionando...");
      setTimeout(() => setLocation("/generate-content"), 2000);
      return;
    }

    setProjectId(id);
    loadProjectData(id);
  }, []);

  // Load project data to get content
  const loadProjectData = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/trpc/ebooks.getProjectById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { id },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load project");
      }

      const result = await response.json();

      // Load content for audiobook generation
      if (result.generatedContent?.content) {
        setContent(result.generatedContent.content);
      }

      // Check if audiobook already exists
      if (result.generatedContent?.audioUrl) {
        setAudioUrl(result.generatedContent.audioUrl);
      }
    } catch (err) {
      console.error("Error loading project:", err);
      setError("Erro ao carregar projeto.");
      showToast("Erro ao carregar projeto", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAudiobook = async () => {
    if (!projectId || !content) {
      showToast("Conteúdo não encontrado", "error");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll simulate audiobook generation
      // In production, this would call a TTS API
      showToast("Funcionalidade de geração de audiobook em desenvolvimento", "info");
      
      // Simulate audiobook generation
      setTimeout(() => {
        // Simulate an audio URL
        const simulatedAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        setAudioUrl(simulatedAudioUrl);
        showToast("Audiobook simulado gerado!", "success");
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar audiobook");
      showToast("Erro ao gerar audiobook", "error");
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    showToast("E-book completo! Redirecionando para projetos...", "success");
    setTimeout(() => {
      setLocation("/projects");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      {ToastComponent}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Gerar E-book - Passo 4: Audiobook
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gere um audiobook a partir do seu conteúdo
          </p>
        </div>

        <ProgressStepper currentStep={4} steps={steps} projectId={projectId} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Audiobook do E-book
          </h2>

          {audioUrl ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="text-6xl mb-4">🎧</div>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
                  Audiobook gerado com sucesso!
                </p>
                <audio controls className="w-full max-w-md">
                  <source src={audioUrl} type="audio/mpeg" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎙️</div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Conteúdo pronto para conversão em áudio
              </p>
              <button
                onClick={handleGenerateAudiobook}
                disabled={isLoading || !content}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Gerando Audiobook..." : "Gerar Audiobook"}
              </button>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setLocation(`/generate-cover?projectId=${projectId}`)}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Finalizar e Ver Projeto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
