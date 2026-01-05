import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";

interface ProjectStats {
  totalProjects: number;
  completedProjects: number;
  draftProjects: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProjectStats>({ totalProjects: 0, completedProjects: 0, draftProjects: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/trpc/ebooks.getProjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { limit: 100, offset: 0 } }),
      });

      if (response.ok) {
        const result = await response.json();
        const projects = result.projects || [];
        setStats({
          totalProjects: projects.length,
          completedProjects: projects.filter((p: any) => p.status === "completed").length,
          draftProjects: projects.filter((p: any) => p.status === "draft").length,
        });
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Empty state - first time user
  if (!isLoading && stats.totalProjects === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Bem-vindo, {user?.name || "Usuário"}!
            </p>
          </div>

          {/* Empty State */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 md:p-12 shadow-md border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-6xl md:text-7xl mb-6">📚</div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Você ainda não tem e-books
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg max-w-2xl mx-auto">
              Crie seu primeiro e-book profissional em minutos usando o poder da inteligência artificial
            </p>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">IA Avançada</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Conteúdo gerado por inteligência artificial
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Rápido</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Crie e-books em menos de 5 minutos
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Profissional</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Templates de design premium
                </p>
              </div>
            </div>

            <Link href="/generate-content">
              <a className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Criar Meu Primeiro E-book
              </a>
            </Link>

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              ✨ Comece agora e veja a mágica acontecer
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Bem-vindo de volta, {user?.name || "Usuário"}!
          </p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalProjects}</div>
              <div className="text-slate-600 dark:text-slate-400">E-books Criados</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completedProjects}</div>
              <div className="text-slate-600 dark:text-slate-400">Finalizados</div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.draftProjects}</div>
              <div className="text-slate-600 dark:text-slate-400">Rascunhos</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Ações Rápidas
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/generate-content">
              <a className="flex items-center gap-3 p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group">
                <div className="text-2xl group-hover:scale-110 transition-transform">➕</div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Novo E-book
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Criar um novo e-book do zero
                  </div>
                </div>
              </a>
            </Link>

            <Link href="/projects">
              <a className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors group">
                <div className="text-2xl group-hover:scale-110 transition-transform">📁</div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Ver Projetos
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Acessar seus e-books salvos
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            💡 Dica do Dia
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            Use o template "Educational" para conteúdos didáticos, "Marketing" para vendas persuasivas, e "Storytelling" para narrativas envolventes.
          </p>
        </div>
      </div>
    </div>
  );
}
