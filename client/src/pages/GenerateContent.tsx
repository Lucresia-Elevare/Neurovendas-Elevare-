import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProgressStepper from "../components/ProgressStepper";
import { useToast } from "../components/Toast";

// Zod schema for validation
const contentSchema = z.object({
  theme: z.string().min(3, "Tema deve ter no mínimo 3 caracteres"),
  targetAudience: z.string().min(3, "Público-alvo deve ter no mínimo 3 caracteres"),
  objective: z.string().min(10, "Objetivo deve ter no mínimo 10 caracteres"),
});

type ContentFormData = z.infer<typeof contentSchema>;

const steps = [
  { number: 1, title: "Conteúdo", description: "Tema e objetivo" },
  { number: 2, title: "Diagramação", description: "Editar conteúdo" },
  { number: 3, title: "Capa", description: "Template visual" },
  { number: 4, title: "Audiobook", description: "Gerar áudio" },
];

export default function GenerateContent() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>();
  const { showToast, ToastComponent } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
  });

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
        throw new Error("Failed to generate content");
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
        throw new Error("Failed to save project");
      }

      const saveResult = await saveResponse.json();
      const newProjectId = saveResult.id;

      showToast("Conteúdo gerado com sucesso!", "success");

      // Redirect to next step with projectId
      setLocation(`/generate-ebook-new?projectId=${newProjectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar conteúdo");
      showToast("Erro ao gerar conteúdo", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      {ToastComponent}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Gerar E-book - Passo 1: Conteúdo
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Defina o tema, público-alvo e objetivo do seu e-book
          </p>
        </div>

        <ProgressStepper currentStep={1} steps={steps} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tema do E-book *
              </label>
              <input
                {...register("theme")}
                type="text"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                placeholder="Ex: Neurovendas para Iniciantes"
              />
              {errors.theme && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.theme.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Público-Alvo *
              </label>
              <input
                {...register("targetAudience")}
                type="text"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                placeholder="Ex: Empreendedores e vendedores B2B"
              />
              {errors.targetAudience && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.targetAudience.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Objetivo *
              </label>
              <textarea
                {...register("objective")}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white"
                placeholder="Ex: Ensinar técnicas práticas de neurovendas para aumentar conversões..."
              />
              {errors.objective && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.objective.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Gerando..." : "Gerar Conteúdo e Continuar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
