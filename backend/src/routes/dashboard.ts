import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { Lead } from "../models/Lead.js";
import { WhatsAppConnection } from "../models/WhatsAppConnection.js";
import { LeadService } from "../services/LeadService.js";

const router = Router();

router.use(authMiddleware);

router.get("/metrics", async (_req: Request, res: Response) => {
  try {
    const [colorStats, costSummary, totalLeads, whatsappConns] = await Promise.all([
      LeadService.getStats(),
      LeadService.getCostSummary(),
      Lead.countDocuments(),
      WhatsAppConnection.find({ status: "active" }),
    ]);

    const interacted = await Lead.countDocuments({ interacted: true });
    const converted = colorStats.roxo || 0;

    res.json({
      totalLeads,
      colors: colorStats,
      costs: costSummary,
      taxaConversao: totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : "0",
      taxaInteracao: totalLeads > 0 ? ((interacted / totalLeads) * 100).toFixed(1) : "0",
      whatsapp: {
        activeConnections: whatsappConns.length,
        totalSentToday: whatsappConns.reduce((sum, c) => sum + c.dailyMessagesSent, 0),
        dailyCapacity: whatsappConns.reduce((sum, c) => sum + c.dailyLimit, 0),
      },
    });
  } catch {
    res.status(500).json({ error: "Erro ao buscar métricas" });
  }
});

router.get("/timeline", async (_req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const daily = await Lead.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: 1 },
          interacted: { $sum: { $cond: ["$interacted", 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ["$color", "roxo"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(daily);
  } catch {
    res.status(500).json({ error: "Erro ao buscar timeline" });
  }
});

export default router;
