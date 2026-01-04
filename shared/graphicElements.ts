/**
 * Biblioteca de elementos gráficos para estética
 * Elementos SVG inline para evitar dependência de URLs externas
 */

export interface GraphicElementData {
  id: string;
  name: string;
  category: "sticker" | "icon" | "frame" | "product" | "seal" | "decorative";
  subcategory?: string;
  svg: string;
  tags: string[];
  isPremium: boolean;
}

export const graphicElementsData: GraphicElementData[] = [
  // Stickers - Antes/Depois
  {
    id: "sticker-antes",
    name: "Selo Antes",
    category: "sticker",
    subcategory: "antes-depois",
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="#AFA8FF" stroke="#fff" stroke-width="4"/>
      <text x="60" y="70" font-family="Inter" font-size="28" font-weight="700" fill="#fff" text-anchor="middle">ANTES</text>
    </svg>`,
    tags: ["antes", "transformação", "resultado"],
    isPremium: false,
  },
  {
    id: "sticker-depois",
    name: "Selo Depois",
    category: "sticker",
    subcategory: "antes-depois",
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="55" fill="#1e1b4b" stroke="#fff" stroke-width="4"/>
      <text x="60" y="70" font-family="Inter" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">DEPOIS</text>
    </svg>`,
    tags: ["depois", "transformação", "resultado"],
    isPremium: false,
  },
  
  // Selos de Qualidade
  {
    id: "seal-aprovado",
    name: "Selo Aprovado",
    category: "seal",
    subcategory: "qualidade",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#10b981" stroke="#fff" stroke-width="3"/>
      <path d="M30 50 L45 65 L70 35" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    tags: ["aprovado", "qualidade", "certificado"],
    isPremium: false,
  },
  {
    id: "seal-premium",
    name: "Selo Premium",
    category: "seal",
    subcategory: "qualidade",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#f59e0b" stroke="#fff" stroke-width="3"/>
      <path d="M50 20 L55 40 L75 45 L60 60 L65 80 L50 70 L35 80 L40 60 L25 45 L45 40 Z" fill="#fff"/>
    </svg>`,
    tags: ["premium", "vip", "exclusivo"],
    isPremium: false,
  },
  
  // Ícones de Procedimentos
  {
    id: "icon-seringa",
    name: "Seringa",
    category: "icon",
    subcategory: "procedimento",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="15" width="10" height="50" fill="#AFA8FF" rx="2"/>
      <rect x="30" y="60" width="20" height="8" fill="#C4BFFF" rx="2"/>
      <circle cx="40" cy="12" r="4" fill="#DDD9FF"/>
      <rect x="37" y="25" width="6" height="2" fill="#fff"/>
      <rect x="37" y="35" width="6" height="2" fill="#fff"/>
      <rect x="37" y="45" width="6" height="2" fill="#fff"/>
    </svg>`,
    tags: ["botox", "preenchimento", "injetável"],
    isPremium: false,
  },
  {
    id: "icon-laser",
    name: "Laser",
    category: "icon",
    subcategory: "procedimento",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="30" height="15" fill="#AFA8FF" rx="3"/>
      <rect x="37" y="35" width="6" height="25" fill="#C4BFFF"/>
      <circle cx="40" cy="62" r="3" fill="#f59e0b"/>
      <line x1="40" y1="62" x2="40" y2="70" stroke="#f59e0b" stroke-width="2"/>
      <line x1="35" y1="67" x2="45" y2="67" stroke="#f59e0b" stroke-width="2"/>
      <line x1="32" y1="72" x2="48" y2="72" stroke="#f59e0b" stroke-width="2"/>
    </svg>`,
    tags: ["laser", "depilação", "rejuvenescimento"],
    isPremium: false,
  },
  
  // Elementos Decorativos
  {
    id: "deco-sparkles",
    name: "Brilhos",
    category: "decorative",
    subcategory: "efeito",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 L52 25 L67 27 L52 29 L50 44 L48 29 L33 27 L48 25 Z" fill="#f59e0b"/>
      <path d="M25 30 L26 38 L34 39 L26 40 L25 48 L24 40 L16 39 L24 38 Z" fill="#AFA8FF"/>
      <path d="M75 55 L76 63 L84 64 L76 65 L75 73 L74 65 L66 64 L74 63 Z" fill="#DDD9FF"/>
      <path d="M30 70 L31 75 L36 76 L31 77 L30 82 L29 77 L24 76 L29 75 Z" fill="#C4BFFF"/>
    </svg>`,
    tags: ["brilho", "estrela", "efeito"],
    isPremium: false,
  },
  {
    id: "deco-hearts",
    name: "Corações",
    category: "decorative",
    subcategory: "amor",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 75 C50 75 20 55 20 35 C20 20 30 15 40 25 C45 30 50 35 50 35 C50 35 55 30 60 25 C70 15 80 20 80 35 C80 55 50 75 50 75 Z" fill="#ec4899"/>
      <path d="M30 30 C30 30 15 22 15 15 C15 10 18 8 22 12 C24 14 30 20 30 20 Z" fill="#f9a8d4"/>
      <path d="M70 50 C70 50 85 42 85 35 C85 30 82 28 78 32 C76 34 70 40 70 40 Z" fill="#f9a8d4"/>
    </svg>`,
    tags: ["coração", "amor", "cuidado"],
    isPremium: false,
  },
  
  // Molduras
  {
    id: "frame-circle",
    name: "Moldura Circular",
    category: "frame",
    subcategory: "geometrica",
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" fill="none" stroke="#AFA8FF" stroke-width="8"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#DDD9FF" stroke-width="3"/>
    </svg>`,
    tags: ["moldura", "círculo", "borda"],
    isPremium: false,
  },
  {
    id: "frame-elegant",
    name: "Moldura Elegante",
    category: "frame",
    subcategory: "decorativa",
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#AFA8FF" stroke-width="6" rx="20"/>
      <circle cx="20" cy="20" r="8" fill="#DDD9FF"/>
      <circle cx="180" cy="20" r="8" fill="#DDD9FF"/>
      <circle cx="20" cy="180" r="8" fill="#DDD9FF"/>
      <circle cx="180" cy="180" r="8" fill="#DDD9FF"/>
    </svg>`,
    tags: ["moldura", "elegante", "cantos"],
    isPremium: false,
  },
  
  // Produtos
  {
    id: "product-cream",
    name: "Creme",
    category: "product",
    subcategory: "skincare",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="35" width="30" height="35" fill="#AFA8FF" rx="3"/>
      <rect x="25" y="30" width="30" height="8" fill="#C4BFFF" rx="2"/>
      <rect x="30" y="45" width="20" height="3" fill="#fff" opacity="0.5"/>
      <rect x="30" y="52" width="20" height="3" fill="#fff" opacity="0.5"/>
    </svg>`,
    tags: ["creme", "produto", "skincare"],
    isPremium: false,
  },
  {
    id: "product-serum",
    name: "Sérum",
    category: "product",
    subcategory: "skincare",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="32" y="20" width="16" height="8" fill="#C4BFFF" rx="2"/>
      <rect x="30" y="28" width="20" height="42" fill="#AFA8FF" rx="3"/>
      <circle cx="40" cy="50" r="3" fill="#fff" opacity="0.7"/>
      <circle cx="40" cy="58" r="2" fill="#fff" opacity="0.5"/>
    </svg>`,
    tags: ["sérum", "produto", "tratamento"],
    isPremium: false,
  },
  
  // === BADGES DE CERTIFICAÇÃO ===
  {
    id: "badge-certified",
    name: "Certificado",
    category: "seal",
    subcategory: "certificação",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#4f46e5" stroke="#fff" stroke-width="3"/>
      <path d="M50 20 L55 40 L75 45 L60 60 L65 80 L50 70 L35 80 L40 60 L25 45 L45 40 Z" fill="#fbbf24"/>
      <text x="50" y="95" font-family="Inter" font-size="10" font-weight="700" fill="#1e1b4b" text-anchor="middle">CERTIFICADO</text>
    </svg>`,
    tags: ["certificado", "qualidade", "profissional"],
    isPremium: false,
  },
  {
    id: "badge-anvisa",
    name: "Aprovado ANVISA",
    category: "seal",
    subcategory: "certificação",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" fill="#10b981" rx="8"/>
      <path d="M30 50 L45 65 L70 35" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="50" y="95" font-family="Inter" font-size="9" font-weight="700" fill="#10b981" text-anchor="middle">ANVISA</text>
    </svg>`,
    tags: ["anvisa", "aprovado", "regulamentado"],
    isPremium: false,
  },
  {
    id: "badge-crm",
    name: "Registro CRM",
    category: "seal",
    subcategory: "certificação",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#1e1b4b" stroke="#AFA8FF" stroke-width="4"/>
      <text x="50" y="55" font-family="Inter" font-size="24" font-weight="900" fill="#AFA8FF" text-anchor="middle">CRM</text>
      <text x="50" y="95" font-family="Inter" font-size="8" font-weight="700" fill="#1e1b4b" text-anchor="middle">REGISTRO</text>
    </svg>`,
    tags: ["crm", "médico", "registro"],
    isPremium: false,
  },
  
  // === ÍCONES DE TRATAMENTOS ESPECÍFICOS ===
  {
    id: "icon-microagulhamento",
    name: "Microagulhamento",
    category: "icon",
    subcategory: "procedimento",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="15" width="20" height="10" fill="#AFA8FF" rx="2"/>
      <rect x="37" y="25" width="6" height="30" fill="#C4BFFF"/>
      <circle cx="40" cy="58" r="2" fill="#1e1b4b"/>
      <line x1="35" y1="60" x2="35" y2="70" stroke="#1e1b4b" stroke-width="1.5"/>
      <line x1="40" y1="60" x2="40" y2="70" stroke="#1e1b4b" stroke-width="1.5"/>
      <line x1="45" y1="60" x2="45" y2="70" stroke="#1e1b4b" stroke-width="1.5"/>
    </svg>`,
    tags: ["microagulhamento", "rejuvenescimento", "colágeno"],
    isPremium: false,
  },
  {
    id: "icon-peeling",
    name: "Peeling",
    category: "icon",
    subcategory: "procedimento",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#DDD9FF"/>
      <path d="M25 35 Q40 25 55 35" stroke="#AFA8FF" stroke-width="3" fill="none"/>
      <path d="M25 45 Q40 35 55 45" stroke="#AFA8FF" stroke-width="3" fill="none"/>
      <path d="M25 55 Q40 45 55 55" stroke="#AFA8FF" stroke-width="3" fill="none"/>
      <circle cx="30" cy="30" r="2" fill="#C4BFFF"/>
      <circle cx="50" cy="32" r="2" fill="#C4BFFF"/>
      <circle cx="35" cy="50" r="2" fill="#C4BFFF"/>
    </svg>`,
    tags: ["peeling", "esfoliação", "renovação"],
    isPremium: false,
  },
  {
    id: "icon-harmonizacao",
    name: "Harmonização",
    category: "icon",
    subcategory: "procedimento",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="25" ry="30" fill="#DDD9FF"/>
      <circle cx="32" cy="35" r="3" fill="#1e1b4b"/>
      <circle cx="48" cy="35" r="3" fill="#1e1b4b"/>
      <path d="M30 50 Q40 55 50 50" stroke="#AFA8FF" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M35 28 Q40 25 45 28" stroke="#AFA8FF" stroke-width="2" fill="none"/>
      <circle cx="25" cy="42" r="4" fill="#C4BFFF" opacity="0.6"/>
      <circle cx="55" cy="42" r="4" fill="#C4BFFF" opacity="0.6"/>
    </svg>`,
    tags: ["harmonização", "facial", "preenchimento"],
    isPremium: false,
  },
  {
    id: "icon-limpeza",
    name: "Limpeza de Pele",
    category: "icon",
    subcategory: "procedimento",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="28" fill="#DDD9FF"/>
      <circle cx="40" cy="40" r="20" fill="#fff" opacity="0.8"/>
      <circle cx="35" cy="35" r="3" fill="#AFA8FF"/>
      <circle cx="45" cy="35" r="3" fill="#AFA8FF"/>
      <circle cx="40" cy="45" r="3" fill="#AFA8FF"/>
      <path d="M25 55 Q40 60 55 55" stroke="#C4BFFF" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    tags: ["limpeza", "pele", "higienização"],
    isPremium: false,
  },
  {
    id: "icon-massagem",
    name: "Massagem Facial",
    category: "icon",
    subcategory: "procedimento",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="40" rx="22" ry="28" fill="#DDD9FF"/>
      <path d="M20 35 Q40 30 60 35" stroke="#AFA8FF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M20 45 Q40 40 60 45" stroke="#AFA8FF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M25 55 Q40 50 55 55" stroke="#AFA8FF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="30" cy="35" r="1.5" fill="#C4BFFF"/>
      <circle cx="50" cy="35" r="1.5" fill="#C4BFFF"/>
    </svg>`,
    tags: ["massagem", "drenagem", "relaxamento"],
    isPremium: false,
  },
  {
    id: "icon-radiofrequencia",
    name: "Radiofrequência",
    category: "icon",
    subcategory: "procedimento",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="20" width="30" height="18" fill="#AFA8FF" rx="4"/>
      <rect x="37" y="38" width="6" height="20" fill="#C4BFFF"/>
      <circle cx="40" cy="60" r="4" fill="#DDD9FF"/>
      <path d="M30 65 Q40 70 50 65" stroke="#f59e0b" stroke-width="2" fill="none"/>
      <path d="M28 70 Q40 75 52 70" stroke="#f59e0b" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M26 75 Q40 80 54 75" stroke="#f59e0b" stroke-width="2" fill="none" opacity="0.5"/>
    </svg>`,
    tags: ["radiofrequência", "firmeza", "flacidez"],
    isPremium: false,
  },
  
  // === MOLDURAS TEMÁTICAS ===
  {
    id: "frame-spring",
    name: "Moldura Primavera",
    category: "frame",
    subcategory: "sazonal",
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#f9a8d4" stroke-width="8" rx="25"/>
      <circle cx="20" cy="20" r="12" fill="#fbbf24"/>
      <circle cx="180" cy="20" r="12" fill="#ec4899"/>
      <circle cx="20" cy="180" r="12" fill="#a855f7"/>
      <circle cx="180" cy="180" r="12" fill="#f59e0b"/>
      <path d="M15 25 Q20 30 25 25" fill="#10b981"/>
      <path d="M175 25 Q180 30 185 25" fill="#10b981"/>
    </svg>`,
    tags: ["primavera", "flores", "sazonal"],
    isPremium: false,
  },
  {
    id: "frame-summer",
    name: "Moldura Verão",
    category: "frame",
    subcategory: "sazonal",
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#fbbf24" stroke-width="8" rx="25"/>
      <circle cx="20" cy="20" r="10" fill="#f59e0b"/>
      <path d="M20 10 L20 30 M10 20 L30 20 M13 13 L27 27 M13 27 L27 13" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="180" cy="180" r="10" fill="#06b6d4"/>
      <path d="M175 175 Q180 170 185 175" fill="#06b6d4" opacity="0.7"/>
    </svg>`,
    tags: ["verão", "sol", "sazonal"],
    isPremium: false,
  },
  {
    id: "frame-autumn",
    name: "Moldura Outono",
    category: "frame",
    subcategory: "sazonal",
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#f59e0b" stroke-width="8" rx="25"/>
      <path d="M25 15 L30 25 L20 25 Z" fill="#dc2626"/>
      <path d="M175 15 L180 25 L170 25 Z" fill="#f59e0b"/>
      <path d="M25 185 L30 175 L20 175 Z" fill="#fbbf24"/>
      <path d="M175 185 L180 175 L170 175 Z" fill="#ea580c"/>
    </svg>`,
    tags: ["outono", "folhas", "sazonal"],
    isPremium: false,
  },
  {
    id: "frame-winter",
    name: "Moldura Inverno",
    category: "frame",
    subcategory: "sazonal",
    svg: `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#06b6d4" stroke-width="8" rx="25"/>
      <path d="M20 20 L25 15 L20 10 L15 15 Z" fill="#e0f2fe"/>
      <path d="M180 20 L185 15 L180 10 L175 15 Z" fill="#e0f2fe"/>
      <path d="M20 180 L25 185 L20 190 L15 185 Z" fill="#e0f2fe"/>
      <path d="M180 180 L185 185 L180 190 L175 185 Z" fill="#e0f2fe"/>
    </svg>`,
    tags: ["inverno", "neve", "sazonal"],
    isPremium: false,
  },
  
  // === STICKERS ADICIONAIS ===
  {
    id: "sticker-novo",
    name: "Novo",
    category: "sticker",
    subcategory: "promocional",
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="40" width="100" height="40" fill="#10b981" rx="8" transform="rotate(-10 60 60)"/>
      <text x="60" y="70" font-family="Inter" font-size="28" font-weight="900" fill="#fff" text-anchor="middle">NOVO</text>
    </svg>`,
    tags: ["novo", "lançamento", "novidade"],
    isPremium: false,
  },
  {
    id: "sticker-promo",
    name: "Promoção",
    category: "sticker",
    subcategory: "promocional",
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#dc2626"/>
      <text x="60" y="55" font-family="Inter" font-size="20" font-weight="900" fill="#fff" text-anchor="middle">PROMO</text>
      <text x="60" y="75" font-family="Inter" font-size="16" font-weight="700" fill="#fff" text-anchor="middle">ÇÃO</text>
    </svg>`,
    tags: ["promoção", "desconto", "oferta"],
    isPremium: false,
  },
  {
    id: "sticker-desconto",
    name: "Desconto",
    category: "sticker",
    subcategory: "promocional",
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 10 L80 40 L110 50 L80 60 L60 90 L40 60 L10 50 L40 40 Z" fill="#fbbf24"/>
      <text x="60" y="55" font-family="Inter" font-size="32" font-weight="900" fill="#1e1b4b" text-anchor="middle">%</text>
      <text x="60" y="75" font-family="Inter" font-size="12" font-weight="700" fill="#1e1b4b" text-anchor="middle">OFF</text>
    </svg>`,
    tags: ["desconto", "porcentagem", "economia"],
    isPremium: false,
  },
  {
    id: "sticker-limitado",
    name: "Vagas Limitadas",
    category: "sticker",
    subcategory: "urgência",
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="35" width="90" height="50" fill="#dc2626" rx="8"/>
      <text x="60" y="55" font-family="Inter" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">VAGAS</text>
      <text x="60" y="75" font-family="Inter" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">LIMITADAS</text>
    </svg>`,
    tags: ["limitado", "urgência", "exclusivo"],
    isPremium: false,
  },
  {
    id: "sticker-resultado",
    name: "Resultado Real",
    category: "sticker",
    subcategory: "credibilidade",
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#4f46e5"/>
      <path d="M40 60 L55 75 L80 45" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="60" y="100" font-family="Inter" font-size="12" font-weight="700" fill="#4f46e5" text-anchor="middle">REAL</text>
    </svg>`,
    tags: ["resultado", "real", "comprovado"],
    isPremium: false,
  },
  
  // === ELEMENTOS DECORATIVOS ADICIONAIS ===
  {
    id: "deco-arrow-up",
    name: "Seta para Cima",
    category: "decorative",
    subcategory: "setas",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 20 L60 50 L50 50 L50 70 L30 70 L30 50 L20 50 Z" fill="#AFA8FF"/>
    </svg>`,
    tags: ["seta", "direção", "cima"],
    isPremium: false,
  },
  {
    id: "deco-arrow-down",
    name: "Seta para Baixo",
    category: "decorative",
    subcategory: "setas",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 60 L60 30 L50 30 L50 10 L30 10 L30 30 L20 30 Z" fill="#AFA8FF"/>
    </svg>`,
    tags: ["seta", "direção", "baixo"],
    isPremium: false,
  },
  {
    id: "deco-circle-check",
    name: "Check Circular",
    category: "decorative",
    subcategory: "marcadores",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="#10b981"/>
      <path d="M25 40 L35 50 L55 30" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    tags: ["check", "correto", "aprovado"],
    isPremium: false,
  },
  {
    id: "deco-star-filled",
    name: "Estrela Preenchida",
    category: "decorative",
    subcategory: "avaliação",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 10 L48 32 L72 36 L56 52 L60 76 L40 64 L20 76 L24 52 L8 36 L32 32 Z" fill="#fbbf24"/>
    </svg>`,
    tags: ["estrela", "avaliação", "qualidade"],
    isPremium: false,
  },
  {
    id: "deco-crown",
    name: "Coroa",
    category: "decorative",
    subcategory: "premium",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 L20 30 L30 45 L40 20 L50 45 L60 30 L70 50 L70 60 L10 60 Z" fill="#fbbf24"/>
      <circle cx="20" cy="30" r="4" fill="#dc2626"/>
      <circle cx="40" cy="20" r="4" fill="#dc2626"/>
      <circle cx="60" cy="30" r="4" fill="#dc2626"/>
    </svg>`,
    tags: ["coroa", "premium", "vip"],
    isPremium: false,
  },
  {
    id: "deco-ribbon",
    name: "Fita",
    category: "decorative",
    subcategory: "destaque",
    svg: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 30 L80 30 L80 60 L50 80 L20 60 Z" fill="#AFA8FF"/>
      <rect x="20" y="30" width="60" height="30" fill="#C4BFFF"/>
      <path d="M35 80 L50 70 L50 90 Z" fill="#DDD9FF"/>
      <path d="M65 80 L50 70 L50 90 Z" fill="#DDD9FF"/>
    </svg>`,
    tags: ["fita", "destaque", "prêmio"],
    isPremium: false,
  },
  {
    id: "deco-badge-new",
    name: "Badge Novo",
    category: "decorative",
    subcategory: "badges",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="#10b981"/>
      <text x="40" y="48" font-family="Inter" font-size="18" font-weight="900" fill="#fff" text-anchor="middle">NEW</text>
    </svg>`,
    tags: ["novo", "badge", "lançamento"],
    isPremium: false,
  },
  {
    id: "deco-badge-hot",
    name: "Badge Hot",
    category: "decorative",
    subcategory: "badges",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="35" fill="#dc2626"/>
      <path d="M40 20 C45 25 50 30 50 40 C50 50 45 55 40 60 C35 55 30 50 30 40 C30 30 35 25 40 20 Z" fill="#fbbf24"/>
      <text x="40" y="72" font-family="Inter" font-size="12" font-weight="900" fill="#fff" text-anchor="middle">HOT</text>
    </svg>`,
    tags: ["quente", "tendência", "popular"],
    isPremium: false,
  },
  {
    id: "deco-badge-best",
    name: "Badge Melhor",
    category: "decorative",
    subcategory: "badges",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 10 L48 28 L68 32 L54 46 L58 66 L40 56 L22 66 L26 46 L12 32 L32 28 Z" fill="#fbbf24"/>
      <text x="40" y="44" font-family="Inter" font-size="12" font-weight="900" fill="#1e1b4b" text-anchor="middle">BEST</text>
    </svg>`,
    tags: ["melhor", "top", "qualidade"],
    isPremium: false,
  },
  
  // === PRODUTOS ADICIONAIS ===
  {
    id: "product-mascara",
    name: "Máscara Facial",
    category: "product",
    subcategory: "skincare",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="25" width="40" height="45" fill="#AFA8FF" rx="5"/>
      <rect x="25" y="30" width="30" height="5" fill="#fff" opacity="0.5"/>
      <rect x="25" y="40" width="30" height="3" fill="#fff" opacity="0.3"/>
      <rect x="25" y="48" width="30" height="3" fill="#fff" opacity="0.3"/>
      <rect x="25" y="56" width="30" height="3" fill="#fff" opacity="0.3"/>
    </svg>`,
    tags: ["máscara", "facial", "tratamento"],
    isPremium: false,
  },
  {
    id: "product-protetor",
    name: "Protetor Solar",
    category: "product",
    subcategory: "skincare",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="28" y="20" width="24" height="50" fill="#AFA8FF" rx="4"/>
      <rect x="28" y="15" width="24" height="8" fill="#C4BFFF" rx="2"/>
      <circle cx="40" cy="45" r="8" fill="#fbbf24"/>
      <path d="M40 35 L40 30 M40 60 L40 55 M30 45 L25 45 M55 45 L50 45 M33 38 L29 34 M51 38 L55 34 M33 52 L29 56 M51 52 L55 56" stroke="#fbbf24" stroke-width="2"/>
    </svg>`,
    tags: ["protetor", "solar", "fps"],
    isPremium: false,
  },
  {
    id: "product-tonico",
    name: "Tônico",
    category: "product",
    subcategory: "skincare",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="15" width="30" height="55" fill="#C4BFFF" rx="4"/>
      <rect x="30" y="20" width="20" height="45" fill="#AFA8FF" rx="2"/>
      <circle cx="40" cy="35" r="2" fill="#fff" opacity="0.6"/>
      <circle cx="40" cy="45" r="2" fill="#fff" opacity="0.6"/>
      <circle cx="40" cy="55" r="2" fill="#fff" opacity="0.6"/>
    </svg>`,
    tags: ["tônico", "adstringente", "limpeza"],
    isPremium: false,
  },
  {
    id: "product-esfoliante",
    name: "Esfoliante",
    category: "product",
    subcategory: "skincare",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="25" fill="#AFA8FF"/>
      <circle cx="35" cy="35" r="3" fill="#DDD9FF"/>
      <circle cx="45" cy="35" r="3" fill="#DDD9FF"/>
      <circle cx="40" cy="45" r="3" fill="#DDD9FF"/>
      <circle cx="32" cy="45" r="2" fill="#C4BFFF"/>
      <circle cx="48" cy="45" r="2" fill="#C4BFFF"/>
      <circle cx="40" cy="52" r="2" fill="#C4BFFF"/>
    </svg>`,
    tags: ["esfoliante", "scrub", "renovação"],
    isPremium: false,
  },
  
  // === ÍCONES ADICIONAIS ===
  {
    id: "icon-calendario",
    name: "Calendário",
    category: "icon",
    subcategory: "utilidade",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="20" width="50" height="50" fill="#AFA8FF" rx="4"/>
      <rect x="15" y="20" width="50" height="12" fill="#4f46e5" rx="4"/>
      <line x1="28" y1="15" x2="28" y2="25" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round"/>
      <line x1="52" y1="15" x2="52" y2="25" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round"/>
      <text x="40" y="52" font-family="Inter" font-size="24" font-weight="900" fill="#fff" text-anchor="middle">15</text>
    </svg>`,
    tags: ["calendário", "agendamento", "data"],
    isPremium: false,
  },
  {
    id: "icon-relogio",
    name: "Relógio",
    category: "icon",
    subcategory: "utilidade",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#AFA8FF"/>
      <circle cx="40" cy="40" r="25" fill="#fff"/>
      <line x1="40" y1="40" x2="40" y2="20" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round"/>
      <line x1="40" y1="40" x2="55" y2="40" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round"/>
      <circle cx="40" cy="40" r="3" fill="#1e1b4b"/>
    </svg>`,
    tags: ["relógio", "horário", "tempo"],
    isPremium: false,
  },
  {
    id: "icon-localizacao",
    name: "Localização",
    category: "icon",
    subcategory: "utilidade",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 15 C30 15 22 23 22 33 C22 48 40 65 40 65 C40 65 58 48 58 33 C58 23 50 15 40 15 Z" fill="#AFA8FF"/>
      <circle cx="40" cy="33" r="8" fill="#fff"/>
    </svg>`,
    tags: ["localização", "endereço", "mapa"],
    isPremium: false,
  },
  {
    id: "icon-telefone",
    name: "Telefone",
    category: "icon",
    subcategory: "contato",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 15 L35 15 C37 15 38 16 38 18 L38 62 C38 64 37 65 35 65 L25 65 C23 65 22 64 22 62 L22 18 C22 16 23 15 25 15 Z" fill="#AFA8FF" transform="rotate(20 30 40)"/>
      <rect x="24" y="58" width="8" height="3" fill="#fff" rx="1" transform="rotate(20 28 60)"/>
    </svg>`,
    tags: ["telefone", "contato", "ligar"],
    isPremium: false,
  },
  {
    id: "icon-whatsapp",
    name: "WhatsApp",
    category: "icon",
    subcategory: "contato",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#10b981"/>
      <path d="M30 50 L35 48 C37 49 39 50 40 50 C47 50 52 45 52 38 C52 31 47 26 40 26 C33 26 28 31 28 38 C28 40 29 42 30 44 L28 50 Z" fill="#fff"/>
      <path d="M35 36 L37 38 L43 32" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    tags: ["whatsapp", "mensagem", "contato"],
    isPremium: false,
  },
  {
    id: "icon-instagram",
    name: "Instagram",
    category: "icon",
    subcategory: "social",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="50" height="50" fill="url(#instagramGradient)" rx="12"/>
      <defs>
        <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f9a8d4;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#ec4899;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="12" fill="none" stroke="#fff" stroke-width="3"/>
      <circle cx="55" cy="25" r="3" fill="#fff"/>
    </svg>`,
    tags: ["instagram", "social", "rede social"],
    isPremium: false,
  },
  {
    id: "icon-email",
    name: "E-mail",
    category: "icon",
    subcategory: "contato",
    svg: `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="50" height="30" fill="#AFA8FF" rx="4"/>
      <path d="M15 25 L40 45 L65 25" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    tags: ["email", "contato", "mensagem"],
    isPremium: false,
  },
];

export function getElementByCategory(category: string) {
  return graphicElementsData.filter((el) => el.category === category);
}

export function getElementById(id: string) {
  return graphicElementsData.find((el) => el.id === id);
}

export function searchElements(query: string) {
  const lowerQuery = query.toLowerCase();
  return graphicElementsData.filter(
    (el) =>
      el.name.toLowerCase().includes(lowerQuery) ||
      el.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
