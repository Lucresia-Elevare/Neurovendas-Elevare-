# 🚀 Roadmap de Implementação - Elevare/LucresIA

## Priorização: Quick Wins + Alto Impacto

---

## 🎯 FASE 1: SIMPLIFICAÇÃO (Semanas 1-2)
**Objetivo**: Reduzir fricção na criação de conteúdo

### 1.1 Modo Criação Rápida

#### Arquivos a Criar/Modificar:
```
client/src/pages/QuickCreate.tsx (NOVO)
client/src/components/PresetSelector.tsx (NOVO)
client/src/components/StepIndicator.tsx (NOVO)
shared/strategicPresets.ts (NOVO)
```

#### Estrutura de Dados - Strategic Presets
```typescript
// shared/strategicPresets.ts

export interface StrategicPreset {
  id: string;
  name: string;
  objective: 'venda' | 'engajamento' | 'autoridade' | 'trafego';
  procedure?: 'botox' | 'peeling' | 'harmonizacao' | 'limpeza_pele' | 'laser' | null;
  
  template: {
    layout: 'before-after' | 'testimonial' | 'promo' | 'education' | 'urgency';
    
    // Copy Formula usando NeuroVendas
    copyFormula: string;  
    // Ex: "[PROBLEMA] → [SOLUÇÃO] + [PROVA SOCIAL] + [CTA URGÊNCIA]"
    
    // Design automático
    palette: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      background: string;
    };
    
    font: {
      title: string;
      body: string;
    };
    
    // Elementos visuais pré-incluídos
    visualElements: {
      type: 'icon' | 'badge' | 'divider' | 'frame';
      id: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
    }[];
    
    // Alinhamento e formatação
    textAlign: 'left' | 'center' | 'right';
    textPosition: 'top' | 'middle' | 'bottom';
    
    // Efeitos de imagem
    imageEffects: {
      blur: number;
      brightness: number;
      contrast: number;
      fadeOverlay: number;
    };
  };
  
  // Prompt guide para LucresIA
  aiPromptGuide: string;
  
  // Exemplos de uso
  examples: string[];
  
  // Tags para busca
  tags: string[];
}

export const STRATEGIC_PRESETS: StrategicPreset[] = [
  {
    id: 'transformacao-incrivel',
    name: '✨ Transformação Incrível',
    objective: 'venda',
    procedure: null,  // Aplica-se a todos
    
    template: {
      layout: 'before-after',
      copyFormula: '[ANTES FRUSTRAÇÃO] → [DEPOIS RESULTADO] + [CTA URGÊNCIA]',
      
      palette: {
        primary: '#FFC0CB',
        secondary: '#FFE4E1',
        accent: '#FF69B4',
        text: '#4A4A4A',
        background: '#FFF5F7'
      },
      
      font: {
        title: 'Bebas Neue',
        body: 'Inter'
      },
      
      visualElements: [
        { type: 'divider', id: 'arrow-divider', position: { x: 50, y: 50 }, size: { width: 80, height: 80 } },
        { type: 'badge', id: 'badge-resultado', position: { x: 80, y: 10 }, size: { width: 100, height: 40 } }
      ],
      
      textAlign: 'center',
      textPosition: 'bottom',
      
      imageEffects: {
        blur: 0,
        brightness: 105,
        contrast: 110,
        fadeOverlay: 30
      }
    },
    
    aiPromptGuide: 'Enfatize a transformação visível. Use palavras sensoriais (suave, radiante, jovem). Crie urgência sem ser agressivo. Inclua prova social se possível.',
    
    examples: [
      'Olha só esse antes e depois da harmonização labial! 💋',
      'Em apenas 1 sessão de peeling: pele renovada ✨',
      'Botox no olhar: rejuvenescimento natural 🌟'
    ],
    
    tags: ['antes-depois', 'resultado', 'transformação', 'venda']
  },
  
  {
    id: 'especialista-confiavel',
    name: '🎓 Especialista Confiável',
    objective: 'autoridade',
    procedure: null,
    
    template: {
      layout: 'education',
      copyFormula: '[CERTIFICAÇÃO/ESPECIALIZAÇÃO] + [EXPERIÊNCIA/NÚMEROS] + [DIFERENCIAL]',
      
      palette: {
        primary: '#4682B4',
        secondary: '#E6F2FF',
        accent: '#1E90FF',
        text: '#2C3E50',
        background: '#F0F8FF'
      },
      
      font: {
        title: 'Roboto Slab',
        body: 'Lato'
      },
      
      visualElements: [
        { type: 'icon', id: 'certificate', position: { x: 15, y: 15 }, size: { width: 60, height: 60 } },
        { type: 'badge', id: 'badge-expert', position: { x: 70, y: 15 }, size: { width: 120, height: 50 } }
      ],
      
      textAlign: 'left',
      textPosition: 'middle',
      
      imageEffects: {
        blur: 0,
        brightness: 100,
        contrast: 100,
        fadeOverlay: 40
      }
    },
    
    aiPromptGuide: 'Destaque credenciais e experiência. Use tom profissional mas acessível. Inclua números concretos (anos de experiência, pacientes atendidos). Evite jargões técnicos.',
    
    examples: [
      '10 anos transformando sorrisos com harmonização facial',
      'Especialista em dermatologia estética - CRM 12345',
      '+500 clientes atendidas com protocolos personalizados'
    ],
    
    tags: ['autoridade', 'credibilidade', 'profissional', 'educação']
  },
  
  {
    id: 'oferta-relampago',
    name: '⚡ Oferta Relâmpago',
    objective: 'venda',
    procedure: null,
    
    template: {
      layout: 'urgency',
      copyFormula: '[DESCONTO/BENEFÍCIO] + [ESCASSEZ TEMPORAL] + [CTA DIRETO]',
      
      palette: {
        primary: '#FF6B6B',
        secondary: '#FFE5E5',
        accent: '#FF4757',
        text: '#2C3E50',
        background: '#FFF5F5'
      },
      
      font: {
        title: 'Bebas Neue',
        body: 'Poppins'
      },
      
      visualElements: [
        { type: 'badge', id: 'badge-off', position: { x: 10, y: 10 }, size: { width: 100, height: 100 } },
        { type: 'icon', id: 'timer', position: { x: 75, y: 15 }, size: { width: 60, height: 60 } }
      ],
      
      textAlign: 'center',
      textPosition: 'middle',
      
      imageEffects: {
        blur: 0,
        brightness: 110,
        contrast: 120,
        fadeOverlay: 50
      }
    },
    
    aiPromptGuide: 'Crie senso de urgência genuíno. Destaque economia em R$ ou %. Limite temporal claro (48h, até sexta, 10 vagas). CTA imperativo (Garanta já, Reserve agora).',
    
    examples: [
      '30% OFF em Botox - Apenas esta semana! ⚡',
      'Últimas 5 vagas: Limpeza de Pele + Peeling R$ 199',
      'Black Friday da beleza: Harmonização com 40% desconto!'
    ],
    
    tags: ['promoção', 'urgência', 'desconto', 'venda', 'escassez']
  },
  
  {
    id: 'depoimento-real',
    name: '💬 Depoimento Real',
    objective: 'engajamento',
    procedure: null,
    
    template: {
      layout: 'testimonial',
      copyFormula: '[NOME + FOTO] + [EXPERIÊNCIA EMOCIONAL] + [RESULTADO ESPECÍFICO]',
      
      palette: {
        primary: '#9370DB',
        secondary: '#E6E6FA',
        accent: '#8A2BE2',
        text: '#4B0082',
        background: '#F8F4FF'
      },
      
      font: {
        title: 'Playfair Display',
        body: 'Inter'
      },
      
      visualElements: [
        { type: 'icon', id: 'quote-left', position: { x: 10, y: 20 }, size: { width: 40, height: 40 } },
        { type: 'icon', id: 'stars-5', position: { x: 70, y: 15 }, size: { width: 100, height: 30 } }
      ],
      
      textAlign: 'left',
      textPosition: 'bottom',
      
      imageEffects: {
        blur: 0,
        brightness: 105,
        contrast: 105,
        fadeOverlay: 35
      }
    },
    
    aiPromptGuide: 'Use primeira pessoa. Foque na emoção (como se sentiu antes/depois). Seja específico no resultado. Mantenha naturalidade (sem exageros).',
    
    examples: [
      '"Nunca imaginei que ficaria tão natural! A Dra. Maria é incrível" - Ana, 35 anos',
      '"Minha autoestima voltou depois da harmonização" - Cliente satisfeita ⭐⭐⭐⭐⭐',
      '"Melhor investimento que já fiz na minha pele!" - Júlia'
    ],
    
    tags: ['depoimento', 'prova-social', 'testemunho', 'cliente', 'satisfação']
  },
  
  {
    id: 'procedimento-educativo',
    name: '📚 Procedimento Educativo',
    objective: 'trafego',
    procedure: null,
    
    template: {
      layout: 'education',
      copyFormula: '[PERGUNTA COMUM] + [EXPLICAÇÃO SIMPLES] + [PRÓXIMO PASSO]',
      
      palette: {
        primary: '#8FBC8F',
        secondary: '#F0FFF0',
        accent: '#2E8B57',
        text: '#2F4F2F',
        background: '#F5FFF5'
      },
      
      font: {
        title: 'Montserrat',
        body: 'Lato'
      },
      
      visualElements: [
        { type: 'icon', id: 'steps-123', position: { x: 15, y: 15 }, size: { width: 70, height: 70 } },
        { type: 'icon', id: 'info-circle', position: { x: 75, y: 20 }, size: { width: 50, height: 50 } }
      ],
      
      textAlign: 'left',
      textPosition: 'top',
      
      imageEffects: {
        blur: 0,
        brightness: 100,
        contrast: 100,
        fadeOverlay: 45
      }
    },
    
    aiPromptGuide: 'Responda uma dúvida comum. Use linguagem acessível (evite termos técnicos). Estruture em tópicos ou passos. Encerre com convite para saber mais.',
    
    examples: [
      'O que é Microagulhamento? Como funciona? Para quem é indicado?',
      'Botox x Preenchimento: Entenda a diferença de uma vez por todas!',
      '5 sinais de que você precisa de uma Limpeza de Pele profunda'
    ],
    
    tags: ['educação', 'explicação', 'dúvidas', 'procedimento', 'informação']
  },
  
  {
    id: 'day-after',
    name: '📸 Day After',
    objective: 'engajamento',
    procedure: null,
    
    template: {
      layout: 'before-after',
      copyFormula: '[RESULTADO 24H/48H] + [SURPRESA POSITIVA] + [PERGUNTA ENGAJAMENTO]',
      
      palette: {
        primary: '#FFD700',
        secondary: '#FFF8DC',
        accent: '#FFA500',
        text: '#8B4513',
        background: '#FFFEF0'
      },
      
      font: {
        title: 'Raleway',
        body: 'Inter'
      },
      
      visualElements: [
        { type: 'icon', id: 'clock-24h', position: { x: 70, y: 15 }, size: { width: 70, height: 70 } },
        { type: 'badge', id: 'badge-novo', position: { x: 15, y: 15 }, size: { width: 90, height: 45 } }
      ],
      
      textAlign: 'center',
      textPosition: 'bottom',
      
      imageEffects: {
        blur: 0,
        brightness: 110,
        contrast: 105,
        fadeOverlay: 25
      }
    },
    
    aiPromptGuide: 'Mostre evolução rápida (24-48h). Gere curiosidade. Termine com pergunta aberta para comentários. Celebre pequenas vitórias com cliente.',
    
    examples: [
      '24h depois do Peeling de Diamante! 🤩 Quem mais quer essa pele?',
      'Day After: Veja como ficou natural a harmonização! O que achou?',
      '48h de Botox: olhar descansado sem perder expressão ✨ Já fez?'
    ],
    
    tags: ['day-after', '24h', 'resultado', 'evolução', 'acompanhamento']
  },
  
  // +6 presets adicionais seguindo mesma estrutura:
  // 7. "💎 Produto em Destaque" (venda de cosmético)
  // 8. "🎯 Quiz Interativo" (engajamento - "Qual procedimento para você?")
  // 9. "🌟 Bastidores" (humanização - "Dia a dia da clínica")
  // 10. "💪 Motivacional" (engajamento - citação + marca d'água)
  // 11. "📊 Comparativo" (educação - "X vs Y: qual escolher?")
  // 12. "🎁 Bônus Exclusivo" (venda - "Agende X e ganhe Y")
];

// Helper functions
export function getPresetsByObjective(objective: StrategicPreset['objective']) {
  return STRATEGIC_PRESETS.filter(p => p.objective === objective);
}

export function getPresetsByProcedure(procedure: string) {
  return STRATEGIC_PRESETS.filter(p => 
    p.procedure === null || p.procedure === procedure
  );
}

export function searchPresets(query: string) {
  const lowerQuery = query.toLowerCase();
  return STRATEGIC_PRESETS.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.tags.some(tag => tag.includes(lowerQuery))
  );
}
```

#### Componente QuickCreate
```tsx
// client/src/pages/QuickCreate.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { STRATEGIC_PRESETS, type StrategicPreset } from '@shared/strategicPresets';
import PresetSelector from '@/components/PresetSelector';
import StepIndicator from '@/components/StepIndicator';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

type Step = 1 | 2 | 3 | 4;

export default function QuickCreate() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedPreset, setSelectedPreset] = useState<StrategicPreset | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [optimizedText, setOptimizedText] = useState<string | null>(null);
  
  // Mutations
  const optimizeMutation = trpc.aiAdvanced.optimizeText.useMutation();
  const createMutation = trpc.creations.create.useMutation();
  const publishMutation = trpc.instagram.publishPost.useMutation();
  
  // Step 1: Escolher Preset
  const handlePresetSelect = (preset: StrategicPreset) => {
    setSelectedPreset(preset);
    setCurrentStep(2);
  };
  
  // Step 2: Upload Imagens
  const handleImageUpload = (images: string[]) => {
    setUploadedImages(images);
    
    // Auto-detecta procedimento via LucresIA (opcional)
    // detectProcedure(images[0]);
    
    setCurrentStep(3);
  };
  
  // Step 3: Texto + Otimização IA
  const handleOptimize = async () => {
    if (!text.trim()) {
      toast.error('Digite um texto para otimizar');
      return;
    }
    
    try {
      const result = await optimizeMutation.mutateAsync({
        text,
        context: selectedPreset?.aiPromptGuide || ''
      });
      
      setOptimizedText(result.optimizedText);
      toast.success('Texto otimizado pela LucresIA!');
    } catch (error) {
      toast.error('Erro ao otimizar texto');
    }
  };
  
  // Step 4: Publicar
  const handlePublish = async (scheduleFor?: Date) => {
    if (!selectedPreset || !uploadedImages.length) return;
    
    try {
      // 1. Criar criação no banco
      const creation = await createMutation.mutateAsync({
        text: optimizedText || text,
        format: 'portrait',
        model: selectedPreset.template.layout as any,
        backgroundImage: uploadedImages[0],
        // ... demais propriedades do preset
      });
      
      // 2. Publicar no Instagram (ou agendar)
      if (scheduleFor) {
        // Agendar
        await trpc.schedule.create.mutate({
          creationId: creation.id,
          scheduledFor: scheduleFor,
          caption: optimizedText || text
        });
        toast.success('Post agendado com sucesso!');
      } else {
        // Publicar agora
        await publishMutation.mutateAsync({
          caption: optimizedText || text,
          imageUrl: uploadedImages[0]
        });
        toast.success('Post publicado no Instagram!');
      }
      
      setLocation('/galeria');
    } catch (error) {
      toast.error('Erro ao publicar');
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          ⚡ Criação Rápida
        </h1>
        <p className="text-slate-600">
          Do zero ao post publicado em menos de 5 minutos
        </p>
      </div>
      
      {/* Progress */}
      <StepIndicator
        steps={[
          { number: 1, label: 'Preset', completed: currentStep > 1 },
          { number: 2, label: 'Imagem', completed: currentStep > 2 },
          { number: 3, label: 'Texto', completed: currentStep > 3 },
          { number: 4, label: 'Publicar', completed: false }
        ]}
        currentStep={currentStep}
      />
      
      {/* Step Content */}
      <div className="mt-8">
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Qual é seu objetivo?</h2>
            <PresetSelector
              presets={STRATEGIC_PRESETS}
              onSelect={handlePresetSelect}
            />
          </div>
        )}
        
        {currentStep === 2 && selectedPreset && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Adicione sua imagem
            </h2>
            <Card className="p-8 border-dashed border-2">
              {/* Upload component */}
              <input
                type="file"
                accept="image/*"
                multiple={selectedPreset.template.layout === 'before-after'}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  // Process and upload images
                  // handleImageUpload(imageUrls);
                }}
              />
            </Card>
            
            {selectedPreset.template.layout === 'before-after' && (
              <p className="text-sm text-slate-600 mt-2">
                💡 Dica: Escolha 2 imagens (antes e depois)
              </p>
            )}
          </div>
        )}
        
        {currentStep === 3 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Seu texto</h2>
              <textarea
                className="w-full h-64 p-4 border rounded-lg"
                placeholder={selectedPreset?.examples[0] || 'Digite seu texto...'}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              
              <Button
                onClick={handleOptimize}
                disabled={optimizeMutation.isPending}
                className="mt-4 w-full"
              >
                {optimizeMutation.isPending ? '🤖 Otimizando...' : '✨ Otimizar com LucresIA'}
              </Button>
            </div>
            
            {optimizedText && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-purple-600">
                  ✅ Texto Otimizado
                </h2>
                <Card className="p-4 bg-purple-50">
                  <p className="whitespace-pre-wrap">{optimizedText}</p>
                </Card>
                
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="mt-4 w-full bg-gradient-to-r from-purple-600 to-cyan-500"
                >
                  Continuar →
                </Button>
              </div>
            )}
          </div>
        )}
        
        {currentStep === 4 && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">🎉 Tudo pronto!</h2>
            
            {/* Preview */}
            <Card className="mb-6 p-4">
              <img
                src={uploadedImages[0]}
                alt="Preview"
                className="max-w-md mx-auto rounded-lg"
              />
            </Card>
            
            {/* Publish Options */}
            <div className="space-y-4 max-w-md mx-auto">
              <Button
                onClick={() => handlePublish()}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500"
              >
                🚀 Publicar Agora no Instagram
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  // Open schedule modal
                }}
              >
                📅 Agendar para Depois
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setLocation('/galeria')}
              >
                Apenas Salvar (sem publicar)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 1.2 Toggle "Modo Avançado" no Studio Atual

```typescript
// client/src/pages/Studio.tsx - Adicionar no topo do componente

const [isAdvancedMode, setIsAdvancedMode] = useState(false);

// No JSX, envolver controles avançados com:
{isAdvancedMode && (
  <div className="space-y-4">
    {/* Efeitos de imagem */}
    {/* Controles de camadas */}
    {/* Elementos gráficos */}
  </div>
)}

// Adicionar toggle button
<div className="flex items-center justify-between mb-4">
  <h3 className="text-lg font-semibold">Editor</h3>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setIsAdvancedMode(!isAdvancedMode)}
  >
    {isAdvancedMode ? '⚡ Modo Rápido' : '🔧 Modo Avançado'}
  </Button>
</div>
```

---

## 🎨 FASE 2: PRESETS + FONTES + PALETAS (Semanas 3-4)

### 2.1 Biblioteca de Fontes Estratégicas

```typescript
// shared/strategicFonts.ts

export interface StrategicFont {
  name: string;
  family: string;
  googleFontUrl: string;
  purpose: string;
  bestFor: string[];
  pairing?: string;  // Fonte complementar
  previewText: string;
}

export const STRATEGIC_FONTS: StrategicFont[] = [
  {
    name: 'Playfair Display',
    family: 'Playfair Display',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
    purpose: 'Elegância & Luxo',
    bestFor: ['spa', 'harmonizacao-facial', 'procedimentos-premium'],
    pairing: 'Inter',
    previewText: 'Beleza Natural'
  },
  {
    name: 'Poppins',
    family: 'Poppins',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
    purpose: 'Modernidade',
    bestFor: ['clinica-jovem', 'micropigmentacao', 'maquiagem'],
    previewText: 'Transforme-se'
  },
  {
    name: 'Bebas Neue',
    family: 'Bebas Neue',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    purpose: 'Impacto Visual',
    bestFor: ['titulos', 'promocoes', 'urgencia'],
    pairing: 'Inter',
    previewText: 'OFERTA IMPERDÍVEL'
  },
  {
    name: 'Roboto Slab',
    family: 'Roboto Slab',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap',
    purpose: 'Confiança',
    bestFor: ['dermatologia', 'autoridade', 'educacao'],
    previewText: 'Especialista Certificada'
  },
  {
    name: 'Raleway',
    family: 'Raleway',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600&display=swap',
    purpose: 'Delicadeza',
    bestFor: ['facial', 'spa', 'tratamentos-suaves'],
    previewText: 'Sua Pele Merece'
  },
  {
    name: 'Montserrat',
    family: 'Montserrat',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap',
    purpose: 'Profissionalismo',
    bestFor: ['geral', 'corporativo', 'apresentacoes'],
    previewText: 'Resultado Comprovado'
  },
  {
    name: 'Lato',
    family: 'Lato',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
    purpose: 'Legibilidade',
    bestFor: ['carrosseis', 'textos-longos', 'educacao'],
    previewText: 'Entenda o Procedimento'
  },
  {
    name: 'Quicksand',
    family: 'Quicksand',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap',
    purpose: 'Amigável',
    bestFor: ['unhas', 'maquiagem', 'publico-jovem'],
    previewText: 'Amo Meu Resultado!'
  },
  {
    name: 'Bodoni Moda',
    family: 'Bodoni Moda',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;700&display=swap',
    purpose: 'Sofisticação',
    bestFor: ['dermatologia-premium', 'luxo', 'exclusividade'],
    previewText: 'Exclusivo VIP'
  },
  {
    name: 'Open Sans',
    family: 'Open Sans',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
    purpose: 'Universal',
    bestFor: ['geral', 'versatil'],
    previewText: 'Para Todas as Idades'
  },
  {
    name: 'Merriweather',
    family: 'Merriweather',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
    purpose: 'Tradicional',
    bestFor: ['dermatologia-classica', 'seriedade'],
    previewText: 'Tradição em Beleza'
  },
  {
    name: 'Inter',
    family: 'Inter',
    googleFontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    purpose: 'Moderna & Versátil',
    bestFor: ['geral', 'interface', 'digital'],
    previewText: 'Beleza Digital'
  }
];

// Carregar fontes dinamicamente
export function loadFont(font: StrategicFont) {
  if (document.getElementById(`font-${font.name}`)) return;
  
  const link = document.createElement('link');
  link.id = `font-${font.name}`;
  link.rel = 'stylesheet';
  link.href = font.googleFontUrl;
  document.head.appendChild(link);
}

export function suggestFont(context: {
  procedure?: string;
  objective?: string;
  text?: string;
}) {
  // Lógica de sugestão inteligente
  const matchingFonts = STRATEGIC_FONTS.filter(font =>
    context.procedure && font.bestFor.some(bf => bf.includes(context.procedure!))
  );
  
  return matchingFonts[0] || STRATEGIC_FONTS.find(f => f.name === 'Inter');
}
```

### 2.2 Paletas Estratégicas com Psicologia de Cores

```typescript
// shared/strategicPalettes.ts

export interface StrategicPalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  psychology: string;
  bestFor: string[];
  emotion: string;
  preview: {
    gradient: string;  // CSS gradient string
  };
}

export const STRATEGIC_PALETTES: StrategicPalette[] = [
  {
    id: 'rose-trust',
    name: 'Rosé Confiante',
    colors: {
      primary: '#FFC0CB',
      secondary: '#FFE4E1',
      accent: '#FF69B4',
      text: '#4A4A4A',
      background: '#FFF5F7'
    },
    psychology: 'Feminilidade, suavidade, juventude',
    bestFor: ['facial', 'harmonizacao', 'delicados'],
    emotion: 'Confiança e bem-estar',
    preview: {
      gradient: 'linear-gradient(135deg, #FFC0CB 0%, #FF69B4 100%)'
    }
  },
  {
    id: 'green-spa',
    name: 'Verde Spa',
    colors: {
      primary: '#8FBC8F',
      secondary: '#F0FFF0',
      accent: '#2E8B57',
      text: '#2F4F2F',
      background: '#F5FFF5'
    },
    psychology: 'Natureza, saúde, renovação',
    bestFor: ['spa', 'limpeza-pele', 'organicos'],
    emotion: 'Relaxamento e cura',
    preview: {
      gradient: 'linear-gradient(135deg, #8FBC8F 0%, #2E8B57 100%)'
    }
  },
  {
    id: 'clinical-blue',
    name: 'Azul Clínico',
    colors: {
      primary: '#4682B4',
      secondary: '#E6F2FF',
      accent: '#1E90FF',
      text: '#2C3E50',
      background: '#F0F8FF'
    },
    psychology: 'Confiança, higiene, tecnologia',
    bestFor: ['dermatologia', 'laser', 'medicos'],
    emotion: 'Segurança e profissionalismo',
    preview: {
      gradient: 'linear-gradient(135deg, #4682B4 0%, #1E90FF 100%)'
    }
  },
  {
    id: 'nude-elegance',
    name: 'Nude Elegante',
    colors: {
      primary: '#D4A574',
      secondary: '#F5E6D3',
      accent: '#B8956A',
      text: '#5D4E37',
      background: '#FAF8F3'
    },
    psychology: 'Elegância, naturalidade, luxo discreto',
    bestFor: ['micropigmentacao', 'sobrancelhas', 'maquiagem'],
    emotion: 'Sofisticação natural',
    preview: {
      gradient: 'linear-gradient(135deg, #D4A574 0%, #B8956A 100%)'
    }
  },
  {
    id: 'purple-premium',
    name: 'Roxo Premium',
    colors: {
      primary: '#9370DB',
      secondary: '#E6E6FA',
      accent: '#8A2BE2',
      text: '#4B0082',
      background: '#F8F4FF'
    },
    psychology: 'Luxo, exclusividade, transformação',
    bestFor: ['harmonizacao-facial', 'premium', 'vip'],
    emotion: 'Exclusividade e poder',
    preview: {
      gradient: 'linear-gradient(135deg, #9370DB 0%, #8A2BE2 100%)'
    }
  },
  // ... +15 paletas adicionais
];
```

---

## 📦 FASE 3: CAMADAS E COMPOSIÇÃO (Semanas 5-6)

### 3.1 Sistema de Camadas (Layers)

```typescript
// client/src/hooks/useLayerSystem.ts

export interface ImageLayer {
  id: string;
  type: 'background' | 'foreground' | 'overlay' | 'element';
  src: string;
  zIndex: number;
  
  // Transform
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  
  // Visual effects
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'overlay' | 'soft-light' | 'screen';
  
  // Masks
  mask?: {
    type: 'none' | 'circle' | 'rounded' | 'split-left' | 'split-right' | 'ellipse';
    borderRadius?: number;
  };
  
  // Filters
  filters?: {
    blur: number;
    brightness: number;
    contrast: number;
    saturation: number;
    grayscale: number;
  };
}

export function useLayerSystem() {
  const [layers, setLayers] = useState<ImageLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  
  const addLayer = (layer: Omit<ImageLayer, 'id' | 'zIndex'>) => {
    const newLayer: ImageLayer = {
      ...layer,
      id: nanoid(),
      zIndex: layers.length
    };
    setLayers([...layers, newLayer]);
    return newLayer.id;
  };
  
  const updateLayer = (id: string, updates: Partial<ImageLayer>) => {
    setLayers(layers.map(layer =>
      layer.id === id ? { ...layer, ...updates } : layer
    ));
  };
  
  const removeLayer = (id: string) => {
    setLayers(layers.filter(layer => layer.id !== id));
  };
  
  const reorderLayers = (fromIndex: number, toIndex: number) => {
    const reordered = [...layers];
    const [removed] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, removed);
    
    // Atualizar zIndex
    const updated = reordered.map((layer, index) => ({
      ...layer,
      zIndex: index
    }));
    setLayers(updated);
  };
  
  const bringToFront = (id: string) => {
    const layerIndex = layers.findIndex(l => l.id === id);
    if (layerIndex !== -1) {
      reorderLayers(layerIndex, layers.length - 1);
    }
  };
  
  const sendToBack = (id: string) => {
    const layerIndex = layers.findIndex(l => l.id === id);
    if (layerIndex !== -1) {
      reorderLayers(layerIndex, 0);
    }
  };
  
  return {
    layers,
    selectedLayerId,
    setSelectedLayerId,
    addLayer,
    updateLayer,
    removeLayer,
    reorderLayers,
    bringToFront,
    sendToBack
  };
}
```

### 3.2 Template Antes/Depois Automático

```typescript
// shared/beforeAfterTemplate.ts

export function createBeforeAfterTemplate(
  beforeImageUrl: string,
  afterImageUrl: string,
  style: 'split-vertical' | 'split-diagonal' | 'side-by-side' = 'split-vertical'
): ImageLayer[] {
  switch (style) {
    case 'split-vertical':
      return [
        {
          id: nanoid(),
          type: 'background',
          src: beforeImageUrl,
          zIndex: 0,
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          rotation: 0,
          opacity: 1,
          blendMode: 'normal',
          mask: {
            type: 'split-left'
          }
        },
        {
          id: nanoid(),
          type: 'foreground',
          src: afterImageUrl,
          zIndex: 1,
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          rotation: 0,
          opacity: 1,
          blendMode: 'normal',
          mask: {
            type: 'split-right'
          }
        },
        {
          id: nanoid(),
          type: 'overlay',
          src: '/assets/arrow-divider.svg',
          zIndex: 2,
          position: { x: 50, y: 50 },
          size: { width: 10, height: 10 },
          rotation: 0,
          opacity: 1,
          blendMode: 'normal'
        },
        // Labels "ANTES" e "DEPOIS"
        {
          id: nanoid(),
          type: 'element',
          src: '/assets/label-antes.svg',
          zIndex: 3,
          position: { x: 15, y: 10 },
          size: { width: 20, height: 8 },
          rotation: 0,
          opacity: 0.9,
          blendMode: 'normal'
        },
        {
          id: nanoid(),
          type: 'element',
          src: '/assets/label-depois.svg',
          zIndex: 3,
          position: { x: 65, y: 10 },
          size: { width: 20, height: 8 },
          rotation: 0,
          opacity: 0.9,
          blendMode: 'normal'
        }
      ];
      
    case 'side-by-side':
      return [
        {
          id: nanoid(),
          type: 'background',
          src: beforeImageUrl,
          zIndex: 0,
          position: { x: 0, y: 0 },
          size: { width: 48, height: 100 },
          rotation: 0,
          opacity: 1,
          blendMode: 'normal',
          mask: { type: 'rounded', borderRadius: 12 }
        },
        {
          id: nanoid(),
          type: 'foreground',
          src: afterImageUrl,
          zIndex: 0,
          position: { x: 52, y: 0 },
          size: { width: 48, height: 100 },
          rotation: 0,
          opacity: 1,
          blendMode: 'normal',
          mask: { type: 'rounded', borderRadius: 12 }
        }
      ];
      
    default:
      return [];
  }
}
```

---

## 🎭 FASE 4: LUCRES IA PROATIVA (Semanas 7-8)

### 4.1 Sidebar LucresIA com Sugestões Contextuais

```tsx
// client/src/components/LucresIASidebar.tsx

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'warning' | 'tip' | 'success' | 'action';
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface LucresIASidebarProps {
  text: string;
  hasImage: boolean;
  hasHashtags: boolean;
  hasCTA: boolean;
  engagementScore?: number;
}

export default function LucresIASidebar({
  text,
  hasImage,
  hasHashtags,
  hasCTA,
  engagementScore = 0
}: LucresIASidebarProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  // Gerar sugestões contextuais
  useEffect(() => {
    const newSuggestions: Suggestion[] = [];
    
    // Verificar imagem
    if (!hasImage) {
      newSuggestions.push({
        id: 'no-image',
        type: 'warning',
        priority: 'high',
        icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
        title: 'Adicione uma imagem',
        description: 'Posts com imagem têm 3x mais engajamento',
        action: {
          label: 'Fazer Upload',
          onClick: () => { /* trigger upload */ }
        }
      });
    }
    
    // Verificar texto
    if (!text || text.trim().length < 50) {
      newSuggestions.push({
        id: 'short-text',
        type: 'tip',
        priority: 'medium',
        icon: <Sparkles className="w-5 h-5 text-purple-500" />,
        title: 'Texto muito curto',
        description: 'Textos com 80-150 palavras performam melhor',
        action: {
          label: 'Gerar Legenda',
          onClick: () => { /* trigger caption generation */ }
        }
      });
    }
    
    // Verificar CTA
    if (text && !hasCTA) {
      newSuggestions.push({
        id: 'no-cta',
        type: 'action',
        priority: 'high',
        icon: <TrendingUp className="w-5 h-5 text-green-500" />,
        title: 'Adicione um CTA',
        description: 'Call-to-action aumenta conversão em 40%',
        action: {
          label: 'Ver Sugestões',
          onClick: () => { /* open CTA modal */ }
        }
      });
    }
    
    // Verificar hashtags
    if (!hasHashtags) {
      newSuggestions.push({
        id: 'no-hashtags',
        type: 'tip',
        priority: 'medium',
        icon: <Sparkles className="w-5 h-5 text-blue-500" />,
        title: 'Adicione hashtags',
        description: 'Hashtags estratégicas aumentam alcance',
        action: {
          label: 'Gerar Hashtags',
          onClick: () => { /* trigger hashtag generation */ }
        }
      });
    }
    
    // Tudo OK
    if (hasImage && text.length >= 50 && hasCTA && hasHashtags) {
      newSuggestions.push({
        id: 'all-good',
        type: 'success',
        priority: 'low',
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        title: 'Post otimizado! 🎉',
        description: 'Seu post está pronto para alta performance'
      });
    }
    
    setSuggestions(newSuggestions);
  }, [text, hasImage, hasHashtags, hasCTA]);
  
  return (
    <div className="fixed right-4 top-20 w-80 z-40">
      <Card className="bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-purple-200">
          <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500">
            <span className="text-white font-bold text-sm">AI</span>
          </Avatar>
          <div>
            <h3 className="font-bold text-slate-900">LucresIA</h3>
            <p className="text-xs text-slate-600">Seu estrategista de vendas</p>
          </div>
        </div>
        
        {/* Engagement Score */}
        <div className="p-4 bg-white/50 border-b border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Score de Engajamento
            </span>
            <span className="text-2xl font-bold text-purple-600">
              {engagementScore}%
            </span>
          </div>
          <Progress value={engagementScore} className="h-2" />
          <p className="text-xs text-slate-600 mt-2">
            {engagementScore >= 80 && 'Excelente! Alta chance de viralizar'}
            {engagementScore >= 60 && engagementScore < 80 && 'Bom! Algumas melhorias possíveis'}
            {engagementScore < 60 && 'Pode melhorar. Veja sugestões abaixo'}
          </p>
        </div>
        
        {/* Sugestões */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {suggestions.map(suggestion => (
            <Card
              key={suggestion.id}
              className={`p-3 border-l-4 ${
                suggestion.type === 'warning' ? 'border-orange-500 bg-orange-50' :
                suggestion.type === 'action' ? 'border-green-500 bg-green-50' :
                suggestion.type === 'success' ? 'border-green-500 bg-green-50' :
                'border-purple-500 bg-purple-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{suggestion.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-slate-900">
                      {suggestion.title}
                    </h4>
                    {suggestion.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs">
                        IMPORTANTE
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    {suggestion.description}
                  </p>
                  {suggestion.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={suggestion.action.onClick}
                      className="text-xs"
                    >
                      {suggestion.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
```

---

## ⏱️ CRONOGRAMA DE EXECUÇÃO

### Semana 1-2: Simplificação
- [ ] Criar `shared/strategicPresets.ts` com 12 presets
- [ ] Implementar `QuickCreate.tsx` (modo criação rápida)
- [ ] Adicionar toggle Modo Avançado no Studio
- [ ] Migrar funcionalidades complexas para behind toggle
- [ ] Testes de usabilidade (medir tempo de criação)

### Semana 3-4: Fontes + Paletas
- [ ] Criar `shared/strategicFonts.ts` com 12 fontes
- [ ] Criar `shared/strategicPalettes.ts` com 20 paletas
- [ ] Implementar carregamento dinâmico de fontes
- [ ] Implementar sugestão automática (font + palette pairing)
- [ ] UI de seleção visual (cards com preview)

### Semana 5-6: Camadas + Antes/Depois
- [ ] Implementar `useLayerSystem` hook
- [ ] Criar sistema de máscaras (split, circle, rounded)
- [ ] Template automático Antes/Depois
- [ ] Painel de camadas com drag-and-drop
- [ ] Blend modes (overlay, multiply, etc)

### Semana 7-8: LucresIA Proativa
- [ ] Criar `LucresIASidebar` component
- [ ] Implementar lógica de sugestões contextuais
- [ ] Score de engajamento em tempo real
- [ ] Gatilhos automáticos (sem imagem, sem CTA, etc)
- [ ] Integrar com todos os modais de IA

---

## 🎯 MÉTRICAS DE SUCESSO

### KPIs a Monitorar

**Antes vs Depois da Implementação**:

| Métrica | Atual | Meta |
|---------|-------|------|
| Tempo médio de criação | 30min | 5min |
| Taxa de conclusão de post | 40% | 80% |
| Uso de IA | 15% | 85% |
| NPS | 45 | 70 |
| Churn D7 | 60% | 25% |
| Taxa de renovação | 45% | 75% |

### Como Medir

```typescript
// Analytics events to track

analytics.track('post_creation_started');
analytics.track('post_creation_completed', {
  timeElapsed: milliseconds,
  mode: 'quick' | 'advanced',
  usedAI: boolean,
  presetUsed: string | null
});

analytics.track('ai_feature_used', {
  feature: 'optimize' | 'generate_caption' | 'predict_engagement' | 'hashtags',
  acceptedSuggestion: boolean
});

analytics.track('preset_applied', {
  presetId: string,
  objective: string
});
```

---

## 📝 NOTAS FINAIS

**Regras Obrigatórias** (do brief original):
✅ Não criar código sem solicitação explícita - Apenas especificações
✅ Não sugerir funcionalidades genéricas - Tudo focado em estética
✅ Priorizar soluções simples - Modo Rápido vs Avançado
✅ Pensar como SaaS nichado - USP clara vs Canva/Later

**Próxima Ação Recomendada**:
1. Validar este roadmap com usuários beta (5 esteticistas)
2. Prototipar Modo Criação Rápida no Figma
3. Implementar Sprint 1 (Simplificação)
4. Medir impacto antes de continuar para Fase 2

