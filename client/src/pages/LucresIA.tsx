import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, Lightbulb } from "lucide-react";
import { useLocation } from "wouter";

export default function LucresIA() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header com Avatar da LucresIA */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
            AI
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            LucresIA
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sua assistente estratégica de IA especializada em <strong>LUCRO</strong> + <strong>EStética</strong>
          </p>
        </div>
        
        {/* Cards de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Otimizar Conteúdo */}
          <Card className="p-6 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl">
                🤖
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Otimizar Conteúdo</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Transformo seu texto em legendas persuasivas que convertem seguidores em clientes
            </p>
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Usar no Studio
            </Button>
          </Card>
          
          {/* Prever Engajamento */}
          <Card className="p-6 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Prever Engajamento</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Analiso seu post e prevejo o potencial de curtidas, comentários e alcance antes de publicar
            </p>
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Usar no Studio
            </Button>
          </Card>
          
          {/* Gerar Variações */}
          <Card className="p-6 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-2xl">
                📝
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Gerar Variações</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Crio 5 versões diferentes da sua legenda com tons variados: profissional, casual, urgente...
            </p>
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              Usar no Studio
            </Button>
          </Card>
          
          {/* Sugerir Emojis */}
          <Card className="p-6 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl">
                😊
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Sugerir Emojis</h3>
            </div>
            <p className="text-slate-600 mb-4">
              Analiso o contexto e sugiro emojis perfeitos para deixar seu post mais expressivo e atrativo
            </p>
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Usar no Studio
            </Button>
          </Card>
        </div>
        
        {/* Seção de Insights */}
        <Card className="p-8 shadow-2xl bg-gradient-to-br from-purple-100 to-cyan-100 border-2 border-purple-300">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-slate-900">Como a LucresIA te ajuda</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">+89% Engajamento</h3>
              <p className="text-sm text-slate-600">
                Posts otimizados pela LucresIA têm 89% mais curtidas em média
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">10x Mais Rápido</h3>
              <p className="text-sm text-slate-600">
                Crie posts profissionais em minutos, não horas
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Mais Clientes</h3>
              <p className="text-sm text-slate-600">
                Legendas persuasivas que convertem seguidores em clientes pagantes
              </p>
            </div>
          </div>
        </Card>
        
        {/* CTA Final */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => setLocation("/")} 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 py-6"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Começar a Criar com LucresIA
          </Button>
        </div>
      </div>
    </div>
  );
}
