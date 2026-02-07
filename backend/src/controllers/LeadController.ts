import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { Lead } from "../models/Lead.js";
import { LeadService } from "../services/LeadService.js";
import { CallService } from "../services/CallService.js";
import { leadImportQueue, iaCallQueue, whatsappQueue, rcsQueue, smsQueue, emailQueue } from "../queues/index.js";
import { logger } from "../config/logger.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
export const uploadMiddleware = upload.single("file");

export class LeadController {
  /** GET /api/leads */
  static async list(req: Request, res: Response) {
    try {
      const { color, list, search, page = "1", limit = "50" } = req.query;
      const filter: Record<string, unknown> = {};

      if (color) filter.color = color;
      if (list) filter.list = list;
      if (search) {
        filter.$or = [
          { nome: { $regex: search, $options: "i" } },
          { cpf: { $regex: search } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const [leads, total] = await Promise.all([
        Lead.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
        Lead.countDocuments(filter),
      ]);

      res.json({ leads, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
      logger.error("Error listing leads:", error);
      res.status(500).json({ error: "Erro ao buscar leads" });
    }
  }

  /** GET /api/leads/stats */
  static async stats(_req: Request, res: Response) {
    try {
      const [colorStats, costSummary, totalLeads] = await Promise.all([
        LeadService.getStats(),
        LeadService.getCostSummary(),
        Lead.countDocuments(),
      ]);

      res.json({ colors: colorStats, costs: costSummary, totalLeads });
    } catch (error) {
      logger.error("Error getting stats:", error);
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  }

  /** GET /api/leads/:id */
  static async getById(req: Request, res: Response) {
    try {
      const lead = await Lead.findById(req.params.id);
      if (!lead) {
        res.status(404).json({ error: "Lead não encontrado" });
        return;
      }
      res.json(lead);
    } catch (error) {
      logger.error("Error getting lead:", error);
      res.status(500).json({ error: "Erro ao buscar lead" });
    }
  }

  /** PATCH /api/leads/:id/color */
  static async updateColor(req: Request, res: Response) {
    try {
      const { color, reason } = req.body;
      const lead = await LeadService.updateColor(req.params.id, color, reason);
      if (!lead) {
        res.status(404).json({ error: "Lead não encontrado" });
        return;
      }
      res.json(lead);
    } catch (error) {
      logger.error("Error updating lead color:", error);
      res.status(500).json({ error: "Erro ao atualizar cor" });
    }
  }

  /** POST /api/leads/:id/observation */
  static async addObservation(req: Request, res: Response) {
    try {
      const { text } = req.body;
      const lead = await LeadService.addObservation(req.params.id, text);
      if (!lead) {
        res.status(404).json({ error: "Lead não encontrado" });
        return;
      }
      res.json(lead);
    } catch (error) {
      logger.error("Error adding observation:", error);
      res.status(500).json({ error: "Erro ao adicionar observação" });
    }
  }

  /** POST /api/leads/import */
  static async importFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Arquivo não enviado" });
        return;
      }

      const batchId = uuidv4();
      await leadImportQueue.add("import", {
        fileBuffer: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        batchId,
      });

      res.status(201).json({ batchId, fileName: req.file.originalname, status: "processing" });
    } catch (error) {
      logger.error("Error importing file:", error);
      res.status(500).json({ error: "Erro ao importar arquivo" });
    }
  }

  /** POST /api/leads/:id/call */
  static async triggerCall(req: Request, res: Response) {
    try {
      await iaCallQueue.add("call", { leadId: req.params.id });
      res.json({ queued: true });
    } catch (error) {
      logger.error("Error queueing call:", error);
      res.status(500).json({ error: "Erro ao agendar ligação" });
    }
  }

  /** POST /api/leads/:id/whatsapp */
  static async triggerWhatsApp(req: Request, res: Response) {
    try {
      const lead = await Lead.findById(req.params.id);
      if (lead?.color === "laranja") {
        res.status(400).json({ error: "LARANJA bloqueia envio manual de WhatsApp" });
        return;
      }
      await whatsappQueue.add("send", { leadId: req.params.id });
      res.json({ queued: true });
    } catch (error) {
      logger.error("Error queueing WhatsApp:", error);
      res.status(500).json({ error: "Erro ao agendar WhatsApp" });
    }
  }

  /** POST /api/leads/batch-action */
  static async batchAction(req: Request, res: Response) {
    try {
      const { leadIds, action } = req.body as { leadIds: string[]; action: string };

      const queueMap: Record<string, typeof rcsQueue> = {
        call: iaCallQueue,
        whatsapp: whatsappQueue,
        rcs: rcsQueue,
        sms: smsQueue,
        email: emailQueue,
      };

      const queue = queueMap[action];
      if (!queue) {
        res.status(400).json({ error: "Ação inválida" });
        return;
      }

      const jobs = leadIds.map((leadId) => queue.add(action, { leadId }));
      await Promise.all(jobs);

      res.json({ queued: leadIds.length, action });
    } catch (error) {
      logger.error("Error batch action:", error);
      res.status(500).json({ error: "Erro na ação em lote" });
    }
  }
}
