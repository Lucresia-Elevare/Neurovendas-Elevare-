import { useState, useEffect } from "react";
import { Link } from "wouter";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "generating" | "completed" | "error";
  assetType: "ebook" | "cover" | "audiobook";
  createdAt: Date;
  updatedAt: Date;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/trpc/ebooks.getProjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            limit: 20,
            offset: 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const result = await response.json();
      setProjects(result.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar projetos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch("/trpc/ebooks.deleteProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { id },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      // Remove from list
      setProjects(projects.filter((p) => p.id !== id));
      alert("Projeto excluído com sucesso!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir projeto");
    } finally {
      setDeletingId(null);
    }
  };

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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Meus Projetos
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Gerencie seus e-books e materiais criados
            </p>
          </div>
          <Link href="/generate-ebook">
            <a className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              + Novo Projeto
            </a>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700 animate-pulse"
              >
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              Nenhum projeto ainda
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Crie seu primeiro e-book para começar
            </p>
            <Link href="/generate-ebook">
              <a className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                Criar Primeiro E-book
              </a>
            </Link>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && projects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{getAssetIcon(project.assetType)}</div>
                  {getStatusBadge(project.status)}
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                  Atualizado em {new Date(project.updatedAt).toLocaleDateString("pt-BR")}
                </div>

                <div className="flex gap-2">
                  <Link href={`/projects/${project.id}`}>
                    <a className="flex-1 px-4 py-2 bg-indigo-600 text-white text-center font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                      Ver Detalhes
                    </a>
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {deletingId === project.id ? "..." : "🗑️"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
