import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("bulkGenerate", () => {
  it("deve criar múltiplas criações a partir de CSV", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    const csvData = [
      { text: "Post 1 do CSV", format: "square" as const },
      { text: "Post 2 do CSV", format: "portrait" as const },
      { text: "Post 3 do CSV", format: "story" as const },
    ];

    const result = await caller.bulkGenerate.fromCSV({ csvData });

    expect(result.success).toBe(true);
    expect(result.count).toBe(3);
  });
});

describe("storyConversion", () => {
  it("deve converter criação para story", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    // Criar criação original
    const creation = await caller.creations.create({
      text: "Post para Story",
      format: "square",
      model: "classic",
      font: "Oswald",
      fontSize: 48,
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 50,
      blur: 0,
      brightness: 100,
      contrast: 100,
      backgroundImageUrl: undefined,
      backgroundImageKey: undefined,
    });

    // Converter para story
    const result = await caller.storyConversion.convertToStory({
      creationId: creation.id,
    });

    expect(result.success).toBe(true);
  });

  it("deve converter múltiplas criações em lote", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    // Criar criações
    const creation1 = await caller.creations.create({
      text: "Post 1 para Lote",
      format: "portrait",
      model: "bold",
      font: "Inter",
      fontSize: 36,
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 50,
      blur: 0,
      brightness: 100,
      contrast: 100,
      backgroundImageUrl: undefined,
      backgroundImageKey: undefined,
    });

    const creation2 = await caller.creations.create({
      text: "Post 2 para Lote",
      format: "square",
      model: "fade",
      font: "Serif",
      fontSize: 42,
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 50,
      blur: 0,
      brightness: 100,
      contrast: 100,
      backgroundImageUrl: undefined,
      backgroundImageKey: undefined,
    });

    // Converter em lote
    const result = await caller.storyConversion.convertBatch({
      creationIds: [creation1.id, creation2.id],
    });

    expect(result.success).toBe(true);
    expect(result.count).toBe(2);
  });
});
