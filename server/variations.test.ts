import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("variations.generate", () => {
  it("deve gerar 10 variações de uma criação", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    // Criar uma criação de teste
    const creation = await caller.creations.create({
      text: "Teste de Variações",
      format: "portrait",
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

    // Gerar variações
    const variations = await caller.variations.generate({
      creationId: creation.id,
    });

    // Verificar que 10 variações foram geradas
    expect(variations).toHaveLength(10);

    // Verificar que cada variação tem os campos necessários
    variations.forEach((variation, index) => {
      expect(variation.id).toBe(index + 1);
      expect(variation.text).toBe("Teste de Variações");
      expect(variation.format).toBe("portrait");
      expect(["classic", "bold", "fade", "highlight"]).toContain(variation.model);
      expect(["Oswald", "Serif", "Mono", "Inter"]).toContain(variation.font);
      expect(["left", "center", "right"]).toContain(variation.alignHorizontal);
      expect(variation.palette).toBeDefined();
      expect(variation.palette.id).toBeDefined();
      expect(variation.palette.name).toBeDefined();
      expect(variation.palette.colors).toBeDefined();
    });
  });

  it("deve usar paletas diferentes nas variações", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    const creation = await caller.creations.create({
      text: "Teste Paletas",
      format: "square",
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

    const variations = await caller.variations.generate({
      creationId: creation.id,
    });

    // Verificar que há pelo menos 2 paletas diferentes
    const uniquePalettes = new Set(variations.map(v => v.palette.id));
    expect(uniquePalettes.size).toBeGreaterThanOrEqual(2);
  });

  it("deve lançar erro se criação não existir", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    await expect(
      caller.variations.generate({ creationId: 99999 })
    ).rejects.toThrow("Criação não encontrada");
  });
});
