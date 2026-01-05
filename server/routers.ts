import { initTRPC } from "@trpc/server";
import { ebooksRouter } from "./routes/ebooks.router.ts";

const t = initTRPC.context<{ userId?: string }>().create();

export const appRouter = t.router({
  ebooks: ebooksRouter,
});

export type AppRouter = typeof appRouter;
