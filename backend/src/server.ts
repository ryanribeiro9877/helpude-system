import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import consultaRoutes from "./routes/consultas.js";
import pipelineRoutes from "./routes/pipeline.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/consultas", consultaRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/dashboard", dashboardRoutes);

async function start() {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start();
