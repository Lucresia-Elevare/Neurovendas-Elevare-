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

export default function GenerateCover() {
  const [, setLocation] = useLocation();
  const [projectId, setProjectId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
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

  // Load project data to get title
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
      setProjectTitle(result.title || "E-book");

      // Check if cover already exists
      if (result.generatedContent?.coverUrl) {
        setCoverUrl(result.generatedContent.coverUrl);
      }
    } catch (err) {
      console.error("Error loading project:", err);
      setError("Erro ao carregar projeto.");
      showToast("Erro ao carregar projeto", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCover = async () => {
    if (!projectId) {
      showToast("ID do projeto não encontrado", "error");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll simulate cover generation
      // In production, this would call an image generation API
      showToast("Funcionalidade de geração de capa em desenvolvimento", "info");
      
      // Simulate a generated cover URL
      const simulatedCoverUrl = `https://via.placeholder.com/400x600/4f46e5/ffffff?text=${encodeURIComponent(projectTitle)}`;
      setCoverUrl(simulatedCoverUrl);

      // Save cover URL to project (if we had the endpoint)
      // For now, just move to next step
      setTimeout(() => {
        showToast("Capa simulada gerada!", "success");
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar capa");
      showToast("Erro ao gerar capa", "error");
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!projectId) {
      showToast("ID do projeto não encontrado", "error");
      return;
    }

    // Redirect to next step (Generate Audiobook) with projectId
    setLocation(`/generate-audiobook?projectId=${projectId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      {ToastComponent}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Gerar E-book - Passo 3: Capa
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gere uma capa profissional para seu e-book
          </p>
        </div>

        <ProgressStepper currentStep={3} steps={steps} projectId={projectId} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Capa do E-book
          </h2>

          {coverUrl ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <img
                  src={coverUrl}
                  alt="Capa do E-book"
                  className="max-w-md rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
                />
              </div>
              <p className="text-center text-slate-600 dark:text-slate-400">
                Capa gerada com sucesso!
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Título: <strong>{projectTitle}</strong>
              </p>
              <button
                onClick={handleGenerateCover}
                disabled={isLoading}
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Gerando Capa..." : "Gerar Capa"}
              </button>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setLocation(`/generate-ebook-new?projectId=${projectId}`)}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleContinue}
              disabled={!coverUrl}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continuar para Audiobook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
