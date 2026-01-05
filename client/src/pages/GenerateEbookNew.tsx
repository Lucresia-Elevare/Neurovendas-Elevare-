import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import ProgressStepper from "../components/ProgressStepper";
import Breadcrumb from "../components/Breadcrumb";
import { useToast } from "../components/Toast";

const steps = [
  { number: 1, title: "Conteúdo", description: "Tema e objetivo", href: "/generate-content" },
  { number: 2, title: "Diagramação", description: "Editar conteúdo", href: "/generate-ebook-new" },
];

// Debounce function for auto-save
function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function GenerateEbookNew() {
  const [, setLocation] = useLocation();
  const [projectId, setProjectId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
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
      showToast("ID do projeto não encontrado", "error");
      setTimeout(() => setLocation("/generate-content"), 2000);
      return;
    }

    setProjectId(id);
    loadProjectData(id);
  }, []);

  // Auto-save functionality
  const saveContentDraft = useCallback(async (content: string, projId: string) => {
    if (!content || !projId) return;
    
    setIsSaving(true);
    try {
      await fetch("/trpc/ebooks.saveProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            id: projId,
            content: content,
            status: "draft",
          },
        }),
      });
      
      const now = new Date();
      setLastSaved(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Debounced auto-save (2 seconds after user stops typing)
  const debouncedSave = useCallback(
    debounce((content: string, projId: string) => {
      saveContentDraft(content, projId);
    }, 2000),
    []
  );

  // Trigger auto-save when content changes
  useEffect(() => {
    if (generatedContent && projectId) {
      debouncedSave(generatedContent, projectId);
    }
  }, [generatedContent, projectId, debouncedSave]);

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
      setError("Erro ao carregar projeto. Por favor, tente novamente.");
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
      showToast("Conteúdo gerado com sucesso!", "success");
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

    if (!generatedContent.trim()) {
      showToast("O conteúdo não pode estar vazio", "error");
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate PDF");
      }

      const result = await response.json();

      showToast("PDF gerado com sucesso!", "success");

      // Redirect to projects page (final step)
      setTimeout(() => setLocation("/projects"), 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao gerar PDF";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!projectId) return;
    
    await saveContentDraft(generatedContent, projectId);
    showToast("Rascunho salvo com sucesso!", "success");
  };

  if (isLoading && !generatedContent) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="animate-spin h-16 w-16 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Carregando projeto...</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
      {ToastComponent}
      
      {/* PDF Generation Loading Overlay */}
      {isLoading && generatedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg text-center max-w-md shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="animate-spin h-16 w-16 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
              Gerando PDF Profissional
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Aplicando diagramação e criando seu e-book...
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Isso pode levar até 30 segundos
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Gerar E-book" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Gerar E-book - Passo 2: Diagramação
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Edite o conteúdo e escolha o template
          </p>
        </div>

        <ProgressStepper 
          currentStep={2} 
          steps={steps} 
          projectId={projectId}
          allowBackNavigation={true}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Auto-save indicator */}
        <div className="mb-4 flex items-center justify-end text-sm">
          {isSaving ? (
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
          ) : lastSaved ? (
            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
              ✓ Salvo automaticamente às {lastSaved}
            </span>
          ) : null}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Conteúdo do E-book
            </h2>
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              💾 Salvar Rascunho
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Edite o conteúdo gerado
              <span className="ml-2 text-xs text-slate-500">
                ℹ️ Faça os ajustes necessários antes de gerar o PDF
              </span>
            </label>
            <textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={20}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white font-mono text-sm"
              placeholder="O conteúdo do seu e-book aparecerá aqui..."
            />
            <p className="mt-1 text-xs text-slate-500">
              {generatedContent.length} caracteres • Auto-save ativado
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Escolha o Template
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { id: "educational", icon: "📚", name: "Educational", desc: "Didático e estruturado" },
              { id: "marketing", icon: "🎯", name: "Marketing", desc: "Persuasivo e direto" },
              { id: "storytelling", icon: "📖", name: "Storytelling", desc: "Narrativo e envolvente" }
            ].map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id as any)}
                className={`p-6 border-2 rounded-lg transition-all ${
                  selectedTemplate === template.id
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-200 dark:ring-indigo-800"
                    : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:shadow-md"
                }`}
              >
                <div className="text-4xl mb-2">{template.icon}</div>
                <div className="font-semibold text-slate-900 dark:text-white text-lg mb-1">
                  {template.name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {template.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setLocation(`/generate-content?projectId=${projectId}`)}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              ← Voltar
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={isLoading || !generatedContent.trim()}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando PDF...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Gerar PDF e Finalizar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
