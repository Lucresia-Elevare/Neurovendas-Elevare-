import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

interface Project {
  id: string;
  title: string;
  description?: string;
  theme?: string;
  targetAudience?: string;
  objective?: string;
  status: "draft" | "generating" | "completed" | "error";
  assetType: "ebook" | "cover" | "audiobook";
  createdAt: Date;
  updatedAt: Date;
  generatedContent?: {
    content: string;
    pdfUrl?: string;
    coverUrl?: string;
    audioUrl?: string;
  };
}

export default function ProjectDetail({ id }: { id: string }) {
  const [, navigate] = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setIsLoading(true);
    setError(null);

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
      setProject(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar projeto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/generate-ebook?projectId=${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700 animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-6"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-2">
              Erro ao Carregar Projeto
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-6">{error || "Projeto não encontrado"}</p>
            <Link href="/projects">
              <a className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Voltar para Projetos
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Project["status"]) => {
    const badges = {
      draft: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
      generating: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      error: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    };

    const labels = {
      draft: "Rascunho",
      generating: "Gerando",
      completed: "Completo",
      error: "Erro",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getAssetIcon = (assetType: Project["assetType"]) => {
    const icons = {
      ebook: "📚",
      cover: "🎨",
      audiobook: "🎧",
    };
    return icons[assetType];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/projects">
            <a className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">
              ← Voltar para Projetos
            </a>
          </Link>
        </div>

        {/* Project Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{getAssetIcon(project.assetType)}</div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {project.title}
                </h1>
                {getStatusBadge(project.status)}
              </div>
            </div>
          </div>

          {project.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Descrição
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{project.description}</p>
            </div>
          )}

          {project.theme && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tema
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{project.theme}</p>
            </div>
          )}

          {project.targetAudience && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Público-Alvo
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{project.targetAudience}</p>
            </div>
          )}

          {project.objective && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Objetivo
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{project.objective}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
            <div>
              <span className="font-semibold">Criado em:</span>{" "}
              {new Date(project.createdAt).toLocaleDateString("pt-BR")}
            </div>
            <div>
              <span className="font-semibold">Atualizado em:</span>{" "}
              {new Date(project.updatedAt).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        {/* Generated Content */}
        {project.generatedContent && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-slate-200 dark:border-slate-700 mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Conteúdo Gerado
            </h2>

            {project.generatedContent.pdfUrl && (
              <div className="mb-4">
                <a
                  href={project.generatedContent.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  📄 Baixar PDF
                </a>
              </div>
            )}

            {project.generatedContent.coverUrl && (
              <div className="mb-4">
                <a
                  href={project.generatedContent.coverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🎨 Ver Capa
                </a>
              </div>
            )}

            {project.generatedContent.audioUrl && (
              <div className="mb-4">
                <a
                  href={project.generatedContent.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🎧 Ouvir Audiobook
                </a>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleEdit}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Editar Projeto
          </button>
          <Link href="/projects">
            <a className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Voltar
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
