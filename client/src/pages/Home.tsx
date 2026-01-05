import { Link } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, user, login } = useAuth();

  const handleQuickLogin = () => {
    // For development - quick login
    login("dev-user-123");
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-indigo-950">
        <div className="max-w-4xl w-full text-center space-y-8">
          <h1 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
            Neurovendas Ebooks
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Bem-vindo, {user?.name || "Usuário"}!
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link href="/generate-content">
              <a className="block p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <div className="text-4xl mb-4">📚</div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Gerar E-book
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Crie e-books profissionais com IA
                </p>
              </a>
            </Link>

            <Link href="/projects">
              <a className="block p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <div className="text-4xl mb-4">📁</div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Meus Projetos
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Gerencie seus e-books criados
                </p>
              </a>
            </Link>

            <Link href="/dashboard">
              <a className="block p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
                <div className="text-4xl mb-4">📊</div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Dashboard
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Visualize suas estatísticas
                </p>
              </a>
            </Link>

            <a
              href="#"
              className="block p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Templates
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Em breve
              </p>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-indigo-950">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400">
          Neurovendas Ebooks
        </h1>
        <p className="text-2xl text-slate-600 dark:text-slate-300">
          Crie e-books profissionais com o poder da IA
        </p>
        
        <button
          onClick={handleQuickLogin}
          className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Entrar
        </button>
        
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sistema de geração de e-books com neurovendas
        </p>
      </div>
    </div>
  );
}
