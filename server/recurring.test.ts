import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("recurring posts", () => {
  it("deve criar publicação recorrente diária", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    // Criar uma criação primeiro
    const creation = await caller.creations.create({
      text: "Post Recorrente Diário",
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

    // Criar publicação recorrente
    const result = await caller.recurring.create({
      creationId: creation.id,
      title: "Dica Diária",
      frequency: "daily",
      time: "09:00",
    });

    expect(result.success).toBe(true);
  });

  it("deve criar publicação recorrente semanal", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    const creation = await caller.creations.create({
      text: "Post Semanal",
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

    const result = await caller.recurring.create({
      creationId: creation.id,
      title: "Dica de Segunda",
      frequency: "weekly",
      dayOfWeek: 1, // Segunda-feira
      time: "10:00",
    });

    expect(result.success).toBe(true);
  });

  it("deve listar publicações recorrentes do usuário", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    const creation = await caller.creations.create({
      text: "Post para Listar",
      format: "story",
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

    await caller.recurring.create({
      creationId: creation.id,
      title: "Post Teste",
      frequency: "daily",
      time: "12:00",
    });

    const posts = await caller.recurring.list();

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    
    // Encontrar o post "Post Teste" criado neste teste
    const testPost = posts.find((p: any) => p.title === "Post Teste");
    expect(testPost).toBeDefined();
    expect(testPost.frequency).toBe("daily");
    expect(testPost.time).toBe("12:00");
    expect(testPost.isActive).toBe(1);
  });

  it("deve pausar e retomar publicação recorrente", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    const creation = await caller.creations.create({
      text: "Post para Toggle",
      format: "square",
      model: "highlight",
      font: "Mono",
      fontSize: 40,
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

    await caller.recurring.create({
      creationId: creation.id,
      title: "Post Toggle",
      frequency: "weekly",
      dayOfWeek: 3,
      time: "15:00",
    });

    const posts = await caller.recurring.list();
    const post = posts.find(p => p.title === "Post Toggle");
    expect(post).toBeDefined();

    // Pausar
    const toggleResult1 = await caller.recurring.toggle({ id: post!.id });
    expect(toggleResult1.success).toBe(true);
    expect(toggleResult1.isActive).toBe(0);

    // Retomar
    const toggleResult2 = await caller.recurring.toggle({ id: post!.id });
    expect(toggleResult2.success).toBe(true);
    expect(toggleResult2.isActive).toBe(1);
  });

  it("deve deletar publicação recorrente", async () => {
    const caller = appRouter.createCaller({
      user: { id: "1", name: "Test User", email: "test@example.com", role: "user" },
    });

    const creation = await caller.creations.create({
      text: "Post para Deletar",
      format: "portrait",
      model: "classic",
      font: "Oswald",
      fontSize: 44,
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

    await caller.recurring.create({
      creationId: creation.id,
      title: "Post Delete",
      frequency: "monthly",
      dayOfMonth: 15,
      time: "18:00",
    });

    const postsBefore = await caller.recurring.list();
    const post = postsBefore.find(p => p.title === "Post Delete");
    expect(post).toBeDefined();

    const deleteResult = await caller.recurring.delete({ id: post!.id });
    expect(deleteResult.success).toBe(true);

    const postsAfter = await caller.recurring.list();
    const deletedPost = postsAfter.find(p => p.title === "Post Delete");
    expect(deletedPost).toBeUndefined();
  });
});
