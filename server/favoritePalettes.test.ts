import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(userId: number): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId.toString(),
    openId: `test-${userId}`,
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("favoritePalettes", () => {
  let testUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Usar um ID numérico alto para evitar conflitos
    testUserId = Math.floor(Math.random() * 1000000) + 100000;
  });

  it("deve adicionar paleta aos favoritos", async () => {
    const ctx = createTestContext(testUserId);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favoritePalettes.add({
      paletteId: "rose-gold",
      paletteName: "Rose Gold",
      colors: ["#B76E79", "#E8B4B8", "#FFF5F7"],
    });

    expect(result.success).toBe(true);
  });

  it("deve listar paletas favoritas do usuário", async () => {
    const ctx = createTestContext(testUserId);
    const caller = appRouter.createCaller(ctx);

    const favorites = await caller.favoritePalettes.list();

    expect(Array.isArray(favorites)).toBe(true);
    expect(favorites.length).toBeGreaterThan(0);
    expect(favorites[0]).toHaveProperty("paletteId");
    expect(favorites[0]).toHaveProperty("paletteName");
    expect(favorites[0]).toHaveProperty("colors");
    expect(Array.isArray(favorites[0].colors)).toBe(true);
  });

  it("deve verificar se paleta está nos favoritos", async () => {
    const ctx = createTestContext(testUserId);
    const caller = appRouter.createCaller(ctx);

    const isFavorite = await caller.favoritePalettes.isFavorite({
      paletteId: "rose-gold",
    });

    expect(isFavorite).toBe(true);
  });

  it("não deve adicionar paleta duplicada", async () => {
    const ctx = createTestContext(testUserId);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favoritePalettes.add({
      paletteId: "rose-gold",
      paletteName: "Rose Gold",
      colors: ["#B76E79", "#E8B4B8", "#FFF5F7"],
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("já está nos favoritos");
  });

  it("deve remover paleta dos favoritos", async () => {
    const ctx = createTestContext(testUserId);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favoritePalettes.remove({
      paletteId: "rose-gold",
    });

    expect(result.success).toBe(true);

    // Verificar se foi removida
    const isFavorite = await caller.favoritePalettes.isFavorite({
      paletteId: "rose-gold",
    });

    expect(isFavorite).toBe(false);
  });

  it("deve retornar array vazio para usuário sem favoritos", async () => {
    const ctx = createTestContext(999999999);
    const caller = appRouter.createCaller(ctx);

    const favorites = await caller.favoritePalettes.list();

    expect(Array.isArray(favorites)).toBe(true);
    expect(favorites.length).toBe(0);
  });
});
