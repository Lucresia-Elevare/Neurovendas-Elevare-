import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers.ts";
import * as cookie from "cookie";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// tRPC middleware
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => {
      // Extract userId from cookie or auth header
      const cookies = cookie.parse(req.headers.cookie || "");
      const userId = cookies.userId || req.headers["x-user-id"] as string;

      return {
        userId,
      };
    },
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
});
