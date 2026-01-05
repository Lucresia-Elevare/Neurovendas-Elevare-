# Notas de Design - Identidade Visual Elevare Editorial AI

## Paleta de Cores Implementada

### Cores Principais
- **Indigo 900** (#1e1b4b): Cor principal de botões e contrastes fortes
- **Indigo 600** (#4f46e5): Cor de destaque, ícones ativos e links
- **Indigo 500**: Variante para hover e estados ativos
- **Indigo 100/50**: Fundos de cards e labels delicados

### Cores de Texto
- **Slate 900** (#0f172a): Títulos e textos principais
- **Slate 600** (#475569): Parágrafos e textos secundários
- **Slate 50** (#f8fafc): Cor de fundo da aplicação (light mode)

### Cores Semânticas
- **Emerald 500/600**: Sucesso e confirmações
- **Rose 500/600**: Erros e alertas críticos
- **Amber 400/500**: Avisos e alertas informativos
- **Violet 500/600**: Áudio e recursos especiais

## Tipografia

### Fontes
- **Inter**: Fonte principal (pesos 300, 400, 500, 600, 700, 800)
  - Corpo de texto: 400
  - Headings: 700
  - Elementos de destaque: 600
- **Playfair Display Italic**: Fonte serif para o "E" do logo

### Hierarquia
- H1-H6: Inter 700 (bold)
- Body: Inter 400 (regular)
- Muted text: Inter 400 com Slate 600

## Componentes de UI

### Border Radius
- **Cards grandes**: rounded-3xl (24px)
- **Botões e inputs**: rounded-2xl (16px)
- **Ícones em containers**: rounded-2xl (16px)

### Shadows
- **Cards**: shadow-xl (sombra pronunciada)
- **Dialogs e popovers**: shadow-2xl (sombra mais intensa)
- **Elementos flutuantes**: shadow-lg

### Gradientes
Os gradientes foram atualizados para usar predominantemente tons de indigo e violet:
- **Conteúdo**: from-amber-500/20 to-yellow-500/20
- **E-book**: from-emerald-500/20 to-green-500/20
- **Capa**: from-rose-500/20 to-pink-500/20
- **Áudio**: from-violet-500/20 to-indigo-500/20
- **Templates**: from-indigo-500/20 to-indigo-300/20
- **Landing Pages**: from-violet-500/20 to-indigo-400/20
- **Gatilhos Mentais**: from-indigo-600/20 to-violet-500/20

## Transições

### Tema
- Duração: 300ms
- Easing: ease-in-out
- Propriedades: background-color, color, border-color, box-shadow

### Interações
- Hover em cards: scale-110 nos ícones
- Hover em botões: translate-x-2 nas setas
- Duração padrão: 300ms

## Predominância de Tons Lilás/Indigo

A identidade visual agora reflete fortemente a paleta Indigo/Slate:
- Logo com "E" em indigo
- Título principal em gradiente indigo-violet
- Ícones e botões primários em indigo
- Cards com bordas e fundos em tons de indigo suaves
- Links e elementos interativos em indigo-600

## Tema Claro/Escuro

### Light Mode (padrão)
- Background: Slate 50 (#f8fafc)
- Foreground: Slate 900 (#0f172a)
- Cards: White puro
- Borders: Slate 200

### Dark Mode
- Background: Slate 900 (#0f172a)
- Foreground: Slate 50
- Cards: Slate 800
- Borders: Slate 700

## Acessibilidade

- Contraste adequado entre texto e fundo (WCAG AA)
- Focus rings visíveis em elementos interativos
- Transições suaves sem causar motion sickness
- Hierarquia visual clara com pesos de fonte e cores
