import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../_core/hooks/useAuth";

export default function Home() {
  const { isAuthenticated, user, login } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleQuickLogin = () => {
    // For development - quick login (in production, use real auth)
    login("dev-user-123");
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950">
        <div className="max-w-6xl w-full space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="text-5xl md:text-6xl mb-4">📚</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Neurovendas Ebooks
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Bem-vindo, {user?.name || "Usuário"}! Pronto para criar algo incrível?
            </p>
          </div>

          {/* Main Actions Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link href="/generate-content">
              <a className="group relative block p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-400 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🚀</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                    Gerar Novo E-book
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Crie e-books profissionais com IA em menos de 5 minutos
                  </p>
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold">
                    Começar agora
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </Link>

            <Link href="/projects">
              <a className="group relative block p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📁</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                    Meus Projetos
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Gerencie, edite e baixe seus e-books criados
                  </p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                    Ver projetos
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </Link>

            <Link href="/dashboard">
              <a className="group relative block p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                    Dashboard
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Visualize estatísticas e métricas dos seus e-books
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                    Abrir dashboard
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </Link>

            <button
              onClick={() => setShowOnboarding(true)}
              className="group relative p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-200 dark:border-amber-800 hover:border-amber-500 overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
              <div className="relative">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💡</div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                  Como Funciona?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Aprenda a criar e-books profissionais em 3 passos simples
                </p>
                <div className="flex items-center text-amber-600 dark:text-amber-400 font-semibold">
                  Ver tutorial
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          {/* Features Banner */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              <div>
                <div className="text-3xl mb-1">🤖</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">IA Avançada</div>
              </div>
              <div>
                <div className="text-3xl mb-1">⚡</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Rápido</div>
              </div>
              <div>
                <div className="text-3xl mb-1">🎨</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Profissional</div>
              </div>
              <div>
                <div className="text-3xl mb-1">💾</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Auto-Save</div>
              </div>
            </div>
          </div>
        </div>

        {/* Onboarding Modal */}
        {showOnboarding && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Como Criar Seu E-book
                </h2>
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      Defina o Conteúdo
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Informe o tema, público-alvo e objetivo. A IA gera o conteúdo automaticamente.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-xl font-bold text-purple-600 dark:text-purple-400">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      Escolha o Template
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Selecione entre Educational, Marketing ou Storytelling. Edite o conteúdo se necessário.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xl font-bold text-green-600 dark:text-green-400">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      Gere e Baixe
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Clique em "Gerar PDF" e pronto! Seu e-book profissional está pronto para download.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/generate-content">
                <a
                  onClick={() => setShowOnboarding(false)}
                  className="mt-8 w-full block text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Começar Agora
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not authenticated - Login screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="text-6xl md:text-7xl mb-6">📚</div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Neurovendas Ebooks
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Crie e-books profissionais em minutos com o poder da inteligência artificial
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto my-8">
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">5 minutos</div>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">🤖</div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">IA Avançada</div>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Templates Pro</div>
          </div>
        </div>
        
        <button
          onClick={handleQuickLogin}
          className="px-10 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          Entrar e Começar
        </button>
        
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sistema de geração de e-books com neurovendas
        </p>
      </div>
    </div>
  );
}
