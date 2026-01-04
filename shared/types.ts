/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

/**
 * Tipos específicos do TextPop
 */
export type Format = "square" | "portrait" | "story";
export type Model = "classic" | "bold" | "fade" | "highlight";
export type TextColor = "white" | "black";
export type AlignHorizontal = "left" | "center" | "right";
export type AlignVertical = "top" | "middle" | "bottom";
export type Font = "Oswald" | "Serif" | "Mono" | "Inter";

/**
 * Dimensões para cada formato de Instagram
 */
export const FORMAT_DIMENSIONS: Record<Format, { width: number; height: number }> = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};

/**
 * Configurações de estilo para cada modelo
 */
export interface ModelStyle {
  background: string;
  textColor: TextColor;
  fadeOverlay: number;
}

export const MODEL_STYLES: Record<Model, ModelStyle> = {
  classic: {
    background: "#ffffff",
    textColor: "black",
    fadeOverlay: 0,
  },
  bold: {
    background: "#1a1a1a",
    textColor: "white",
    fadeOverlay: 0,
  },
  fade: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "white",
    fadeOverlay: 50,
  },
  highlight: {
    background: "#ff6b35",
    textColor: "white",
    fadeOverlay: 0,
  },
};
