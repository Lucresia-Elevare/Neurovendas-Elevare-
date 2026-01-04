import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Link, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Studio from "./pages/Studio";
import Gallery from "./pages/Gallery";
import Templates from "./pages/Templates";
import Schedule from "./pages/Schedule";
import Carousel from "./pages/Carousel";
import Analytics from "./pages/Analytics";
import Elements from "./pages/Elements";
import Credits from "./pages/Credits";
import MyTemplates from "./pages/MyTemplates";
import ColorPalettes from "./pages/ColorPalettes";
import VersionHistory from "./pages/VersionHistory";
import InstagramSettings from "./pages/InstagramSettings";
import TemplatePerformance from "./pages/TemplatePerformance";
import Campaigns from "./pages/Campaigns";
import AutoRepost from "./pages/AutoRepost";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import ContentCalendar from "./pages/ContentCalendar";
import CanvaIntegration from "./pages/CanvaIntegration";
import TrendAnalysis from "./pages/TrendAnalysis";
import Postar from "./pages/Postar";
import Resultados from "./pages/Resultados";
import LucresIA from "./pages/LucresIA";
import GeradorMateriais from "./pages/GeradorMateriais";

import { useAuth } from "./_core/hooks/useAuth";
import { Button } from "./components/ui/button";
import { getLoginUrl } from "./const";
import { Loader2 } from "lucide-react";
import { trpc } from "./lib/trpc";

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, loading, logout } = useAuth();
  const { data: notificationCount = 0 } = trpc.notifications.getCount.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 60000, // Atualizar a cada 1 minuto
  });
  
  // Sistema de desbloqueio baseado em posts criados
  const { data: creations } = trpc.creations.list.useQuery(undefined, { enabled: !!user });
  const postsCount = creations?.length || 0;
  const scheduledCount = creations?.filter((c: any) => c.scheduledFor).length || 0;
  
  const isCompetitorsUnlocked = postsCount >= 5;
  const isTrendsUnlocked = postsCount >= 10;
  const isCampaignsUnlocked = scheduledCount >= 1;
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-bold text-white">TP</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-slate-900">TextPop</h1>
        <p className="text-slate-600 mb-6">Gerador de conteúdo para Instagram</p>
        <Button onClick={() => window.location.href = getLoginUrl()} size="lg" className="w-full">
          Entrar para começar
        </Button>
      </div>
    </div>
  );
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-3xl shadow-lg">
                ✨
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Elevare</h1>
                <p className="text-xs text-muted-foreground">Conteúdo visual para estética</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-2">
              <Link href="/">
                <Button
                  variant={location === "/" ? "default" : "ghost"}
                  className="gap-2"
                >
                  🎨 Criar
                </Button>
              </Link>
              <Link href="/postar">
                <Button
                  variant={location === "/postar" ? "default" : "ghost"}
                  className="gap-2 relative"
                >
                  📅 Postar
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/resultados">
                <Button
                  variant={location === "/resultados" ? "default" : "ghost"}
                  className="gap-2"
                >
                  📊 Resultados
                </Button>
              </Link>
              <Link href="/lucresia">
                <Button
                  variant={location === "/lucresia" ? "default" : "ghost"}
                  className="gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600"
                >
                  ✨ LucresIA
                </Button>
              </Link>
              
              {/* Dropdown Mais */}
              <div className="relative group">
                <Button variant="ghost" className="gap-2">
                  ⚙️ Mais ▾
                </Button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-2 space-y-1">
                    <Link href="/galeria">
                      <Button variant="ghost" className="w-full justify-start">
                        🖼️ Galeria
                      </Button>
                    </Link>
                    <Link href="/gerador-materiais">
                      <Button variant="ghost" className="w-full justify-start">
                        📚 Gerador de Materiais
                      </Button>
                    </Link>
                    <Link href="/templates">
                      <Button variant="ghost" className="w-full justify-start">
                        📋 Templates
                      </Button>
                    </Link>
                    <Link href="/elements">
                      <Button variant="ghost" className="w-full justify-start">
                        🎨 Elementos
                      </Button>
                    </Link>
                    <Link href="/credits">
                      <Button variant="ghost" className="w-full justify-start">
                        💳 Créditos
                      </Button>
                    </Link>
                    <div className="border-t border-slate-200 my-2"></div>
                    <Link href="/instagram-settings">
                      <Button variant="ghost" className="w-full justify-start">
                        📱 Conectar Instagram
                      </Button>
                    </Link>
                    <Link href="/meus-templates">
                      <Button variant="ghost" className="w-full justify-start">
                        📚 Meus Templates
                      </Button>
                    </Link>
                    <div className="border-t border-slate-200 my-2"></div>
                    <div className="px-2 py-1 text-xs font-semibold text-slate-500">Avançado</div>
                    <Button 
                      variant="ghost" 
                      onClick={() => isCompetitorsUnlocked && (window.location.href = "/concorrentes")}
                      disabled={!isCompetitorsUnlocked}
                      className={`w-full justify-start ${!isCompetitorsUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isCompetitorsUnlocked ? '🔍' : '🔒'} Concorrentes {!isCompetitorsUnlocked && <span className="ml-auto text-xs text-orange-600">({5 - postsCount} posts)</span>}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => isTrendsUnlocked && (window.location.href = "/tendencias")}
                      disabled={!isTrendsUnlocked}
                      className={`w-full justify-start ${!isTrendsUnlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isTrendsUnlocked ? '📈' : '🔒'} Tendências {!isTrendsUnlocked && <span className="ml-auto text-xs text-orange-600">({10 - postsCount} posts)</span>}
                    </Button>
                    <div className="border-t border-slate-200 my-2"></div>
                    <Button variant="ghost" onClick={() => logout()} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      🚪 Sair
                    </Button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main>{children}</main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-2xl flex items-center justify-center text-lg">
                ✨
              </div>
              <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Elevare</span>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Perguntas frequentes</a>
              <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Termos de Serviço</a>
            </div>
            
            <p className="text-muted-foreground">
              © 2026 Elevare - Conteúdo visual para estética
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Studio} />
        <Route path="/postar" component={Postar} />
        <Route path="/resultados" component={Resultados} />
              <Route path="/lucresia" component={LucresIA} />
              <Route path="/gerador-materiais" component={GeradorMateriais} />
        <Route path="/galeria" component={Gallery} />
          <Route path="/templates" component={Templates} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/carousel" component={Carousel} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/elements" component={Elements} />
          <Route path="/credits" component={Credits} />
      <Route path="/meus-templates" component={MyTemplates} />
      <Route path="/paletas" component={ColorPalettes} />
      <Route path="/versoes" component={VersionHistory} />
      <Route path="/instagram-settings" component={InstagramSettings} />
      <Route path="/performance" component={TemplatePerformance} />
      <Route path="/campanhas" component={Campaigns} />
      <Route path="/auto-repost" component={AutoRepost} />
      <Route path="/concorrentes" component={CompetitorAnalysis} />
      <Route path="/calendario" component={ContentCalendar} />
          <Route path="/canva" component={CanvaIntegration} />
          <Route path="/tendencias" component={TrendAnalysis} />
      <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
