# 🔧 Guia Técnico de Arquitetura - Elevare/LucresIA

**Documento Complementar ao Roadmap de Implementação**

---

## 🎯 REGRA DE OURO

> **O app deixa de ser um "editor cheio de botões" e passa a ser um orquestrador de decisões guiadas.**

### Isso Significa Tecnicamente:

✅ **UI orientada a fluxo**, não a feature
✅ **IA acoplada ao estado da jornada**, não acionada por botão
✅ **Menos telas, mais state machine**

---

## 📐 ARQUITETURA TÉCNICA-ALVO

### Stack Atual (Mantém)
- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: tRPC + Express + Drizzle ORM
- **Database**: MySQL
- **Storage**: AWS S3

### Mudança de Paradigma

#### ❌ ANTES: Arquitetura por Páginas
```
/studio       → 50+ controles desconectados
/galeria      → lista de posts
/agendamento  → calendário separado
/instagram    → configurações isoladas
```

#### ✅ DEPOIS: Arquitetura por Fluxos
```
/flows/quick-create    → State machine guiada
/flows/weekly-plan     → Wizard de planejamento
/flows/advanced-edit   → Modo profissional (opcional)
```

---

## 🏗️ COMPONENTES TÉCNICOS PRINCIPAIS

### 1. QuickCreateFlow (Prioridade Máxima)

**Estrutura de Estado**:

```typescript
// client/src/flows/quick-create/types.ts

type QuickCreateStep =
  | 'preset'      // Escolha de template estratégico
  | 'upload'      // Upload de imagem(ns)
  | 'copy'        // Texto + otimização IA
  | 'publish';    // Publicar ou agendar

interface QuickCreateState {
  // Controle de fluxo
  step: QuickCreateStep;
  canAdvance: boolean;
  
  // Dados do post
  presetId?: string;
  images?: ImageAsset[];
  caption?: string;
  hashtags?: string[];
  
  // IA e scoring
  aiSuggestions?: AISuggestion[];
  engagementScore?: number;
  
  // Analytics
  startedAt: Date;
  stepTimings: Record<QuickCreateStep, number>;
}

interface ImageAsset {
  id: string;
  url: string;
  s3Key: string;
  type: 'before' | 'after' | 'single';
  detectedProcedure?: string;  // IA detection
}

interface AISuggestion {
  id: string;
  type: 'cta' | 'hashtags' | 'text_improvement' | 'timing';
  priority: 'high' | 'medium' | 'low';
  text: string;
  action: () => void;
}
```

**Componente Central**:

```typescript
// client/src/flows/quick-create/QuickCreateFlow.tsx

import { useState, useEffect } from 'react';
import { useQuickCreateMachine } from './useQuickCreateMachine';
import PresetStep from './steps/PresetStep';
import UploadStep from './steps/UploadStep';
import CopyStep from './steps/CopyStep';
import PublishStep from './steps/PublishStep';
import StepProgress from './components/StepProgress';

export default function QuickCreateFlow() {
  const {
    state,
    canAdvance,
    nextStep,
    prevStep,
    updateState,
    submit
  } = useQuickCreateMachine();
  
  // Analytics tracking
  useEffect(() => {
    analytics.track('quick_create_step_viewed', {
      step: state.step,
      timeFromStart: Date.now() - state.startedAt.getTime()
    });
  }, [state.step]);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress indicator */}
      <StepProgress 
        current={state.step}
        steps={['preset', 'upload', 'copy', 'publish']}
      />
      
      {/* Step renderer */}
      {state.step === 'preset' && (
        <PresetStep
          onSelect={(presetId) => {
            updateState({ presetId });
            analytics.track('preset_selected', { presetId });
            nextStep();
          }}
        />
      )}
      
      {state.step === 'upload' && (
        <UploadStep
          presetId={state.presetId!}
          onUpload={(images) => {
            updateState({ images });
            analytics.track('images_uploaded', { count: images.length });
            nextStep();
          }}
          onBack={prevStep}
        />
      )}
      
      {state.step === 'copy' && (
        <CopyStep
          preset={getPresetById(state.presetId!)}
          images={state.images!}
          onComplete={(caption, hashtags, score) => {
            updateState({ caption, hashtags, engagementScore: score });
            analytics.track('copy_completed', { 
              score,
              usedAI: state.aiSuggestions?.some(s => s.applied) 
            });
            nextStep();
          }}
          onBack={prevStep}
        />
      )}
      
      {state.step === 'publish' && (
        <PublishStep
          state={state}
          onPublish={async (scheduleFor?) => {
            const result = await submit(scheduleFor);
            analytics.track('post_published', {
              totalTime: Date.now() - state.startedAt.getTime(),
              engagementScore: state.engagementScore,
              scheduled: !!scheduleFor
            });
            // Redirect to success
          }}
          onBack={prevStep}
        />
      )}
    </div>
  );
}
```

**State Machine Hook**:

```typescript
// client/src/flows/quick-create/useQuickCreateMachine.ts

import { useState, useCallback } from 'react';
import type { QuickCreateState, QuickCreateStep } from './types';

const STEP_ORDER: QuickCreateStep[] = ['preset', 'upload', 'copy', 'publish'];

export function useQuickCreateMachine() {
  const [state, setState] = useState<QuickCreateState>({
    step: 'preset',
    canAdvance: false,
    startedAt: new Date(),
    stepTimings: {} as any
  });
  
  // Validação por step
  const validateStep = useCallback((step: QuickCreateStep, data: Partial<QuickCreateState>) => {
    switch (step) {
      case 'preset':
        return !!data.presetId;
      case 'upload':
        return (data.images?.length ?? 0) > 0;
      case 'copy':
        return (data.caption?.length ?? 0) >= 20; // Mínimo de caracteres
      case 'publish':
        return true; // Sempre pode publicar se chegou aqui
      default:
        return false;
    }
  }, []);
  
  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.step);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      setState(prev => ({
        ...prev,
        step: nextStep,
        stepTimings: {
          ...prev.stepTimings,
          [prev.step]: Date.now() - prev.startedAt.getTime()
        }
      }));
    }
  }, [state.step]);
  
  const prevStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.step);
    if (currentIndex > 0) {
      setState(prev => ({ ...prev, step: STEP_ORDER[currentIndex - 1] }));
    }
  }, [state.step]);
  
  const updateState = useCallback((updates: Partial<QuickCreateState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      const canAdvance = validateStep(prev.step, newState);
      return { ...newState, canAdvance };
    });
  }, [validateStep]);
  
  const submit = useCallback(async (scheduleFor?: Date) => {
    // Call tRPC mutation
    const result = await createPostMutation.mutateAsync({
      presetId: state.presetId!,
      images: state.images!,
      caption: state.caption!,
      hashtags: state.hashtags,
      scheduleFor
    });
    return result;
  }, [state]);
  
  return {
    state,
    canAdvance: state.canAdvance,
    nextStep,
    prevStep,
    updateState,
    submit
  };
}
```

---

### 2. NeuroPreset (Core Diferencial)

**Estrutura Completa**:

```typescript
// shared/neuroPresets.ts

interface NeuroPreset {
  id: string;
  name: string;
  icon: string;
  
  // Objetivo estratégico
  goal: 'venda' | 'autoridade' | 'engajamento' | 'trafego';
  
  // Regras visuais
  layout: LayoutRule;
  colorPalette: ColorStrategy;
  typography: FontStrategy;
  
  // Framework de NeuroVendas (DIFERENCIAL)
  copyFramework: NeuroCopyFramework;
  
  // Contexto para IA
  aiPromptContext: string;
  
  // Configurações de canvas
  canvasSettings: CanvasSettings;
  
  // Exemplos e guidelines
  examples: string[];
  whenToUse: string;
}

interface LayoutRule {
  type: 'before-after' | 'testimonial' | 'urgency' | 'education' | 'product';
  
  // Zonas do canvas
  zones: {
    header?: { height: number };
    content: { position: 'top' | 'middle' | 'bottom' };
    footer?: { height: number };
  };
  
  // Elementos obrigatórios
  requiredElements: ('title' | 'subtitle' | 'cta' | 'badge' | 'divider')[];
}

interface ColorStrategy {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  
  // Justificativa psicológica
  psychology: string;
  emotion: string;
}

interface FontStrategy {
  title: {
    family: string;
    weight: number;
    size: number;
  };
  body: {
    family: string;
    weight: number;
    size: number;
  };
  
  // Propósito da escolha
  purpose: 'elegancia' | 'impacto' | 'confianca' | 'modernidade';
}

interface NeuroCopyFramework {
  // Estrutura da copy
  hook: 'dor' | 'desejo' | 'autoridade' | 'transformacao';
  proof?: 'social' | 'resultado' | 'processo' | 'estatistica';
  cta: 'agenda' | 'comente' | 'salve' | 'compartilhe' | 'link_bio';
  
  // Fórmula de vendas
  formula: string;  // Ex: "[DOR] → [SOLUÇÃO] + [PROVA] + [URGÊNCIA]"
  
  // Elementos obrigatórios no texto
  mustHave: ('emoji' | 'cta_explicito' | 'beneficio' | 'prova_social')[];
  
  // Gatilhos mentais aplicados
  triggers: ('escassez' | 'autoridade' | 'reciprocidade' | 'prova_social')[];
}

interface CanvasSettings {
  format: 'square' | 'portrait' | 'story';
  dimensions: { width: number; height: number };
  
  // Efeitos padrão
  imageEffects: {
    blur: number;
    brightness: number;
    contrast: number;
    fadeOverlay: number;
  };
}

// EXEMPLO CONCRETO
export const PRESET_TRANSFORMACAO_INCRIVEL: NeuroPreset = {
  id: 'transformacao-incrivel',
  name: '✨ Transformação Incrível',
  icon: '✨',
  goal: 'venda',
  
  layout: {
    type: 'before-after',
    zones: {
      header: { height: 15 },
      content: { position: 'middle' },
      footer: { height: 10 }
    },
    requiredElements: ['title', 'badge', 'divider']
  },
  
  colorPalette: {
    primary: '#FFC0CB',
    secondary: '#FFE4E1',
    accent: '#FF69B4',
    text: '#4A4A4A',
    background: '#FFF5F7',
    psychology: 'Rosa comunica feminilidade, suavidade e juventude',
    emotion: 'Confiança e bem-estar'
  },
  
  typography: {
    title: {
      family: 'Bebas Neue',
      weight: 700,
      size: 48
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 16
    },
    purpose: 'impacto'
  },
  
  copyFramework: {
    hook: 'transformacao',
    proof: 'resultado',
    cta: 'agenda',
    formula: '[ANTES FRUSTRAÇÃO] → [DEPOIS RESULTADO] + [CTA URGÊNCIA]',
    mustHave: ['emoji', 'cta_explicito', 'beneficio'],
    triggers: ['prova_social', 'escassez']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para um post de ANTES/DEPOIS de procedimento estético.
    
    OBJETIVO: Vender o procedimento mostrando a transformação.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Hook emocional (dor ou desejo do cliente)
    2. Descrição da transformação (antes → depois)
    3. Benefícios específicos (3-5 bullet points)
    4. Prova social (tempo de resultado, naturalidade)
    5. CTA claro (agendar avaliação)
    
    TOM: Profissional mas acolhedor. Foque em sentimentos (confiança, autoestima).
    
    GATILHOS: Escassez moderada, prova social, autoridade técnica.
    
    REGRAS:
    - Use emojis estrategicamente (não exagere)
    - Inclua CTA explícito
    - Mencione tempo de resultado (ex: "em apenas 1 sessão")
    - Evite termos técnicos excessivos
  `,
  
  canvasSettings: {
    format: 'portrait',
    dimensions: { width: 1080, height: 1350 },
    imageEffects: {
      blur: 0,
      brightness: 105,
      contrast: 110,
      fadeOverlay: 30
    }
  },
  
  examples: [
    'Olha só esse resultado incrível da harmonização labial! 💋',
    'Em apenas 1 sessão de peeling: pele renovada ✨',
    'Botox no olhar: rejuvenescimento natural 🌟'
  ],
  
  whenToUse: 'Quando você tem fotos claras de antes e depois de um procedimento e quer mostrar o resultado para vender.'
};

// Regra: Se não tem copyFramework estruturado, NÃO É NeuroPreset
```

**Impacto Técnico**:

1. **Preset define tudo**: Layout, cores, fonte, estrutura de copy
2. **IA parte do contexto do preset**: Não gera do zero, gera direcionado
3. **Limita opções**: Dentro do preset, usuário tem menos escolhas (isso é bom!)
4. **Validação automática**: Sistema verifica se CTA existe, se tem emojis, etc.

---

### 3. LucresIA Proativa (Motor de Avaliação)

**Engine de Scoring**:

```typescript
// server/ai/engagementScoring.ts

interface EngagementScore {
  // Scores individuais (0-100)
  text: number;
  image: number;
  cta: number;
  hashtags: number;
  timing: number;
  
  // Score total (média ponderada)
  total: number;
  
  // Breakdown detalhado
  breakdown: {
    textLength: { score: number; ideal: string; current: string };
    hasEmoji: { score: number; present: boolean };
    hasCTA: { score: number; present: boolean; type?: string };
    hashtagCount: { score: number; ideal: string; current: string };
    imageQuality: { score: number; resolution: string };
    timeOfDay: { score: number; recommended: string; current: string };
  };
  
  // Sugestões acionáveis
  suggestions: Suggestion[];
}

interface Suggestion {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'text' | 'image' | 'cta' | 'hashtags' | 'timing';
  title: string;
  description: string;
  impact: string;  // "Pode aumentar engajamento em 25%"
  action: {
    label: string;
    payload: any;
  };
}

export async function calculateEngagementScore(
  post: {
    caption: string;
    images: string[];
    hashtags?: string[];
    scheduledFor?: Date;
  },
  preset: NeuroPreset,
  userHistory?: PostHistory[]
): Promise<EngagementScore> {
  // 1. Score de texto
  const textScore = analyzeText(post.caption, preset.copyFramework);
  
  // 2. Score de imagem
  const imageScore = await analyzeImages(post.images);
  
  // 3. Score de CTA
  const ctaScore = analyzeCTA(post.caption, preset.copyFramework.cta);
  
  // 4. Score de hashtags
  const hashtagScore = analyzeHashtags(post.hashtags, preset.goal);
  
  // 5. Score de timing
  const timingScore = analyzeTiming(post.scheduledFor, userHistory);
  
  // Pesos
  const weights = { text: 0.30, image: 0.25, cta: 0.20, hashtags: 0.15, timing: 0.10 };
  
  const total = Math.round(
    textScore * weights.text +
    imageScore * weights.image +
    ctaScore * weights.cta +
    hashtagScore * weights.hashtags +
    timingScore * weights.timing
  );
  
  // Gerar sugestões baseado em gaps
  const suggestions = generateSuggestions({
    textScore,
    imageScore,
    ctaScore,
    hashtagScore,
    timingScore
  }, preset);
  
  return {
    text: textScore,
    image: imageScore,
    cta: ctaScore,
    hashtags: hashtagScore,
    timing: timingScore,
    total,
    breakdown: { /* detalhes */ },
    suggestions
  };
}

function analyzeText(caption: string, framework: NeuroCopyFramework): number {
  let score = 0;
  
  // Tamanho ideal: 80-150 palavras
  const wordCount = caption.split(/\s+/).length;
  if (wordCount >= 80 && wordCount <= 150) score += 30;
  else if (wordCount >= 50) score += 15;
  
  // Tem emoji?
  if (framework.mustHave.includes('emoji') && /[\u{1F300}-\u{1F9FF}]/u.test(caption)) {
    score += 20;
  }
  
  // Tem CTA explícito?
  const ctaKeywords = ['agende', 'comente', 'salve', 'compartilhe', 'link na bio'];
  if (ctaKeywords.some(kw => caption.toLowerCase().includes(kw))) {
    score += 30;
  }
  
  // Estrutura em parágrafos?
  if (caption.includes('\n\n')) score += 10;
  
  // Tem bullet points ou lista?
  if (/[•✓✔️]/.test(caption)) score += 10;
  
  return Math.min(score, 100);
}

function analyzeCTA(caption: string, expectedCTA: string): number {
  const ctaPatterns: Record<string, RegExp[]> = {
    agenda: [/agende/i, /marque/i, /reserve/i],
    comente: [/comente/i, /responde/i, /deixa/i],
    salve: [/salve/i, /salva/i, /guarda/i],
    compartilhe: [/compartilhe/i, /marca/i],
    link_bio: [/link.*bio/i, /link.*perfil/i]
  };
  
  const patterns = ctaPatterns[expectedCTA] || [];
  const hasCTA = patterns.some(pattern => pattern.test(caption));
  
  return hasCTA ? 100 : 0;  // Binário: tem ou não tem
}

function generateSuggestions(
  scores: Record<string, number>,
  preset: NeuroPreset
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  
  // CTA faltando (crítico)
  if (scores.ctaScore < 50) {
    suggestions.push({
      id: 'missing-cta',
      priority: 'critical',
      type: 'cta',
      title: 'Adicione uma Call-to-Action',
      description: 'Seu post está sem CTA. Posts com CTA convertem 40% mais.',
      impact: '+40% de conversão',
      action: {
        label: 'Ver Sugestões de CTA',
        payload: { type: preset.copyFramework.cta }
      }
    });
  }
  
  // Hashtags insuficientes
  if (scores.hashtagScore < 60) {
    suggestions.push({
      id: 'add-hashtags',
      priority: 'high',
      type: 'hashtags',
      title: 'Adicione mais hashtags',
      description: 'Recomendamos 20-30 hashtags estratégicas para máximo alcance.',
      impact: '+35% de alcance',
      action: {
        label: 'Gerar Hashtags',
        payload: { goal: preset.goal }
      }
    });
  }
  
  // Horário ruim
  if (scores.timingScore < 70) {
    suggestions.push({
      id: 'better-timing',
      priority: 'medium',
      type: 'timing',
      title: 'Horário não ideal',
      description: 'Baseado no seu histórico, 19h-21h tem 2x mais engajamento.',
      impact: '+50% de engajamento',
      action: {
        label: 'Ajustar Horário',
        payload: { recommended: '19:00' }
      }
    });
  }
  
  return suggestions.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
```

**Sidebar Component**:

```typescript
// client/src/components/LucresIASidebar.tsx

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Sparkles, TrendingUp } from 'lucide-react';

interface LucresIASidebarProps {
  caption: string;
  images: string[];
  hashtags?: string[];
  presetId: string;
  onApplySuggestion: (suggestionId: string, payload: any) => void;
}

export default function LucresIASidebar({
  caption,
  images,
  hashtags,
  presetId,
  onApplySuggestion
}: LucresIASidebarProps) {
  const [score, setScore] = useState<EngagementScore | null>(null);
  
  // Calcular score em tempo real (debounced)
  const { data: liveScore } = trpc.ai.calculateScore.useQuery(
    { caption, images, hashtags, presetId },
    {
      enabled: caption.length > 0,
      refetchInterval: false,  // Só recalcula quando inputs mudam
      staleTime: 2000  // Debounce de 2s
    }
  );
  
  useEffect(() => {
    if (liveScore) setScore(liveScore);
  }, [liveScore]);
  
  if (!score) return null;
  
  return (
    <Card className="fixed right-4 top-20 w-80 z-40 bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-purple-200">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">LucresIA</h3>
          <p className="text-xs text-slate-600">Seu estrategista de vendas</p>
        </div>
      </div>
      
      {/* Score */}
      <div className="p-4 bg-white/50 border-b border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Score de Engajamento
          </span>
          <span className="text-2xl font-bold text-purple-600">
            {score.total}%
          </span>
        </div>
        <Progress value={score.total} className="h-2" />
        <p className="text-xs text-slate-600 mt-2">
          {score.total >= 80 && '🎉 Excelente! Alta chance de viralizar'}
          {score.total >= 60 && score.total < 80 && '👍 Bom! Algumas melhorias possíveis'}
          {score.total < 60 && '⚠️ Pode melhorar. Veja sugestões abaixo'}
        </p>
      </div>
      
      {/* Sugestões */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {score.suggestions.length === 0 ? (
          <Card className="p-3 bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-sm text-green-900">
                  Tudo perfeito! ✨
                </p>
                <p className="text-xs text-green-700">
                  Seu post está otimizado para alta performance
                </p>
              </div>
            </div>
          </Card>
        ) : (
          score.suggestions.map(suggestion => (
            <Card
              key={suggestion.id}
              className={`p-3 border-l-4 ${
                suggestion.priority === 'critical' ? 'border-red-500 bg-red-50' :
                suggestion.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                'border-purple-500 bg-purple-50'
              }`}
            >
              <div className="flex items-start gap-2">
                {suggestion.priority === 'critical' && <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                {suggestion.priority === 'high' && <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5" />}
                {suggestion.priority === 'medium' && <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-slate-900">
                      {suggestion.title}
                    </h4>
                    {suggestion.priority === 'critical' && (
                      <Badge variant="destructive" className="text-xs">
                        IMPORTANTE
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-600 mb-2">
                    {suggestion.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-green-700">
                      {suggestion.impact}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApplySuggestion(suggestion.id, suggestion.action.payload)}
                      className="text-xs h-7"
                    >
                      {suggestion.action.label}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
}
```

---

## 📊 EVENTOS ANALÍTICOS OBRIGATÓRIOS

**Sem analytics = achismo. Com analytics = decisão baseada em dados.**

```typescript
// client/src/lib/analytics.ts

export const AnalyticsEvents = {
  // Quick Create Flow
  QUICK_CREATE_STARTED: 'quick_create_started',
  QUICK_CREATE_COMPLETED: 'quick_create_completed',
  QUICK_CREATE_ABANDONED: 'quick_create_abandoned',
  
  // Steps
  PRESET_SELECTED: 'preset_selected',
  IMAGE_UPLOADED: 'image_uploaded',
  COPY_GENERATED: 'copy_generated',
  POST_PUBLISHED: 'post_published',
  
  // IA
  IA_SUGGESTION_SHOWN: 'ia_suggestion_shown',
  IA_SUGGESTION_APPLIED: 'ia_suggestion_applied',
  IA_SUGGESTION_DISMISSED: 'ia_suggestion_dismissed',
  
  // Drop-offs
  DROP_OFF_PRESET: 'drop_off_step_preset',
  DROP_OFF_UPLOAD: 'drop_off_step_upload',
  DROP_OFF_COPY: 'drop_off_step_copy',
  DROP_OFF_PUBLISH: 'drop_off_step_publish',
} as const;

interface EventProperties {
  // User context
  userId: string;
  sessionId: string;
  
  // Timing
  timestamp: Date;
  timeFromStart?: number;  // ms desde início do fluxo
  
  // Context específico
  [key: string]: any;
}

export function trackEvent(
  eventName: string,
  properties: EventProperties
) {
  // 1. Console (dev)
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics:', eventName, properties);
  }
  
  // 2. Backend (produção)
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, properties })
    });
  }
  
  // 3. External (Mixpanel, Amplitude, etc)
  // mixpanel.track(eventName, properties);
}

// Exemplo de uso
trackEvent(AnalyticsEvents.PRESET_SELECTED, {
  userId: user.id,
  sessionId: sessionId,
  timestamp: new Date(),
  presetId: 'transformacao-incrivel',
  timeFromStart: 15000  // 15 segundos
});
```

---

## 🎯 ORDEM CORRETA DE IMPLEMENTAÇÃO

### Sprint 1-2: Simplificação Radical

**Objetivo**: Provar que o fluxo guiado funciona

**Entregas**:
1. `QuickCreateFlow` component completo
2. 4 steps funcionais (preset → upload → copy → publish)
3. State machine com validações
4. Analytics tracking em cada step

**Critério de Sucesso** (DECISIVO):
- ✅ Tempo médio < 10min
- ✅ D7 churn cai pelo menos 20%
- ✅ Taxa de conclusão > 60%

**Se falhar**: Para tudo e ajusta o fluxo antes de continuar.

---

### Sprint 3-4: NeuroPresets

**Objetivo**: Implementar os 12 presets com lógica de venda

**Entregas**:
1. Arquivo `shared/neuroPresets.ts` com 12 presets completos
2. Cada preset com `copyFramework` estruturado
3. IA usando `aiPromptContext` de cada preset
4. Validação automática (ex: verifica se CTA existe)

**Critério de Sucesso**:
- ✅ Posts com presets têm +30% engajamento vs genéricos
- ✅ Usuários escolhem preset em 90% dos casos
- ✅ IA gera copy alinhada com framework em 85% das vezes

---

### Sprint 5-6: Sistema de Camadas

**Objetivo**: Antes/Depois e composições

**Entregas**:
1. `useLayerSystem` hook
2. Before/After template automático
3. Canvas simplificado (não editor profissional)

**Critério de Sucesso**:
- ✅ 50% dos posts passam a ter 2+ imagens
- ✅ Template Antes/Depois é o mais usado

---

### Sprint 7-8: LucresIA Proativa

**Objetivo**: IA em tempo real

**Entregas**:
1. Engine de scoring (`calculateEngagementScore`)
2. `LucresIASidebar` component
3. Sugestões acionáveis (1 clique)
4. Analytics de aceitação de sugestões

**Critério de Sucesso**:
- ✅ Score é consultado em 80% das criações
- ✅ Sugestões são aplicadas em 60% dos casos
- ✅ Posts com score >80 têm 2x mais engajamento

---

## ⚠️ MÉTRICA QUE DECIDE VIDA OU MORTE

**Depois da Sprint 2**:

```
SE tempo_medio > 10min:
  → Para tudo e simplifica mais o fluxo
  
SE d7_churn não caiu pelo menos 20%:
  → Para tudo e revisa onboarding
  
SE taxa_conclusao < 60%:
  → Para tudo e ajusta validações/passos
```

**Design bonito sem métrica é vaidade.**

---

## 🎯 FRASE-CHAVE PARA ALINHAR TIME

> **"Não estamos construindo um editor.**
> **Estamos construindo uma máquina de decisão que ensina esteticistas a vender."**

---

## 📋 CHECKLIST TÉCNICO PRÉ-IMPLEMENTAÇÃO

Antes de começar Sprint 1, validar:

- [ ] Analytics está configurado e testado
- [ ] tRPC procedures estão prontas para Quick Create
- [ ] S3 upload funciona de forma confiável
- [ ] Time entende paradigma de "fluxo" vs "página"
- [ ] Há pelo menos 3 presets com `copyFramework` definidos
- [ ] Banco tem schema para armazenar `engagement_score`
- [ ] CI/CD está pronto para deploys rápidos

---

## 🔗 Documentos Relacionados

Este documento complementa:
- [ROADMAP_IMPLEMENTACAO.md](./ROADMAP_IMPLEMENTACAO.md) - Especificações originais
- [ANALISE_ESTRATEGICA_PRODUTO.md](./ANALISE_ESTRATEGICA_PRODUTO.md) - Diagnóstico estratégico
- [ARQUITETURA_VISUAL.md](./ARQUITETURA_VISUAL.md) - Mockups e fluxos

---

**Última atualização**: Janeiro 2026
**Versão**: 1.0 (Technical Deep Dive)

