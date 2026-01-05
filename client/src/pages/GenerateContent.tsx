import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProgressStepper from "../components/ProgressStepper";
import Breadcrumb from "../components/Breadcrumb";
import { useToast } from "../components/Toast";

// Zod schema for validation
const contentSchema = z.object({
  theme: z.string().min(3, "Tema deve ter no mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  targetAudience: z.string().min(3, "Público-alvo deve ter no mínimo 3 caracteres").max(100, "Máximo 100 caracteres"),
  objective: z.string().min(10, "Objetivo deve ter no mínimo 10 caracteres").max(500, "Máximo 500 caracteres"),
});

type ContentFormData = z.infer<typeof contentSchema>;

const steps = [
  { number: 1, title: "Conteúdo", description: "Tema e objetivo", href: "/generate-content" },
  { number: 2, title: "Diagramação", description: "Editar conteúdo", href: "/generate-ebook-new" },
];

export default function GenerateContent() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>();
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);
  const { showToast, ToastComponent } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    mode: "onChange", // Enable real-time validation
  });

  // Watch form values for character count
  const theme = watch("theme") || "";
  const targetAudience = watch("targetAudience") || "";
  const objective = watch("objective") || "";

  // Check if we're editing an existing project
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("projectId");
    
    if (id) {
      // If projectId exists, skip to diagramação step
      setProjectId(id);
      setLocation(`/generate-ebook-new?projectId=${id}`);
    }
  }, []);

  const onSubmit = async (data: ContentFormData) => {
    setIsLoading(true);
    setError(null);
    setRetryAction(null);

    try {
      // Generate content using LLM
      const contentResponse = await fetch("/trpc/ebooks.generateStructuredContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: data,
        }),
      });

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json().catch(() => ({}));
        if (contentResponse.status === 429) {
          throw new Error("RATE_LIMIT");
        } else if (contentResponse.status >= 500) {
          throw new Error("SERVER_ERROR");
        }
        throw new Error("GENERATION_ERROR");
      }

      const contentResult = await contentResponse.json();

      // Save as draft project
      const saveResponse = await fetch("/trpc/ebooks.saveProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            title: data.theme,
            theme: data.theme,
            targetAudience: data.targetAudience,
            objective: data.objective,
            status: "draft",
          },
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("SAVE_ERROR");
      }

      const saveResult = await saveResponse.json();
      const newProjectId = saveResult.id;

      showToast("Conteúdo gerado com sucesso!", "success");

      // Redirect to next step with projectId
      setLocation(`/generate-ebook-new?projectId=${newProjectId}`);
    } catch (err) {
      // Categorize errors and provide actionable feedback
      const errorMessage = err instanceof Error ? err.message : "UNKNOWN_ERROR";
      
      if (errorMessage === "RATE_LIMIT") {
        setError("Muitas requisições. Por favor, aguarde 1 minuto e tente novamente.");
        setRetryAction(() => () => setTimeout(() => onSubmit(data), 60000));
      } else if (errorMessage === "SERVER_ERROR") {
        setError("Nossos servidores estão temporariamente indisponíveis. Por favor, tente novamente.");
        setRetryAction(() => () => onSubmit(data));
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        setError("Sem conexão com a internet. Verifique sua rede e tente novamente.");
        setRetryAction(() => () => onSubmit(data));
      } else {
        setError("Algo deu errado ao gerar conteúdo. Nossa equipe foi notificada. Por favor, tente novamente.");
        setRetryAction(() => () => onSubmit(data));
      }
      
      showToast("Erro ao gerar conteúdo", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
      {ToastComponent}
      
      {/* Loading overlay with better feedback */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg text-center max-w-md shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="animate-spin h-16 w-16 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
              Gerando Conteúdo com IA
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Isso pode levar de 30 a 60 segundos...
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              Por favor, não feche esta janela
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
            Gerar E-book - Passo 1: Conteúdo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Defina o tema, público-alvo e objetivo do seu e-book
          </p>
        </div>

        <ProgressStepper 
          currentStep={1} 
          steps={steps}
          projectId={projectId}
          allowBackNavigation={false}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-300 font-medium">Ops!</p>
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                {retryAction && (
                  <button
                    onClick={() => retryAction()}
                    className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 md:p-8 shadow-md border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tema do E-book *
                <span className="ml-2 text-xs text-slate-500" title="Defina o assunto principal do seu e-book">
                  ℹ️ O que você vai ensinar?
                </span>
              </label>
              <input
                {...register("theme")}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors ${
                  errors.theme ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                }`}
                placeholder="Digite o tema do seu e-book (ex: Como Vender Mais Usando Psicologia)"
              />
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${errors.theme ? "text-red-600 dark:text-red-400" : "text-slate-500"}`}>
                  {errors.theme ? errors.theme.message : "Mínimo 3 caracteres"}
                </span>
                <span className="text-xs text-slate-400">{theme.length}/100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Público-Alvo *
                <span className="ml-2 text-xs text-slate-500" title="Para quem é este e-book">
                  ℹ️ Quem vai ler?
                </span>
              </label>
              <input
                {...register("targetAudience")}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors ${
                  errors.targetAudience ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                }`}
                placeholder="Para quem é este e-book? (ex: Empreendedores, Estudantes, Vendedores)"
              />
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${errors.targetAudience ? "text-red-600 dark:text-red-400" : "text-slate-500"}`}>
                  {errors.targetAudience ? errors.targetAudience.message : "Mínimo 3 caracteres"}
                </span>
                <span className="text-xs text-slate-400">{targetAudience.length}/100</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Objetivo *
                <span className="ml-2 text-xs text-slate-500" title="O que o leitor vai aprender">
                  ℹ️ Qual o resultado esperado?
                </span>
              </label>
              <textarea
                {...register("objective")}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white transition-colors ${
                  errors.objective ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                }`}
                placeholder="Descreva o objetivo do e-book (ex: Ensinar técnicas práticas de neurovendas para aumentar conversões em até 40%)"
              />
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${errors.objective ? "text-red-600 dark:text-red-400" : "text-slate-500"}`}>
                  {errors.objective ? errors.objective.message : "Mínimo 10 caracteres"}
                </span>
                <span className="text-xs text-slate-400">{objective.length}/500</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </>
              ) : (
                "Gerar Conteúdo e Continuar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
