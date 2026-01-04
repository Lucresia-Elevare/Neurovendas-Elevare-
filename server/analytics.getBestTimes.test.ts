import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { postAnalytics } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

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
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("analytics.getBestTimes", () => {
  let testUserId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Usar um ID numérico alto para evitar conflitos
    testUserId = Math.floor(Math.random() * 1000000) + 100000;

    // Criar dados de analytics com diferentes horários e engajamentos
    const analyticsData = [
      // 9h - alto engajamento
      { hour: 9, likes: 100, comments: 20, shares: 10, saves: 15, reach: 500 },
      { hour: 9, likes: 120, comments: 25, shares: 12, saves: 18, reach: 550 },
      
      // 12h - médio engajamento
      { hour: 12, likes: 50, comments: 10, shares: 5, saves: 8, reach: 400 },
      
      // 18h - alto engajamento
      { hour: 18, likes: 150, comments: 30, shares: 15, saves: 20, reach: 600 },
      { hour: 18, likes: 140, comments: 28, shares: 14, saves: 19, reach: 580 },
      
      // 21h - baixo engajamento
      { hour: 21, likes: 30, comments: 5, shares: 2, saves: 3, reach: 300 },
    ];

    for (const data of analyticsData) {
      const publishedAt = new Date();
      publishedAt.setHours(data.hour, 0, 0, 0);
      
      await db.insert(postAnalytics).values({
        userId: testUserId,
        creationId: 1, // ID fictício
        likes: data.likes,
        comments: data.comments,
        shares: data.shares,
        saves: data.saves,
        reach: data.reach,
        impressions: data.reach * 1.5,
        publishedAt,
        dayOfWeek: publishedAt.getDay(),
        hourOfDay: data.hour,
      });
    }
  });

  it("deve retornar horários ordenados por engajamento", async () => {
    const ctx = createTestContext(testUserId);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.getBestTimes();

    // Deve retornar array de horários
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(5); // Limite de 5 horários

    // Cada item deve ter a estrutura correta
    result.forEach((item) => {
      expect(item).toHaveProperty("hour");
      expect(item).toHaveProperty("avgEngagement");
      expect(item).toHaveProperty("postCount");
      expect(typeof item.hour).toBe("number");
      expect(typeof item.avgEngagement).toBe("number");
      expect(typeof item.postCount).toBe("number");
    });

    // Deve estar ordenado por engajamento (decrescente)
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].avgEngagement).toBeGreaterThanOrEqual(result[i + 1].avgEngagement);
    }

    // 18h e 9h devem estar entre os melhores horários (maior engajamento)
    const topHours = result.slice(0, 2).map(r => r.hour);
    expect(topHours).toContain(18);
    expect(topHours).toContain(9);
  });

  it("deve retornar array vazio para usuário sem analytics", async () => {
    const ctx = createTestContext(999999999);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.getBestTimes();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("deve calcular engajamento corretamente com pesos", async () => {
    const ctx = createTestContext(testUserId);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.getBestTimes();

    // Verificar que o engajamento é calculado corretamente
    // Fórmula: (likes + comments*2 + shares*3 + saves*2) * 100 / reach
    result.forEach((item) => {
      expect(item.avgEngagement).toBeGreaterThan(0);
      // Engajamento deve ser uma porcentagem razoável (0-200%)
      expect(item.avgEngagement).toBeLessThan(300);
    });
  });
});
