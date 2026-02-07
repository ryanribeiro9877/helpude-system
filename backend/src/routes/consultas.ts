import { Router, Response } from "express";
import multer from "multer";
import { Queue } from "bullmq";
import { authMiddleware, AuthRequest } from "../middlewares/auth.js";
import { ConsultaLote } from "../models/ConsultaLote.js";
import { Cliente } from "../models/Cliente.js";
import { redis } from "../config/redis.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const consultaQueue = new Queue("consultas", { connection: redis });

router.use(authMiddleware);

router.post("/upload", upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Arquivo não enviado" });
      return;
    }

    const lote = await ConsultaLote.create({
      userId: req.userId,
      fileName: req.file.originalname,
      totalRegistros: 0,
      status: "processing",
    });

    await consultaQueue.add("process-lote", {
      loteId: lote._id.toString(),
      userId: req.userId,
      fileBuffer: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
    });

    res.status(201).json(lote);
  } catch {
    res.status(500).json({ error: "Erro ao processar upload" });
  }
});

router.get("/lotes", async (req: AuthRequest, res: Response) => {
  try {
    const lotes = await ConsultaLote.find({ userId: req.userId })
      .sort({ uploadedAt: -1 })
      .limit(20);
    res.json(lotes);
  } catch {
    res.status(500).json({ error: "Erro ao buscar lotes" });
  }
});

router.get("/clientes", async (req: AuthRequest, res: Response) => {
  try {
    const clientes = await Cliente.find({ userId: req.userId })
      .sort({ consultedAt: -1 })
      .limit(100);
    res.json(clientes);
  } catch {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

export default router;
