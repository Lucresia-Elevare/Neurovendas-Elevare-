import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("creations.create", () => {
  it("cria uma nova composição com dados válidos", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const creation = await caller.creations.create({
      text: "Texto de teste",
      format: "portrait",
      model: "classic",
      fontSize: 100,
      font: "Inter",
      textColor: "white",
      textOutline: 0,
      alignHorizontal: "center",
      alignVertical: "middle",
      fadeOverlay: 50,
      blur: 0,
      brightness: 100,
      contrast: 100,
    });

    expect(creation).toBeDefined();
    expect(creation.text).toBe("Texto de teste");
    expect(creation.format).toBe("portrait");
    expect(creation.model).toBe("classic");
    expect(creation.userId).toBe(1);
  });

  it("cria composição com imagem de fundo", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const creation = await caller.creations.create({
      text: "Texto com imagem",
      format: "square",
      model: "bold",
      backgroundImageUrl: "https://example.com/image.jpg",
      backgroundImageKey: "test-key",
      fontSize: 120,
      font: "Oswald",
      textColor: "black",
      textOutline: 1,
      alignHorizontal: "left",
      alignVertical: "top",
      fadeOverlay: 30,
      blur: 5,
      brightness: 110,
      contrast: 90,
    });

    expect(creation).toBeDefined();
    expect(creation.backgroundImageUrl).toBe("https://example.com/image.jpg");
    expect(creation.backgroundImageKey).toBe("test-key");
    expect(creation.textOutline).toBe(1);
  });
});

describe("creations.list", () => {
  it("lista criações do usuário autenticado", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Criar algumas criações primeiro
    await caller.creations.create({
      text: "Criação 1",
      format: "portrait",
      model: "classic",
    });

    await caller.creations.create({
      text: "Criação 2",
      format: "square",
      model: "bold",
    });

    const creations = await caller.creations.list();

    expect(Array.isArray(creations)).toBe(true);
    expect(creations.length).toBeGreaterThanOrEqual(2);
    
    // Verificar que todas as criações pertencem ao usuário
    creations.forEach((creation) => {
      expect(creation.userId).toBe(1);
    });
  });
});

describe("creations.update", () => {
  it("atualiza uma criação existente", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Criar criação
    const created = await caller.creations.create({
      text: "Texto original",
      format: "portrait",
      model: "classic",
    });

    // Atualizar
    const updated = await caller.creations.update({
      id: created.id,
      text: "Texto atualizado",
      fontSize: 150,
    });

    expect(updated.text).toBe("Texto atualizado");
    expect(updated.fontSize).toBe(150);
    expect(updated.id).toBe(created.id);
  });
});

describe("creations.delete", () => {
  it("deleta uma criação existente", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Criar criação
    const created = await caller.creations.create({
      text: "Para deletar",
      format: "portrait",
      model: "classic",
    });

    // Deletar
    const result = await caller.creations.delete({
      id: created.id,
    });

    expect(result.success).toBe(true);

    // Verificar que foi deletada
    const creation = await caller.creations.get({ id: created.id });
    expect(creation).toBeUndefined();
  });
});

describe("creations.get", () => {
  it("obtém uma criação específica por ID", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Criar criação
    const created = await caller.creations.create({
      text: "Buscar por ID",
      format: "story",
      model: "fade",
    });

    // Buscar
    const found = await caller.creations.get({ id: created.id });

    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
    expect(found?.text).toBe("Buscar por ID");
    expect(found?.format).toBe("story");
  });

  it("retorna undefined para ID inexistente", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const found = await caller.creations.get({ id: 999999 });

    expect(found).toBeUndefined();
  });
});
