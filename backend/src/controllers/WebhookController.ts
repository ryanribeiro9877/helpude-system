import { Request, Response } from "express";
import { MarketingService } from "../services/MarketingService.js";
import { Lead } from "../models/Lead.js";
import { LeadService } from "../services/LeadService.js";
import { logger } from "../config/logger.js";

export class WebhookController {
  /** POST /api/webhooks/link-click */
  static async linkClick(req: Request, res: Response) {
    try {
      const { leadId } = req.body;
      const lead = await MarketingService.handleWebhook("link_click", leadId);
      if (!lead) {
        res.status(404).json({ error: "Lead não encontrado" });
        return;
      }
      res.json({ success: true, color: lead.color });
    } catch (error) {
      logger.error("Webhook link-click error:", error);
      res.status(500).json({ error: "Erro no webhook" });
    }
  }

  /** POST /api/webhooks/email-open */
  static async emailOpen(req: Request, res: Response) {
    try {
      const { leadId } = req.body;
      const lead = await MarketingService.handleWebhook("email_open", leadId);
      if (!lead) {
        res.status(404).json({ error: "Lead não encontrado" });
        return;
      }
      res.json({ success: true, color: lead.color });
    } catch (error) {
      logger.error("Webhook email-open error:", error);
      res.status(500).json({ error: "Erro no webhook" });
    }
  }

  /** POST /api/webhooks/rcs-click */
  static async rcsClick(req: Request, res: Response) {
    try {
      const { leadId } = req.body;
      const lead = await MarketingService.handleWebhook("rcs_click", leadId);
      if (!lead) {
        res.status(404).json({ error: "Lead não encontrado" });
        return;
      }
      res.json({ success: true, color: lead.color });
    } catch (error) {
      logger.error("Webhook rcs-click error:", error);
      res.status(500).json({ error: "Erro no webhook" });
    }
  }

  /** POST /api/webhooks/payment */
  static async payment(req: Request, res: Response) {
    try {
      const { leadId, value } = req.body;
      const lead = await Lead.findById(leadId);
      if (!lead) {
        res.status(404).json({ error: "Lead não encontrado" });
        return;
      }

      lead.proposalValue = value;
      lead.proposalStatus = "approved";
      await lead.save();
      await LeadService.updateColor(leadId, "roxo", "Pagamento confirmado");

      res.json({ success: true, color: "roxo" });
    } catch (error) {
      logger.error("Webhook payment error:", error);
      res.status(500).json({ error: "Erro no webhook" });
    }
  }

  /** POST /api/webhooks/complaint */
  static async complaint(req: Request, res: Response) {
    try {
      const { leadId, reason } = req.body;
      const lead = await LeadService.updateColor(leadId, "vermelho", reason || "Reclamação recebida");
      if (!lead) {
        res.status(404).json({ error: "Lead não encontrado" });
        return;
      }
      res.json({ success: true, color: "vermelho" });
    } catch (error) {
      logger.error("Webhook complaint error:", error);
      res.status(500).json({ error: "Erro no webhook" });
    }
  }
}
