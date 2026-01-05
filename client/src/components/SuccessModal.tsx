interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  stats?: {
    pages?: number;
    words?: number;
    template?: string;
  };
  onDownload?: () => void;
  onViewProjects?: () => void;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  stats,
  onDownload,
  onViewProjects 
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
        {/* Celebration Header with gradient */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-5xl animate-bounce">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Seu E-book Profissional Está Pronto!
          </h2>
          <p className="text-indigo-100 text-sm">
            Criado com a qualidade Elevare
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title Preview */}
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Título:</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {stats.pages && (
                <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.pages}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Páginas</div>
                </div>
              )}
              {stats.words && (
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {(stats.words / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Palavras</div>
                </div>
              )}
              {stats.template && (
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1">
                    {stats.template === "educational" && "📚 Educacional"}
                    {stats.template === "marketing" && "🎯 Marketing"}
                    {stats.template === "storytelling" && "📖 Narrativo"}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Template</div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {onDownload && (
              <button
                onClick={onDownload}
                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Baixar E-book Agora
              </button>
            )}
            
            {onViewProjects && (
              <button
                onClick={onViewProjects}
                className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Ver Todos os Projetos
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-indigo-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Footer tip */}
        <div className="px-6 pb-6">
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            💡 <span className="font-medium">Pro Tip:</span> Você pode editar qualquer projeto depois
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
