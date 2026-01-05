import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
        <p className="text-2xl text-slate-600 dark:text-slate-400 mb-8">
          Página não encontrada
        </p>
        <Link href="/">
          <a className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            Voltar para Home
          </a>
        </Link>
      </div>
    </div>
  );
}
