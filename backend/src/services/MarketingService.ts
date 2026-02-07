import { Lead, ILead } from "../models/Lead.js";
import { MessageTemplate } from "../models/MessageTemplate.js";
import { logger } from "../config/logger.js";
import { getActionCost } from "../utils/costs.js";
import { v4 as uuidv4 } from "uuid";

export class MarketingService {
  /** Send RCS with tracking link */
  static async sendRCS(leadId: string): Promise<{ success: boolean; reason?: string }> {
    const lead = await Lead.findById(leadId);
    if (!lead || lead.blocked) return { success: false, reason: "blocked_or_not_found" };

    const templates = await MessageTemplate.find({ channel: "rcs", active: true });
    const template = templates.length > 0
      ? templates[Math.floor(Math.random() * templates.length)]
      : null;

    const trackingId = uuidv4();
    const cost = getActionCost("rcs");

    lead.rcsSent = true;
    lead.totalCost += cost;
    lead.interactions.push({
      type: "rcs",
      channel: "rcs",
      message: `RCS enviado${template ? ` [${template.name}]` : ""} | Tracking: ${trackingId}`,
      cost,
      timestamp: new Date(),
      details: { trackingId, templateName: template?.name },
    });
    await lead.save();

    logger.info(`RCS sent to lead ${leadId}, tracking: ${trackingId}`);
    return { success: true };
  }

  /** Send SMS as fallback */
  static async sendSMS(leadId: string): Promise<{ success: boolean; reason?: string }> {
    const lead = await Lead.findById(leadId);
    if (!lead || lead.blocked) return { success: false, reason: "blocked_or_not_found" };

    if (lead.telefones.length === 0) return { success: false, reason: "no_phone" };

    const templates = await MessageTemplate.find({ channel: "sms", active: true });
    const template = templates.length > 0
      ? templates[Math.floor(Math.random() * templates.length)]
      : null;

    const cost = getActionCost("sms");

    lead.smsSent = true;
    lead.totalCost += cost;
    lead.interactions.push({
      type: "sms",
      channel: "sms",
      message: `SMS enviado para ${lead.telefones[0]}${template ? ` [${template.name}]` : ""}`,
      cost,
      timestamp: new Date(),
      details: { phone: lead.telefones[0], templateName: template?.name },
    });
    await lead.save();

    logger.info(`SMS sent to lead ${leadId}`);
    return { success: true };
  }

  /** Send email with tracking */
  static async sendEmail(leadId: string): Promise<{ success: boolean; reason?: string }> {
    const lead = await Lead.findById(leadId);
    if (!lead || lead.blocked) return { success: false, reason: "blocked_or_not_found" };
    if (!lead.email) return { success: false, reason: "no_email" };

    const templates = await MessageTemplate.find({ channel: "email", active: true });
    const template = templates.length > 0
      ? templates[Math.floor(Math.random() * templates.length)]
      : null;

    const trackingId = uuidv4();
    const cost = getActionCost("email");

    lead.emailSent = true;
    lead.totalCost += cost;
    lead.interactions.push({
      type: "email",
      channel: "email",
      message: `Email enviado para ${lead.email}${template ? ` [${template.name}]` : ""} | Tracking: ${trackingId}`,
      cost,
      timestamp: new Date(),
      details: { email: lead.email, trackingId, templateName: template?.name },
    });
    await lead.save();

    logger.info(`Email sent to lead ${leadId}, tracking: ${trackingId}`);
    return { success: true };
  }

  /** Process webhook for link click / email open / RCS interaction */
  static async handleWebhook(
    type: "link_click" | "email_open" | "rcs_click",
    leadId: string
  ): Promise<ILead | null> {
    const lead = await Lead.findById(leadId);
    if (!lead) return null;

    const now = new Date();

    switch (type) {
      case "link_click":
        lead.linkClicked = true;
        lead.linkClickedAt = now;
        if (lead.color === "laranja") {
          lead.previousColor = lead.color;
          lead.color = "verde";
          lead.interacted = true;
          lead.interactedAt = now;
        }
        break;
      case "email_open":
        lead.emailOpenedAt = now;
        if (lead.color === "laranja") {
          lead.previousColor = lead.color;
          lead.color = "verde";
          lead.interacted = true;
          lead.interactedAt = now;
        }
        break;
      case "rcs_click":
        lead.rcsClickedAt = now;
        if (lead.color === "laranja") {
          lead.previousColor = lead.color;
          lead.color = "verde";
          lead.interacted = true;
          lead.interactedAt = now;
        }
        break;
    }

    lead.interactions.push({
      type: "status_change",
      message: `Webhook recebido: ${type}`,
      timestamp: now,
      details: { webhookType: type },
    });

    await lead.save();
    logger.info(`Webhook ${type} processed for lead ${leadId}`);
    return lead;
  }
}
