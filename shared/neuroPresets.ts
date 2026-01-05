/**
 * NeuroPresets - Templates estratégicos com lógica de vendas embutida
 * Baseado em GUIA_TECNICO_ARQUITETURA.md
 */

export interface NeuroCopyFramework {
  hook: 'dor' | 'desejo' | 'autoridade' | 'transformacao';
  proof?: 'social' | 'resultado' | 'processo' | 'estatistica';
  cta: 'agenda' | 'comente' | 'salve' | 'compartilhe' | 'link_bio';
  formula: string;
  mustHave: ('emoji' | 'cta_explicito' | 'beneficio' | 'prova_social')[];
  triggers: ('escassez' | 'autoridade' | 'reciprocidade' | 'prova_social')[];
}

export interface ColorStrategy {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  psychology: string;
  emotion: string;
}

export interface FontStrategy {
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
  purpose: 'elegancia' | 'impacto' | 'confianca' | 'modernidade';
}

export interface LayoutRule {
  type: 'before-after' | 'testimonial' | 'urgency' | 'education' | 'product';
  zones: {
    header?: { height: number };
    content: { position: 'top' | 'middle' | 'bottom' };
    footer?: { height: number };
  };
  requiredElements: ('title' | 'subtitle' | 'cta' | 'badge' | 'divider')[];
}

export interface CanvasSettings {
  format: 'square' | 'portrait' | 'story';
  dimensions: { width: number; height: number };
  imageEffects: {
    blur: number;
    brightness: number;
    contrast: number;
    fadeOverlay: number;
  };
}

export interface NeuroPreset {
  id: string;
  name: string;
  icon: string;
  goal: 'venda' | 'autoridade' | 'engajamento' | 'trafego';
  layout: LayoutRule;
  colorPalette: ColorStrategy;
  typography: FontStrategy;
  copyFramework: NeuroCopyFramework;
  aiPromptContext: string;
  canvasSettings: CanvasSettings;
  examples: string[];
  whenToUse: string;
}

// Preset 1: Transformação Incrível
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
      family: 'Inter',
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

// Preset 2: Oferta Relâmpago
export const PRESET_OFERTA_RELAMPAGO: NeuroPreset = {
  id: 'oferta-relampago',
  name: '⚡ Oferta Relâmpago',
  icon: '⚡',
  goal: 'venda',
  
  layout: {
    type: 'urgency',
    zones: {
      header: { height: 20 },
      content: { position: 'middle' }
    },
    requiredElements: ['title', 'cta', 'badge']
  },
  
  colorPalette: {
    primary: '#FF6B6B',
    secondary: '#FFE5E5',
    accent: '#FF4757',
    text: '#2C3E50',
    background: '#FFF5F5',
    psychology: 'Vermelho comunica urgência, energia e ação',
    emotion: 'Urgência e empolgação'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 700,
      size: 56
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 18
    },
    purpose: 'impacto'
  },
  
  copyFramework: {
    hook: 'desejo',
    proof: 'processo',
    cta: 'agenda',
    formula: '[DESCONTO/BENEFÍCIO] + [ESCASSEZ TEMPORAL] + [CTA DIRETO]',
    mustHave: ['emoji', 'cta_explicito', 'beneficio'],
    triggers: ['escassez', 'reciprocidade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para uma PROMOÇÃO LIMITADA de procedimento estético.
    
    OBJETIVO: Gerar conversão imediata com senso de urgência.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Hook com benefício principal (desconto ou bônus)
    2. Escassez temporal clara (prazo específico)
    3. O que está incluso na oferta
    4. CTA direto e imperativo
    
    TOM: Entusiasmado mas profissional. Urgência sem desespero.
    
    GATILHOS: Escassez (tempo/vagas), reciprocidade (valor extra).
    
    REGRAS:
    - Mencione desconto em % ou R$
    - Prazo específico (até sexta, 48h, últimas 5 vagas)
    - CTA imperativo (Garanta já, Reserve agora, Aproveite)
    - Use emojis de urgência (⚡, ⏰, 🔥)
  `,
  
  canvasSettings: {
    format: 'portrait',
    dimensions: { width: 1080, height: 1350 },
    imageEffects: {
      blur: 0,
      brightness: 110,
      contrast: 120,
      fadeOverlay: 50
    }
  },
  
  examples: [
    '30% OFF em Botox - Apenas esta semana! ⚡',
    'Últimas 5 vagas: Limpeza de Pele + Peeling R$ 199',
    'Black Friday da beleza: Harmonização com 40% desconto!'
  ],
  
  whenToUse: 'Quando você tem uma promoção por tempo limitado e quer gerar conversão rápida.'
};

// Preset 3: Depoimento Real
export const PRESET_DEPOIMENTO_REAL: NeuroPreset = {
  id: 'depoimento-real',
  name: '💬 Depoimento Real',
  icon: '💬',
  goal: 'engajamento',
  
  layout: {
    type: 'testimonial',
    zones: {
      content: { position: 'bottom' },
      footer: { height: 15 }
    },
    requiredElements: ['title', 'subtitle']
  },
  
  colorPalette: {
    primary: '#9370DB',
    secondary: '#E6E6FA',
    accent: '#8A2BE2',
    text: '#4B0082',
    background: '#F8F4FF',
    psychology: 'Roxo comunica luxo, exclusividade e transformação',
    emotion: 'Exclusividade e poder'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 400,
      size: 24
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 16
    },
    purpose: 'confianca'
  },
  
  copyFramework: {
    hook: 'desejo',
    proof: 'social',
    cta: 'comente',
    formula: '[NOME + FOTO] + [EXPERIÊNCIA EMOCIONAL] + [RESULTADO ESPECÍFICO]',
    mustHave: ['emoji', 'prova_social'],
    triggers: ['prova_social', 'autoridade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para um DEPOIMENTO de cliente satisfeita.
    
    OBJETIVO: Gerar confiança e prova social.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Nome da cliente (pode ser só primeiro nome)
    2. Experiência emocional (como se sentiu antes/depois)
    3. Resultado específico alcançado
    4. Call to action suave (comentar, perguntar)
    
    TOM: Primeira pessoa, emocional, natural, autêntico.
    
    GATILHOS: Prova social, identificação emocional.
    
    REGRAS:
    - Use primeira pessoa ("Eu nunca imaginei...")
    - Foque na emoção, não apenas no resultado físico
    - Seja específica no resultado
    - Inclua estrelas ou emoji de satisfação
    - Naturalidade > perfeição
  `,
  
  canvasSettings: {
    format: 'portrait',
    dimensions: { width: 1080, height: 1350 },
    imageEffects: {
      blur: 0,
      brightness: 105,
      contrast: 105,
      fadeOverlay: 35
    }
  },
  
  examples: [
    '"Nunca imaginei que ficaria tão natural! A Dra. Maria é incrível" - Ana, 35 anos',
    '"Minha autoestima voltou depois da harmonização" ⭐⭐⭐⭐⭐',
    '"Melhor investimento que já fiz na minha pele!" - Júlia'
  ],
  
  whenToUse: 'Quando você tem um depoimento real de cliente e quer gerar confiança através de prova social.'
};

// Array com todos os presets disponíveis
export const NEURO_PRESETS: NeuroPreset[] = [
  PRESET_TRANSFORMACAO_INCRIVEL,
  PRESET_OFERTA_RELAMPAGO,
  PRESET_DEPOIMENTO_REAL,
];

// Helper functions
export function getPresetById(id: string): NeuroPreset | undefined {
  return NEURO_PRESETS.find(p => p.id === id);
}

export function getPresetsByGoal(goal: NeuroPreset['goal']): NeuroPreset[] {
  return NEURO_PRESETS.filter(p => p.goal === goal);
}
