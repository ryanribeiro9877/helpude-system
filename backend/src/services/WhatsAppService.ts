import { WhatsAppConnection, IWhatsAppConnection } from "../models/WhatsAppConnection.js";
import { Lead, ILead } from "../models/Lead.js";
import { MessageTemplate } from "../models/MessageTemplate.js";
import { logger } from "../config/logger.js";
import { getActionCost } from "../utils/costs.js";
import { v4 as uuidv4 } from "uuid";

export class WhatsAppService {
  static readonly POOL_SIZE = 20;
  static readonly DAILY_LIMIT = 25;
  static readonly LINK_MAX_DAYS = 3;

  /** Get or assign a connection for the lead (retention logic) */
  static async getConnectionForLead(lead: ILead): Promise<IWhatsAppConnection | null> {
    // Retention: reuse same connection if assigned
    if (lead.whatsappConnectionId) {
      const conn = await WhatsAppConnection.findById(lead.whatsappConnectionId);
      if (conn && conn.status === "active" && conn.dailyMessagesSent < conn.dailyLimit) {
        return conn;
      }
      // Failover: previous connection unavailable, find new one
      logger.info(`Failover for lead ${lead._id}: previous connection unavailable`);
    }

    // Find least-loaded active connection
    const conn = await WhatsAppConnection.findOne({
      status: "active",
      dailyMessagesSent: { $lt: WhatsAppService.DAILY_LIMIT },
    }).sort({ dailyMessagesSent: 1 });

    if (conn) {
      // Assign lead to this connection
      await WhatsAppConnection.findByIdAndUpdate(conn._id, {
        $addToSet: { assignedLeads: lead._id },
      });
      lead.whatsappConnectionId = conn._id;
      await lead.save();
    }

    return conn;
  }

  /** Send WhatsApp message to a lead */
  static async sendMessage(leadId: string): Promise<{ success: boolean; reason?: string }> {
    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, reason: "lead_not_found" };

    // Block rules: LARANJA blocks manual WhatsApp, VERMELHO pauses all
    if (lead.color === "vermelho") {
      return { success: false, reason: "lead_blocked_vermelho" };
    }

    if (lead.telefones.length === 0) {
      return { success: false, reason: "no_phone" };
    }

    const connection = await WhatsAppService.getConnectionForLead(lead);
    if (!connection) {
      return { success: false, reason: "no_available_connection" };
    }

    // Generate new link if >3 days or no link
    const daysSinceLastLink = lead.whatsappLastSentAt
      ? (Date.now() - lead.whatsappLastSentAt.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    if (!lead.whatsappLinkId || daysSinceLastLink > WhatsAppService.LINK_MAX_DAYS) {
      lead.whatsappLinkId = uuidv4();
    }

    // Get random template
    const templates = await MessageTemplate.find({ channel: "whatsapp", active: true });
    const template = templates.length > 0
      ? templates[Math.floor(Math.random() * templates.length)]
      : null;

    const cost = getActionCost("whatsapp");

    // Record the message
    connection.dailyMessagesSent += 1;
    connection.totalMessagesSent += 1;
    connection.lastMessageAt = new Date();
    await connection.save();

    lead.whatsappLastSentAt = new Date();
    lead.totalCost += cost;
    lead.interactions.push({
      type: "whatsapp",
      channel: `connection-${connection.connectionNumber}`,
      message: template
        ? `Template: ${template.name} | Link: ${lead.whatsappLinkId}`
        : `Mensagem enviada | Link: ${lead.whatsappLinkId}`,
      cost,
      timestamp: new Date(),
      details: {
        connectionNumber: connection.connectionNumber,
        linkId: lead.whatsappLinkId,
        templateName: template?.name,
      },
    });
    await lead.save();

    logger.info(
      `WhatsApp sent to lead ${leadId} via connection ${connection.connectionNumber}`
    );
    return { success: true };
  }

  /** Reset all daily counters (run at 00:00) */
  static async resetDailyCounts(): Promise<void> {
    await WhatsAppConnection.updateMany(
      {},
      { $set: { dailyMessagesSent: 0, lastResetAt: new Date() } }
    );
    logger.info("WhatsApp daily counters reset");
  }

  /** Initialize connection pool if not exists */
  static async initializePool(): Promise<void> {
    const count = await WhatsAppConnection.countDocuments();
    if (count >= WhatsAppService.POOL_SIZE) return;

    for (let i = count + 1; i <= WhatsAppService.POOL_SIZE; i++) {
      await WhatsAppConnection.create({
        connectionNumber: i,
        phone: `+5511900000${String(i).padStart(3, "0")}`,
        status: "active",
      });
    }
    logger.info(`WhatsApp pool initialized with ${WhatsAppService.POOL_SIZE} connections`);
  }
}
