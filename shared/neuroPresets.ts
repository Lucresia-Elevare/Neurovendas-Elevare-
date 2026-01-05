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

// Preset 4: Autoridade Técnica
export const PRESET_AUTORIDADE_TECNICA: NeuroPreset = {
  id: 'autoridade-tecnica',
  name: '🎯 Autoridade Técnica',
  icon: '🎯',
  goal: 'autoridade',
  
  layout: {
    type: 'education',
    zones: {
      header: { height: 20 },
      content: { position: 'middle' }
    },
    requiredElements: ['title', 'subtitle', 'divider']
  },
  
  colorPalette: {
    primary: '#1E3A8A',
    secondary: '#DBEAFE',
    accent: '#3B82F6',
    text: '#1E40AF',
    background: '#F0F9FF',
    psychology: 'Azul transmite confiança, profissionalismo e conhecimento',
    emotion: 'Confiança e segurança'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 600,
      size: 26
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 17
    },
    purpose: 'confianca'
  },
  
  copyFramework: {
    hook: 'autoridade',
    proof: 'estatistica',
    cta: 'compartilhe',
    formula: '[PROBLEMA TÉCNICO] → [TÉCNICA AVANÇADA] + [RESULTADO] + [CREDENCIAL]',
    mustHave: ['cta_explicito', 'beneficio'],
    triggers: ['autoridade', 'reciprocidade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda EDUCATIVA sobre um procedimento estético, estabelecendo autoridade técnica.
    
    OBJETIVO: Educar e posicionar como especialista.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Problema técnico ou dúvida comum
    2. Explicação com termos técnicos (mas acessíveis)
    3. Técnica ou abordagem utilizada
    4. Resultado esperado com dados
    5. Credencial ou experiência
    
    TOM: Professoral, confiante, educativo. Expert acessível.
    
    GATILHOS: Autoridade técnica, conhecimento exclusivo.
    
    REGRAS:
    - Use termos técnicos explicados
    - Cite experiência ou certificações
    - Dados ou estatísticas quando possível
    - CTA: compartilhar conhecimento
    - Emojis de educação (🎓, 📚, 🔬)
  `,
  
  canvasSettings: {
    format: 'square',
    dimensions: { width: 1080, height: 1080 },
    imageEffects: {
      blur: 0,
      brightness: 105,
      contrast: 110,
      fadeOverlay: 40
    }
  },
  
  examples: [
    '🔬 Toxina botulínica: Entenda a diferença entre as marcas',
    '🎓 Harmonização facial: O que é proporção áurea?',
    '📚 Ácido hialurônico: Como escolher a densidade certa'
  ],
  
  whenToUse: 'Para educar sobre técnicas e estabelecer sua autoridade como especialista.'
};

// Preset 5: Combo Irresistível
export const PRESET_COMBO_IRRESISTIVEL: NeuroPreset = {
  id: 'combo-irresistivel',
  name: '💰 Combo Irresistível',
  icon: '💰',
  goal: 'venda',
  
  layout: {
    type: 'product',
    zones: {
      header: { height: 15 },
      content: { position: 'middle' },
      footer: { height: 20 }
    },
    requiredElements: ['title', 'badge', 'cta']
  },
  
  colorPalette: {
    primary: '#059669',
    secondary: '#D1FAE5',
    accent: '#10B981',
    text: '#065F46',
    background: '#ECFDF5',
    psychology: 'Verde transmite economia, oportunidade e decisão positiva',
    emotion: 'Ganho e economia'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 700,
      size: 28
    },
    body: {
      family: 'Inter',
      weight: 500,
      size: 19
    },
    purpose: 'impacto'
  },
  
  copyFramework: {
    hook: 'desejo',
    proof: 'resultado',
    cta: 'agenda',
    formula: '[OFERTA] + [ECONOMIA] + [BÔNUS] + [PRAZO]',
    mustHave: ['emoji', 'cta_explicito', 'beneficio'],
    triggers: ['escassez', 'reciprocidade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para um COMBO/PACOTE de procedimentos.
    
    OBJETIVO: Maximizar valor percebido e gerar conversão.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Nome do combo com benefício principal
    2. O que está incluso (lista de procedimentos)
    3. Economia clara (valor de vs valor por)
    4. Bônus ou vantagem adicional
    5. Prazo ou limite de vagas
    6. CTA direto
    
    TOM: Empolgado, mostrando oportunidade única.
    
    GATILHOS: Ganho percebido, economia, escassez.
    
    REGRAS:
    - Mostre economia em R$ ou %
    - Liste todos os procedimentos inclusos
    - Destaque o bônus/brinde
    - Prazo ou quantidade limitada
    - Use emojis de presente/economia (💰, 🎁, ✨)
  `,
  
  canvasSettings: {
    format: 'square',
    dimensions: { width: 1080, height: 1080 },
    imageEffects: {
      blur: 0,
      brightness: 110,
      contrast: 115,
      fadeOverlay: 45
    }
  },
  
  examples: [
    '💰 Combo Pele Perfeita: Limpeza + Peeling + Hidratação por R$ 299',
    '✨ Pacote Verão: 3 sessões de laser + 1 de hidratação - Economize R$ 400!',
    '🎁 Combo Harmonização: Botox + Preenchimento + Bônus Skinbooster'
  ],
  
  whenToUse: 'Para vender pacotes que geram economia percebida e aumentam ticket médio.'
};

// Preset 6: Mito vs Verdade
export const PRESET_MITO_VS_VERDADE: NeuroPreset = {
  id: 'mito-vs-verdade',
  name: '📚 Mito vs Verdade',
  icon: '📚',
  goal: 'engajamento',
  
  layout: {
    type: 'education',
    zones: {
      header: { height: 25 },
      content: { position: 'middle' }
    },
    requiredElements: ['title', 'subtitle', 'divider']
  },
  
  colorPalette: {
    primary: '#DC2626',
    secondary: '#FEE2E2',
    accent: '#10B981',
    text: '#991B1B',
    background: '#FEF2F2',
    psychology: 'Vermelho (mito) vs Verde (verdade) - contraste visual forte',
    emotion: 'Curiosidade e descoberta'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 700,
      size: 24
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 18
    },
    purpose: 'impacto'
  },
  
  copyFramework: {
    hook: 'autoridade',
    proof: 'processo',
    cta: 'comente',
    formula: '[MITO COMUM] ❌ → [VERDADE] ✅ + [EXPLICAÇÃO]',
    mustHave: ['emoji'],
    triggers: ['autoridade', 'reciprocidade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda estilo MITO VS VERDADE sobre estética.
    
    OBJETIVO: Educar e gerar engajamento através de curiosidade.
    
    ESTRUTURA OBRIGATÓRIA:
    1. "❌ MITO:" + crença comum falsa
    2. "✅ VERDADE:" + informação correta
    3. Explicação do porque
    4. CTA: perguntar se conheciam outro mito
    
    TOM: Educativo, desmistificador, útil.
    
    GATILHOS: Curiosidade, conhecimento exclusivo.
    
    REGRAS:
    - Use emojis ❌ e ✅
    - Seja claro e objetivo
    - Explique o porquê
    - Convide a comentar outros mitos
    - Formato lista funciona bem
  `,
  
  canvasSettings: {
    format: 'square',
    dimensions: { width: 1080, height: 1080 },
    imageEffects: {
      blur: 0,
      brightness: 105,
      contrast: 110,
      fadeOverlay: 35
    }
  },
  
  examples: [
    '❌ MITO: Botox deixa o rosto "congelado"\n✅ VERDADE: Quando bem aplicado, o resultado é natural!',
    '❌ MITO: Limpeza de pele machuca\n✅ VERDADE: Com técnica correta, é praticamente indolor',
    '❌ MITO: Preenchimento muda o formato do rosto\n✅ VERDADE: Harmoniza e realça, não transforma'
  ],
  
  whenToUse: 'Para gerar engajamento educando e quebrando crenças limitantes.'
};

// Preset 7: Cliente VIP
export const PRESET_CLIENTE_VIP: NeuroPreset = {
  id: 'cliente-vip',
  name: '🌟 Cliente VIP',
  icon: '🌟',
  goal: 'autoridade',
  
  layout: {
    type: 'product',
    zones: {
      header: { height: 20 },
      content: { position: 'middle' },
      footer: { height: 15 }
    },
    requiredElements: ['title', 'badge']
  },
  
  colorPalette: {
    primary: '#854D0E',
    secondary: '#FEF3C7',
    accent: '#F59E0B',
    text: '#78350F',
    background: '#FFFBEB',
    psychology: 'Dourado transmite exclusividade, luxo e status premium',
    emotion: 'Exclusividade e prestígio'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 600,
      size: 26
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 18
    },
    purpose: 'elegancia'
  },
  
  copyFramework: {
    hook: 'desejo',
    proof: 'processo',
    cta: 'link_bio',
    formula: '[EXPERIÊNCIA EXCLUSIVA] + [DIFERENCIAL] + [CONVITE]',
    mustHave: ['beneficio'],
    triggers: ['autoridade', 'reciprocidade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para SERVIÇO PREMIUM ou programa VIP.
    
    OBJETIVO: Posicionar exclusividade e atrair clientes premium.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Apresentação da experiência exclusiva
    2. Diferenciais do atendimento VIP
    3. Benefícios exclusivos
    4. Convite seletivo (não é para todos)
    
    TOM: Sofisticado, exclusivo, sem ser esnobe.
    
    GATILHOS: Status, exclusividade, escassez de acesso.
    
    REGRAS:
    - Evite desconto (não é sobre preço)
    - Foque na experiência diferenciada
    - Mencione atendimento personalizado
    - Número limitado de clientes
    - Emojis de luxo (🌟, 💎, ✨)
  `,
  
  canvasSettings: {
    format: 'portrait',
    dimensions: { width: 1080, height: 1350 },
    imageEffects: {
      blur: 0,
      brightness: 100,
      contrast: 105,
      fadeOverlay: 30
    }
  },
  
  examples: [
    '🌟 Programa Diamond: Atendimento exclusivo com protocolo personalizado',
    '💎 Cliente VIP: Sala privativa, horários flexíveis e acompanhamento mensal',
    '✨ Experiência Premium: Apenas 10 vagas por mês'
  ],
  
  whenToUse: 'Para posicionar serviços premium e atrair clientes de alto valor.'
};

// Preset 8: Flash Sale
export const PRESET_FLASH_SALE: NeuroPreset = {
  id: 'flash-sale',
  name: '⚡ Flash Sale',
  icon: '⚡',
  goal: 'venda',
  
  layout: {
    type: 'urgency',
    zones: {
      header: { height: 25 },
      content: { position: 'top' },
      footer: { height: 20 }
    },
    requiredElements: ['title', 'badge', 'cta']
  },
  
  colorPalette: {
    primary: '#DC2626',
    secondary: '#FEE2E2',
    accent: '#FF6B6B',
    text: '#991B1B',
    background: '#FFF1F2',
    psychology: 'Vermelho intenso cria senso de urgência máxima e ação imediata',
    emotion: 'Urgência e FOMO'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 800,
      size: 32
    },
    body: {
      family: 'Inter',
      weight: 600,
      size: 20
    },
    purpose: 'impacto'
  },
  
  copyFramework: {
    hook: 'desejo',
    proof: 'social',
    cta: 'agenda',
    formula: '[URGÊNCIA] + [DESCONTO] + [LIMITE] + [AÇÃO IMEDIATA]',
    mustHave: ['emoji', 'cta_explicito', 'beneficio'],
    triggers: ['escassez']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para FLASH SALE ou oferta relâmpago.
    
    OBJETIVO: Conversão IMEDIATA com máxima urgência.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Hook de urgência extrema (AGORA, HOJE, 24H)
    2. Desconto agressivo
    3. Limite muito claro (horário fim, primeiras X pessoas)
    4. O que está incluso
    5. CTA imperativo urgente
    
    TOM: Urgente, direto, ação imediata.
    
    GATILHOS: FOMO máximo, escassez extrema.
    
    REGRAS:
    - Prazo em horas (24h, até 18h, próximas 3h)
    - Desconto alto (50%, R$ 500 OFF)
    - Quantidade ou tempo limitado
    - Múltiplos emojis de urgência (⚡🔥⏰)
    - Caixa alta estratégica
  `,
  
  canvasSettings: {
    format: 'story',
    dimensions: { width: 1080, height: 1920 },
    imageEffects: {
      blur: 0,
      brightness: 115,
      contrast: 125,
      fadeOverlay: 55
    }
  },
  
  examples: [
    '⚡ FLASH SALE: 50% OFF em Botox - APENAS HOJE até 18h!',
    '🔥 ÚLTIMAS 3 HORAS: Harmonização R$ 999 → R$ 499',
    '⏰ TERMINA À MEIA-NOITE: Pacote Pele Perfeita com 60% OFF'
  ],
  
  whenToUse: 'Para ofertas relâmpago que exigem decisão e ação imediata.'
};

// Preset 9: Diário da Clínica
export const PRESET_DIARIO_CLINICA: NeuroPreset = {
  id: 'diario-clinica',
  name: '📸 Diário da Clínica',
  icon: '📸',
  goal: 'engajamento',
  
  layout: {
    type: 'testimonial',
    zones: {
      content: { position: 'bottom' }
    },
    requiredElements: ['subtitle']
  },
  
  colorPalette: {
    primary: '#F97316',
    secondary: '#FED7AA',
    accent: '#FB923C',
    text: '#9A3412',
    background: '#FFF7ED',
    psychology: 'Laranja transmite calor humano, proximidade e autenticidade',
    emotion: 'Conexão e humanidade'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 500,
      size: 22
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 17
    },
    purpose: 'modernidade'
  },
  
  copyFramework: {
    hook: 'desejo',
    proof: 'processo',
    cta: 'comente',
    formula: '[BASTIDORES] + [HUMANIZAÇÃO] + [PERGUNTA]',
    mustHave: ['emoji'],
    triggers: ['reciprocidade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para BASTIDORES da clínica.
    
    OBJETIVO: Humanizar marca e gerar conexão emocional.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Momento do dia ou situação casual
    2. Elemento pessoal ou emocional
    3. Conexão com o propósito
    4. Pergunta para engajar
    
    TOM: Pessoal, humano, próximo, natural.
    
    GATILHOS: Identificação, autenticidade.
    
    REGRAS:
    - Primeira pessoa ("nós", "nossa")
    - Situação real do dia a dia
    - Mostre processo, não só resultado
    - Termine com pergunta
    - Seja autêntica, não forçada
    - Emojis casuais (💕, ☺️, 🤗)
  `,
  
  canvasSettings: {
    format: 'square',
    dimensions: { width: 1080, height: 1080 },
    imageEffects: {
      blur: 0,
      brightness: 105,
      contrast: 100,
      fadeOverlay: 25
    }
  },
  
  examples: [
    '☕ Começando o dia preparando tudo com carinho para receber vocês',
    '🤗 O sorriso das clientes quando veem o resultado é nossa maior recompensa',
    '💕 Bastidores: Cada detalhe importa para criar a melhor experiência'
  ],
  
  whenToUse: 'Para humanizar a marca e criar conexão emocional com a audiência.'
};

// Preset 10: Resultado Científico
export const PRESET_RESULTADO_CIENTIFICO: NeuroPreset = {
  id: 'resultado-cientifico',
  name: '🔬 Resultado Científico',
  icon: '🔬',
  goal: 'autoridade',
  
  layout: {
    type: 'education',
    zones: {
      header: { height: 20 },
      content: { position: 'middle' },
      footer: { height: 15 }
    },
    requiredElements: ['title', 'subtitle', 'divider']
  },
  
  colorPalette: {
    primary: '#0F766E',
    secondary: '#CCFBF1',
    accent: '#14B8A6',
    text: '#134E4A',
    background: '#F0FDFA',
    psychology: 'Verde-água transmite ciência, precisão e confiabilidade',
    emotion: 'Confiança científica'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 600,
      size: 25
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 17
    },
    purpose: 'confianca'
  },
  
  copyFramework: {
    hook: 'autoridade',
    proof: 'estatistica',
    cta: 'link_bio',
    formula: '[DADO/ESTUDO] + [APLICAÇÃO PRÁTICA] + [RESULTADO ESPERADO]',
    mustHave: ['beneficio'],
    triggers: ['autoridade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda baseada em EVIDÊNCIA CIENTÍFICA.
    
    OBJETIVO: Estabelecer credibilidade através de dados e ciência.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Dado ou estatística relevante
    2. Estudo ou pesquisa (pode citar fonte)
    3. Como isso se aplica no tratamento
    4. Resultado esperado baseado em evidência
    
    TOM: Científico mas acessível, confiável.
    
    GATILHOS: Autoridade científica, dados concretos.
    
    REGRAS:
    - Use números e % quando possível
    - Cite estudos ou pesquisas
    - Explique em linguagem simples
    - Conecte ciência com prática
    - Emojis científicos (🔬, 📊, 🧬)
  `,
  
  canvasSettings: {
    format: 'square',
    dimensions: { width: 1080, height: 1080 },
    imageEffects: {
      blur: 0,
      brightness: 100,
      contrast: 105,
      fadeOverlay: 35
    }
  },
  
  examples: [
    '🔬 Estudos mostram: 92% de satisfação com ácido hialurônico de alta densidade',
    '📊 Pesquisa comprova: Toxina botulínica previne rugas por até 6 meses',
    '🧬 Ciência da pele: Como o colágeno atua na sustentação facial'
  ],
  
  whenToUse: 'Para estabelecer credibilidade com base em evidências e dados científicos.'
};

// Preset 11: Transformação Completa
export const PRESET_TRANSFORMACAO_COMPLETA: NeuroPreset = {
  id: 'transformacao-completa',
  name: '💎 Transformação Completa',
  icon: '💎',
  goal: 'venda',
  
  layout: {
    type: 'before-after',
    zones: {
      header: { height: 15 },
      content: { position: 'middle' },
      footer: { height: 20 }
    },
    requiredElements: ['title', 'badge', 'cta']
  },
  
  colorPalette: {
    primary: '#7C3AED',
    secondary: '#DDD6FE',
    accent: '#A78BFA',
    text: '#5B21B6',
    background: '#F5F3FF',
    psychology: 'Roxo profundo transmite transformação profunda e luxo',
    emotion: 'Transformação e realização'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 700,
      size: 27
    },
    body: {
      family: 'Inter',
      weight: 500,
      size: 19
    },
    purpose: 'elegancia'
  },
  
  copyFramework: {
    hook: 'transformacao',
    proof: 'resultado',
    cta: 'agenda',
    formula: '[JORNADA] + [MÚLTIPLOS RESULTADOS] + [INVESTIMENTO]',
    mustHave: ['emoji', 'cta_explicito', 'beneficio', 'prova_social'],
    triggers: ['autoridade', 'prova_social']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para PROTOCOLO COMPLETO com múltiplos procedimentos.
    
    OBJETIVO: Vender programa de transformação facial completo.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Jornada de transformação (de X para Y)
    2. Lista de procedimentos inclusos
    3. Múltiplos resultados alcançados
    4. Tempo de acompanhamento
    5. Investimento (pode ser parcelado)
    6. CTA forte
    
    TOM: Transformacional, profundo, completo.
    
    GATILHOS: Desejo de transformação completa, resultado comprovado.
    
    REGRAS:
    - Mostre jornada completa
    - Liste todos os procedimentos
    - Resultados múltiplos
    - Mencione acompanhamento
    - Valor total ou parcelamento
    - Emojis de transformação (💎, ✨, 🌟)
  `,
  
  canvasSettings: {
    format: 'portrait',
    dimensions: { width: 1080, height: 1350 },
    imageEffects: {
      blur: 0,
      brightness: 105,
      contrast: 110,
      fadeOverlay: 40
    }
  },
  
  examples: [
    '💎 Transformação 360°: Harmonização + Skin + Acompanhamento 6 meses',
    '✨ Protocolo Completo: Rejuvenescimento facial em 4 etapas',
    '🌟 Jornada da Beleza: Do diagnóstico à transformação'
  ],
  
  whenToUse: 'Para vender programas completos de tratamento com múltiplos procedimentos e acompanhamento.'
};

// Preset 12: Presente Perfeito
export const PRESET_PRESENTE_PERFEITO: NeuroPreset = {
  id: 'presente-perfeito',
  name: '🎁 Presente Perfeito',
  icon: '🎁',
  goal: 'venda',
  
  layout: {
    type: 'product',
    zones: {
      header: { height: 20 },
      content: { position: 'middle' },
      footer: { height: 20 }
    },
    requiredElements: ['title', 'badge', 'cta']
  },
  
  colorPalette: {
    primary: '#DB2777',
    secondary: '#FCE7F3',
    accent: '#F472B6',
    text: '#9F1239',
    background: '#FFF1F9',
    psychology: 'Rosa transmite carinho, presente e celebração',
    emotion: 'Generosidade e afeto'
  },
  
  typography: {
    title: {
      family: 'Inter',
      weight: 600,
      size: 26
    },
    body: {
      family: 'Inter',
      weight: 400,
      size: 18
    },
    purpose: 'elegancia'
  },
  
  copyFramework: {
    hook: 'desejo',
    proof: 'social',
    cta: 'agenda',
    formula: '[OCASIÃO] + [EXPERIÊNCIA] + [FACILIDADE] + [BENEFÍCIO]',
    mustHave: ['emoji', 'cta_explicito', 'beneficio'],
    triggers: ['reciprocidade']
  },
  
  aiPromptContext: `
    Você está criando uma legenda para GIFT CARD ou presente de procedimento estético.
    
    OBJETIVO: Posicionar como presente especial e facilitar compra.
    
    ESTRUTURA OBRIGATÓRIA:
    1. Ocasião ou momento (Dia das Mães, aniversário, etc)
    2. Por que é o presente perfeito
    3. Experiência que a pessoa vai ganhar
    4. Facilidade (vale-presente, escolhe o procedimento)
    5. Valores ou opções
    6. CTA
    
    TOM: Carinhoso, celebrativo, generoso.
    
    GATILHOS: Reciprocidade, ocasião especial.
    
    REGRAS:
    - Conecte com data especial
    - Foque na experiência, não no produto
    - Facilidade de presentear
    - Opções de valores
    - Quem pode ser presenteado
    - Emojis de presente (🎁, 💝, 🎀)
  `,
  
  canvasSettings: {
    format: 'square',
    dimensions: { width: 1080, height: 1080 },
    imageEffects: {
      blur: 0,
      brightness: 110,
      contrast: 110,
      fadeOverlay: 40
    }
  },
  
  examples: [
    '🎁 Dia das Mães: Presenteie com autoestima e bem-estar',
    '💝 Vale-Presente: Ela escolhe o procedimento que sempre quis',
    '🎀 O presente que transforma: Gift card de R$ 500 a R$ 2000'
  ],
  
  whenToUse: 'Para vender gift cards e posicionar procedimentos como presente em datas especiais.'
};

// Array com todos os presets disponíveis (agora 12 presets completos)
export const NEURO_PRESETS: NeuroPreset[] = [
  PRESET_TRANSFORMACAO_INCRIVEL,
  PRESET_OFERTA_RELAMPAGO,
  PRESET_DEPOIMENTO_REAL,
  PRESET_AUTORIDADE_TECNICA,
  PRESET_COMBO_IRRESISTIVEL,
  PRESET_MITO_VS_VERDADE,
  PRESET_CLIENTE_VIP,
  PRESET_FLASH_SALE,
  PRESET_DIARIO_CLINICA,
  PRESET_RESULTADO_CIENTIFICO,
  PRESET_TRANSFORMACAO_COMPLETA,
  PRESET_PRESENTE_PERFEITO,
];

// Helper functions
export function getPresetById(id: string): NeuroPreset | undefined {
  return NEURO_PRESETS.find(p => p.id === id);
}

export function getPresetsByGoal(goal: NeuroPreset['goal']): NeuroPreset[] {
  return NEURO_PRESETS.filter(p => p.goal === goal);
}

// Get presets count by goal
export function getPresetsStats() {
  return {
    total: NEURO_PRESETS.length,
    byGoal: {
      venda: NEURO_PRESETS.filter(p => p.goal === 'venda').length,
      autoridade: NEURO_PRESETS.filter(p => p.goal === 'autoridade').length,
      engajamento: NEURO_PRESETS.filter(p => p.goal === 'engajamento').length,
    }
  };
}
