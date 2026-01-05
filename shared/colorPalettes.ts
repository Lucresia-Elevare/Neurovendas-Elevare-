export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  category: "rose" | "nude" | "spa" | "clinical" | "luxury" | "natural";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export const COLOR_PALETTES: ColorPalette[] = [
  // Paletas Rosé
  {
    id: "rose-gold",
    name: "Rose Gold Elegante",
    description: "Tons rosé com dourado para luxo e sofisticação",
    category: "rose",
    colors: {
      primary: "#E8B4B8",
      secondary: "#D4A5A5",
      accent: "#C9A961",
      background: "#FFF5F7",
      text: "#4A4A4A",
    },
  },
  {
    id: "pink-blush",
    name: "Pink Blush",
    description: "Rosa suave e delicado para tratamentos faciais",
    category: "rose",
    colors: {
      primary: "#FFB6C1",
      secondary: "#FFC0CB",
      accent: "#FF69B4",
      background: "#FFF0F5",
      text: "#333333",
    },
  },
  {
    id: "coral-dream",
    name: "Coral Dream",
    description: "Coral vibrante para energia e vitalidade",
    category: "rose",
    colors: {
      primary: "#FF7F50",
      secondary: "#FFA07A",
      accent: "#FF6347",
      background: "#FFF8F0",
      text: "#2C2C2C",
    },
  },
  {
    id: "mauve-mystique",
    name: "Mauve Mystique",
    description: "Malva sofisticado para elegância atemporal",
    category: "rose",
    colors: {
      primary: "#E0B0FF",
      secondary: "#DDA0DD",
      accent: "#DA70D6",
      background: "#FAF0FF",
      text: "#3D3D3D",
    },
  },

  // Paletas Nude
  {
    id: "nude-natural",
    name: "Nude Natural",
    description: "Tons neutros para beleza natural",
    category: "nude",
    colors: {
      primary: "#D4B5A0",
      secondary: "#C9A88A",
      accent: "#A67C52",
      background: "#FAF7F2",
      text: "#4A3F35",
    },
  },
  {
    id: "beige-classic",
    name: "Beige Clássico",
    description: "Bege atemporal para sofisticação discreta",
    category: "nude",
    colors: {
      primary: "#F5F5DC",
      secondary: "#E8D7C3",
      accent: "#D2B48C",
      background: "#FFFEF9",
      text: "#5C4A3A",
    },
  },
  {
    id: "sand-serenity",
    name: "Sand Serenity",
    description: "Areia suave para tranquilidade e conforto",
    category: "nude",
    colors: {
      primary: "#C2B280",
      secondary: "#D2B48C",
      accent: "#8B7355",
      background: "#FFF9F0",
      text: "#4E4539",
    },
  },
  {
    id: "taupe-elegance",
    name: "Taupe Elegance",
    description: "Taupe refinado para elegância moderna",
    category: "nude",
    colors: {
      primary: "#B38B6D",
      secondary: "#C9A88A",
      accent: "#8B6F47",
      background: "#F8F5F0",
      text: "#3D3328",
    },
  },

  // Paletas Spa/Verde
  {
    id: "spa-mint",
    name: "Spa Mint",
    description: "Verde menta para relaxamento e frescor",
    category: "spa",
    colors: {
      primary: "#98D8C8",
      secondary: "#B2E0D5",
      accent: "#6ECEB2",
      background: "#F0FFF4",
      text: "#2F4F4F",
    },
  },
  {
    id: "eucalyptus-calm",
    name: "Eucalyptus Calm",
    description: "Eucalipto suave para bem-estar",
    category: "spa",
    colors: {
      primary: "#8FBC8F",
      secondary: "#A8D5BA",
      accent: "#6B8E6B",
      background: "#F5FFF5",
      text: "#3A5A3A",
    },
  },
  {
    id: "sage-wellness",
    name: "Sage Wellness",
    description: "Sálvia para equilíbrio e harmonia",
    category: "spa",
    colors: {
      primary: "#9CAF88",
      secondary: "#B5C99A",
      accent: "#718355",
      background: "#F7FFF0",
      text: "#4A5D3A",
    },
  },
  {
    id: "aqua-therapy",
    name: "Aqua Therapy",
    description: "Água-marinha para terapia e renovação",
    category: "spa",
    colors: {
      primary: "#7FCDCD",
      secondary: "#98D8D8",
      accent: "#5FA3A3",
      background: "#F0FFFF",
      text: "#2F4F4F",
    },
  },

  // Paletas Clínicas/Azul
  {
    id: "clinical-blue",
    name: "Clinical Blue",
    description: "Azul clínico para confiança e profissionalismo",
    category: "clinical",
    colors: {
      primary: "#4A90E2",
      secondary: "#6BA3E8",
      accent: "#2E5C8A",
      background: "#F5F9FF",
      text: "#1A3A5A",
    },
  },
  {
    id: "medical-trust",
    name: "Medical Trust",
    description: "Azul médico para credibilidade",
    category: "clinical",
    colors: {
      primary: "#5B9BD5",
      secondary: "#7BAED8",
      accent: "#3A7CA5",
      background: "#F0F7FF",
      text: "#1E4D7B",
    },
  },
  {
    id: "ice-precision",
    name: "Ice Precision",
    description: "Azul gelo para precisão e tecnologia",
    category: "clinical",
    colors: {
      primary: "#A8D8EA",
      secondary: "#C1E7F4",
      accent: "#7FB3D5",
      background: "#F8FCFF",
      text: "#2C5F7F",
    },
  },
  {
    id: "navy-authority",
    name: "Navy Authority",
    description: "Azul marinho para autoridade e expertise",
    category: "clinical",
    colors: {
      primary: "#2C5F7F",
      secondary: "#4A7FA0",
      accent: "#1A3F5F",
      background: "#F5F8FA",
      text: "#0D2535",
    },
  },

  // Paletas Luxo
  {
    id: "gold-luxury",
    name: "Gold Luxury",
    description: "Dourado luxuoso para premium",
    category: "luxury",
    colors: {
      primary: "#D4AF37",
      secondary: "#E5C158",
      accent: "#B8941F",
      background: "#FFFEF5",
      text: "#4A3F1F",
    },
  },
  {
    id: "champagne-elite",
    name: "Champagne Elite",
    description: "Champagne para sofisticação máxima",
    category: "luxury",
    colors: {
      primary: "#F7E7CE",
      secondary: "#EDD9B5",
      accent: "#C9A961",
      background: "#FFFDF7",
      text: "#5C4A2F",
    },
  },
  {
    id: "purple-royalty",
    name: "Purple Royalty",
    description: "Roxo real para exclusividade",
    category: "luxury",
    colors: {
      primary: "#9B59B6",
      secondary: "#B47BC6",
      accent: "#7D3C98",
      background: "#FAF5FF",
      text: "#4A2F5A",
    },
  },

  // Paletas Naturais
  {
    id: "earth-organic",
    name: "Earth Organic",
    description: "Terra orgânica para produtos naturais",
    category: "natural",
    colors: {
      primary: "#8B7355",
      secondary: "#A68A6D",
      accent: "#6B5A3F",
      background: "#FAF8F3",
      text: "#3D3328",
    },
  },
  {
    id: "botanical-green",
    name: "Botanical Green",
    description: "Verde botânico para ingredientes naturais",
    category: "natural",
    colors: {
      primary: "#6B8E23",
      secondary: "#8BA446",
      accent: "#556B2F",
      background: "#F7FFF0",
      text: "#3A4A1F",
    },
  },
  {
    id: "honey-glow",
    name: "Honey Glow",
    description: "Mel dourado para nutrição e brilho",
    category: "natural",
    colors: {
      primary: "#E8A54C",
      secondary: "#F0B86E",
      accent: "#C88A2F",
      background: "#FFF9F0",
      text: "#5A3F1F",
    },
  },
];

export const PALETTE_CATEGORIES = [
  { value: "rose", label: "Rosé" },
  { value: "nude", label: "Nude" },
  { value: "spa", label: "Spa/Verde" },
  { value: "clinical", label: "Clínico/Azul" },
  { value: "luxury", label: "Luxo" },
  { value: "natural", label: "Natural" },
];
