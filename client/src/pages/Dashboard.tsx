import { Link } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Bem-vindo de volta, {user?.name || "Usuário"}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</div>
            <div className="text-slate-600 dark:text-slate-400">E-books Criados</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</div>
            <div className="text-slate-600 dark:text-slate-400">Capas Geradas</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="text-3xl mb-2">🎧</div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</div>
            <div className="text-slate-600 dark:text-slate-400">Audiobooks</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Ações Rápidas
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/generate-content">
              <a className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <div className="text-2xl">➕</div>
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
              <a className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <div className="text-2xl">📁</div>
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
      </div>
    </div>
  );
}
