import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth.js";
import { User } from "../models/User.js";
import { Cliente } from "../models/Cliente.js";

const router = Router();

router.use(authMiddleware);

router.get("/metrics", async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    const totalClientes = await Cliente.countDocuments({ userId: req.userId });
    const aprovados = await Cliente.countDocuments({
      userId: req.userId,
      creditStatus: "approved",
    });
    const contatados = await Cliente.countDocuments({
      userId: req.userId,
      messagesSent: true,
    });
    const convertidos = await Cliente.countDocuments({
      userId: req.userId,
      pipelineStage: "converted",
    });

    const creditoTotal = await Cliente.aggregate([
      { $match: { userId: user._id, creditStatus: "approved" } },
      { $group: { _id: null, total: { $sum: "$creditoAprovado" } } },
    ]);

    res.json({
      totalConsultas: user.consultasUsadas,
      consultasRestantes: user.consultasLimite - user.consultasUsadas,
      creditoTotalAprovado: creditoTotal[0]?.total || 0,
      clientesAprovados: aprovados,
      clientesContatados: contatados,
      taxaConversao: totalClientes > 0 ? (convertidos / totalClientes) * 100 : 0,
      mediaCredito: aprovados > 0 ? (creditoTotal[0]?.total || 0) / aprovados : 0,
    });
  } catch {
    res.status(500).json({ error: "Erro ao buscar métricas" });
  }
});

export default router;
