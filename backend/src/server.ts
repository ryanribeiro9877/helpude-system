import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";
import { WhatsAppService } from "./services/WhatsAppService.js";
import authRoutes from "./routes/auth.js";
import leadRoutes from "./routes/leads.js";
import webhookRoutes from "./routes/webhooks.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/dashboard", dashboardRoutes);

async function start() {
  await connectDatabase();

  // Initialize WhatsApp connection pool
  await WhatsAppService.initializePool();

  app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT}`);
  });
}

start();
