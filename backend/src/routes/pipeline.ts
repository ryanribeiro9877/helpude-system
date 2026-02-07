import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth.js";
import { Cliente } from "../models/Cliente.js";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const stages = ["approved", "contacted", "engaged", "converted"] as const;
    const pipeline = await Promise.all(
      stages.map(async (stage) => {
        const clientes = await Cliente.find({
          userId: req.userId,
          creditStatus: "approved",
          pipelineStage: stage,
        }).sort({ consultedAt: -1 });
        return { stage, clientes };
      })
    );
    res.json(pipeline);
  } catch {
    res.status(500).json({ error: "Erro ao buscar pipeline" });
  }
});

router.patch("/:clienteId/stage", async (req: AuthRequest, res: Response) => {
  try {
    const { stage } = req.body;
    const cliente = await Cliente.findOneAndUpdate(
      { _id: req.params.clienteId, userId: req.userId },
      { pipelineStage: stage },
      { new: true }
    );
    if (!cliente) {
      res.status(404).json({ error: "Cliente não encontrado" });
      return;
    }
    res.json(cliente);
  } catch {
    res.status(500).json({ error: "Erro ao atualizar estágio" });
  }
});

export default router;
