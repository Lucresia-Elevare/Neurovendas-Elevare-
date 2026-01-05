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

export default function GenerateEbookNew() {
  const [, setLocation] = useLocation();
  const [projectId, setProjectId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<"educational" | "marketing" | "storytelling">("educational");
  const { showToast, ToastComponent } = useToast();

  // Load projectId from URL and fetch project data
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

  // Load existing project data
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

      // Load generated content if it exists
      if (result.generatedContent?.content) {
        setGeneratedContent(result.generatedContent.content);
      } else {
        // If no content, generate it now
        await generateContent(result);
      }
    } catch (err) {
      console.error("Error loading project:", err);
      setError("Erro ao carregar projeto.");
      showToast("Erro ao carregar projeto", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate content if not already generated
  const generateContent = async (project: any) => {
    try {
      const response = await fetch("/trpc/ebooks.generateStructuredContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            theme: project.theme || "E-book",
            targetAudience: project.targetAudience || "Público geral",
            objective: project.objective || "Informar e educar",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const result = await response.json();
      setGeneratedContent(result.content || "");
    } catch (err) {
      console.error("Error generating content:", err);
      showToast("Erro ao gerar conteúdo", "error");
    }
  };

  const handleGeneratePDF = async () => {
    if (!projectId) {
      showToast("ID do projeto não encontrado", "error");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/trpc/ebooks.generatePDFFromStructured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            content: generatedContent,
            template: selectedTemplate,
            projectId,
            assetType: "ebook",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const result = await response.json();

      showToast("PDF gerado com sucesso!", "success");

      // Redirect to next step (Generate Cover) with projectId
      setLocation(`/generate-cover?projectId=${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar PDF");
      showToast("Erro ao gerar PDF", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !generatedContent) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-lg text-slate-600 dark:text-slate-400">Carregando projeto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      {ToastComponent}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Gerar E-book - Passo 2: Diagramação
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Edite o conteúdo e escolha o template
          </p>
        </div>

        <ProgressStepper currentStep={2} steps={steps} projectId={projectId} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Conteúdo do E-book
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Edite o conteúdo gerado
            </label>
            <textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white font-mono text-sm"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Escolha o Template
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {["educational", "marketing", "storytelling"].map((template) => (
              <button
                key={template}
                onClick={() => setSelectedTemplate(template as any)}
                className={`p-6 border-2 rounded-lg transition-all ${
                  selectedTemplate === template
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
                }`}
              >
                <div className="text-4xl mb-2">
                  {template === "educational" && "📚"}
                  {template === "marketing" && "🎯"}
                  {template === "storytelling" && "📖"}
                </div>
                <div className="font-semibold text-slate-900 dark:text-white capitalize">
                  {template}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setLocation("/generate-content")}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Gerando PDF..." : "Gerar PDF e Continuar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
