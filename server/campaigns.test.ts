import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("campaigns", () => {
  it("deve criar campanha com múltiplas criações", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    // Criar criações
    const creation1 = await caller.creations.create({
      text: "Post 1 da Campanha",
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

    const creation2 = await caller.creations.create({
      text: "Post 2 da Campanha",
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

    // Criar campanha
    const result = await caller.campaigns.create({
      title: "Desafio de 7 Dias",
      description: "Campanha teste",
      duration: 7,
      startDate: new Date(),
      creationIds: [creation1.id, creation2.id],
    });

    expect(result.success).toBe(true);
  });

  it("deve listar campanhas do usuário", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    const campaigns = await caller.campaigns.list();

    expect(Array.isArray(campaigns)).toBe(true);
    expect(campaigns.length).toBeGreaterThan(0);
    
    const lastCampaign = campaigns[campaigns.length - 1];
    expect(lastCampaign.title).toBe("Desafio de 7 Dias");
    expect(lastCampaign.duration).toBe(7);
    expect(lastCampaign.creationIds).toHaveLength(2);
  });

  it("deve pausar e retomar campanha", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    const campaigns = await caller.campaigns.list();
    const campaign = campaigns[campaigns.length - 1];

    // Pausar
    const toggleResult1 = await caller.campaigns.toggle({ id: campaign.id });
    expect(toggleResult1.success).toBe(true);
    expect(toggleResult1.isActive).toBe(0);

    // Retomar
    const toggleResult2 = await caller.campaigns.toggle({ id: campaign.id });
    expect(toggleResult2.success).toBe(true);
    expect(toggleResult2.isActive).toBe(1);
  });
});
