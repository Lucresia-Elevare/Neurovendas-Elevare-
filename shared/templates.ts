import type { Format, Model, Font, TextColor, AlignHorizontal, AlignVertical } from "./types";

export interface Template {
  id: string;
  name: string;
  category: "antes-depois" | "promocao" | "depoimento" | "procedimento" | "dica" | "resultado";
  description: string;
  thumbnail?: string;
  settings: {
    format: Format;
    model: Model;
    fontSize: number;
    font: Font;
    textColor: TextColor;
    textOutline: 0 | 1;
    alignHorizontal: AlignHorizontal;
    alignVertical: AlignVertical;
    fadeOverlay: number;
    blur: number;
    brightness: number;
    contrast: number;
  };
  placeholderText: string;
}

export const estheticsTemplates: Template[] = [
  // Antes e Depois
  {
    id: "antes-depois-split",
    name: "Antes & Depois - Split",
    category: "antes-depois",
    description: "Template para mostrar transformações com texto centralizado",
    settings: {
      format: "square",
      model: "classic",
      fontSize: 120,
      font: "Inter",
      textColor: "black",
      textOutline: 1,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 30,
      blur: 0,
      brightness: 110,
      contrast: 105,
    },
    placeholderText: "ANTES & DEPOIS\nResultados Incríveis ✨",
  },
  
  {
    id: "antes-depois-elegante",
    name: "Antes & Depois - Elegante",
    category: "antes-depois",
    description: "Design sofisticado para transformações",
    settings: {
      format: "portrait",
      model: "fade",
      fontSize: 100,
      font: "Serif",
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "bottom",
      fadeOverlay: 50,
      blur: 2,
      brightness: 100,
      contrast: 100,
    },
    placeholderText: "Transformação Real\nVeja o Resultado",
  },
  
  // Promoções
  {
    id: "promocao-destaque",
    name: "Promoção - Destaque",
    category: "promocao",
    description: "Chame atenção para ofertas especiais",
    settings: {
      format: "square",
      model: "highlight",
      fontSize: 140,
      font: "Oswald",
      textColor: "white",
      textOutline: 1,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 40,
      blur: 0,
      brightness: 105,
      contrast: 110,
    },
    placeholderText: "PROMOÇÃO\n50% OFF",
  },
  
  {
    id: "promocao-servico",
    name: "Promoção - Serviço",
    category: "promocao",
    description: "Ideal para divulgar procedimentos em oferta",
    settings: {
      format: "portrait",
      model: "bold",
      fontSize: 110,
      font: "Inter",
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "top",
      fadeOverlay: 60,
      blur: 0,
      brightness: 100,
      contrast: 100,
    },
    placeholderText: "Harmonização Facial\nAgendamento Especial",
  },
  
  // Depoimentos
  {
    id: "depoimento-cliente",
    name: "Depoimento - Cliente Feliz",
    category: "depoimento",
    description: "Mostre a satisfação dos seus clientes",
    settings: {
      format: "square",
      model: "classic",
      fontSize: 90,
      font: "Serif",
      textColor: "black",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 20,
      blur: 0,
      brightness: 110,
      contrast: 100,
    },
    placeholderText: "\"Resultado maravilhoso!\nSuperou minhas expectativas\"",
  },
  
  {
    id: "depoimento-story",
    name: "Depoimento - Stories",
    category: "depoimento",
    description: "Formato vertical para stories com depoimentos",
    settings: {
      format: "story",
      model: "fade",
      fontSize: 100,
      font: "Inter",
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 50,
      blur: 3,
      brightness: 100,
      contrast: 100,
    },
    placeholderText: "Cliente Satisfeita ⭐\n\"Amei o resultado!\"",
  },
  
  // Procedimentos
  {
    id: "procedimento-info",
    name: "Procedimento - Informativo",
    category: "procedimento",
    description: "Explique procedimentos de forma clara",
    settings: {
      format: "portrait",
      model: "classic",
      fontSize: 100,
      font: "Inter",
      textColor: "black",
      textOutline: 0,
      alignHorizontal: "left",
      alignVertical: "top",
      fadeOverlay: 30,
      blur: 0,
      brightness: 110,
      contrast: 100,
    },
    placeholderText: "Preenchimento Labial\nTudo que você precisa saber",
  },
  
  {
    id: "procedimento-destaque",
    name: "Procedimento - Destaque",
    category: "procedimento",
    description: "Destaque um procedimento específico",
    settings: {
      format: "square",
      model: "highlight",
      fontSize: 120,
      font: "Oswald",
      textColor: "white",
      textOutline: 1,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 45,
      blur: 0,
      brightness: 100,
      contrast: 110,
    },
    placeholderText: "BOTOX\nAgende Agora",
  },
  
  // Dicas
  {
    id: "dica-cuidados",
    name: "Dica - Cuidados",
    category: "dica",
    description: "Compartilhe dicas de cuidados",
    settings: {
      format: "square",
      model: "fade",
      fontSize: 95,
      font: "Inter",
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 55,
      blur: 2,
      brightness: 100,
      contrast: 100,
    },
    placeholderText: "Dica do Dia 💡\nCuidados Pós-Procedimento",
  },
  
  {
    id: "dica-rapida",
    name: "Dica - Rápida",
    category: "dica",
    description: "Dicas rápidas e objetivas",
    settings: {
      format: "story",
      model: "bold",
      fontSize: 110,
      font: "Inter",
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "top",
      fadeOverlay: 50,
      blur: 0,
      brightness: 100,
      contrast: 100,
    },
    placeholderText: "Você Sabia? 🤔\nHidratação é essencial",
  },
  
  // Resultados
  {
    id: "resultado-impacto",
    name: "Resultado - Impacto",
    category: "resultado",
    description: "Mostre resultados impressionantes",
    settings: {
      format: "portrait",
      model: "highlight",
      fontSize: 130,
      font: "Oswald",
      textColor: "white",
      textOutline: 1,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 40,
      blur: 0,
      brightness: 105,
      contrast: 115,
    },
    placeholderText: "RESULTADO\nNatural e Harmônico",
  },
  
  {
    id: "resultado-sutil",
    name: "Resultado - Sutil",
    category: "resultado",
    description: "Destaque resultados naturais",
    settings: {
      format: "square",
      model: "classic",
      fontSize: 105,
      font: "Serif",
      textColor: "black",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "bottom",
      fadeOverlay: 25,
      blur: 0,
      brightness: 110,
      contrast: 100,
    },
    placeholderText: "Beleza Natural\nResultado Perfeito ✨",
  },
];

export function getTemplatesByCategory(category: Template["category"]): Template[] {
  return estheticsTemplates.filter((t) => t.category === category);
}

export function getTemplateById(id: string): Template | undefined {
  return estheticsTemplates.find((t) => t.id === id);
}
