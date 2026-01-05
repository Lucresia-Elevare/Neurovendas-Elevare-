import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProgressStepper from "../components/ProgressStepper";

// Zod schemas for validation
const step1Schema = z.object({
  theme: z.string().min(3, "Tema deve ter no mínimo 3 caracteres"),
  targetAudience: z.string().min(3, "Público-alvo deve ter no mínimo 3 caracteres"),
  objective: z.string().min(10, "Objetivo deve ter no mínimo 10 caracteres"),
});

type Step1Data = z.infer<typeof step1Schema>;

const steps = [
  { number: 1, title: "Conteúdo", description: "Tema e objetivo" },
  { number: 2, title: "Diagramação", description: "Editar conteúdo" },
  { number: 3, title: "Capa", description: "Template visual" },
  { number: 4, title: "Exportar", description: "Download" },
];

export default function GenerateEbookNew() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectId, setProjectId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<"educational" | "marketing" | "storytelling">("educational");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  });

  // Check for projectId in query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("projectId");
    if (id) {
      setProjectId(id);
      // In edit mode, would load existing data here
    }
  }, []);

  const handleStep1Submit = async (data: Step1Data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call backend to generate content
      const response = await fetch("/trpc/ebooks.generateStructuredContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const result = await response.json();
      setGeneratedContent(result.content || "<h1>Conteúdo gerado com sucesso!</h1>");

      // Save as draft
      const saveResponse = await fetch("/trpc/ebooks.saveProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            id: projectId,
            title: data.theme,
            theme: data.theme,
            targetAudience: data.targetAudience,
            objective: data.objective,
            status: "draft",
          },
        }),
      });

      if (saveResponse.ok) {
        const saveResult = await saveResponse.json();
        setProjectId(saveResult.id);
      }

      setCurrentStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar conteúdo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Next = () => {
    setCurrentStep(3);
  };

  const handleStep3Next = () => {
    setCurrentStep(4);
  };

  const handleGeneratePDF = async () => {
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
      
      // Download PDF
      if (result.pdfUrl) {
        window.open(result.pdfUrl, "_blank");
      }

      alert("PDF gerado com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar PDF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Gerar E-book {projectId ? "(Editando)" : "(Novo)"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Crie seu e-book profissional em 4 passos simples
          </p>
        </div>

        <ProgressStepper currentStep={currentStep} steps={steps} projectId={projectId} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700">
          {/* Step 1: Content Input */}
          {currentStep === 1 && (
            <form onSubmit={handleSubmit(handleStep1Submit)} className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Passo 1: Defina o Conteúdo
              </h2>

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
                {isLoading ? "Gerando..." : "Gerar Conteúdo"}
              </button>
            </form>
          )}

          {/* Step 2: Edit Content */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Passo 2: Edite o Conteúdo
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Conteúdo do E-book
                </label>
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={20}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:text-white font-mono text-sm"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleStep2Next}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Choose Template */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Passo 3: Escolha o Template
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
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
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleStep3Next}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Generate PDF */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Passo 4: Gerar PDF
              </h2>

              <div className="text-center py-8">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  Seu e-book está pronto para ser gerado!
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
                  Template selecionado: <strong className="capitalize">{selectedTemplate}</strong>
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleGeneratePDF}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Gerando PDF..." : "Gerar e Baixar PDF"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
