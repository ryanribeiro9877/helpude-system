import { Lead, ILead, LeadColor } from "../models/Lead.js";
import { logger } from "../config/logger.js";

export class LeadService {
  static async importLeads(
    data: Array<{ nome: string; cpf: string; telefones: string[]; email?: string; list?: "A" | "B" }>,
    batchId: string
  ): Promise<ILead[]> {
    const leads: ILead[] = [];

    for (const item of data) {
      try {
        const existing = await Lead.findOne({ cpf: item.cpf });
        if (existing) {
          logger.warn(`Lead with CPF ${item.cpf} already exists, skipping`);
          continue;
        }

        const lead = await Lead.create({
          nome: item.nome,
          cpf: item.cpf,
          telefones: item.telefones,
          email: item.email || "",
          list: item.list || "B",
          color: "laranja",
          importBatchId: batchId,
          interactions: [
            {
              type: "status_change",
              message: "Lead importado",
              timestamp: new Date(),
            },
          ],
        });
        leads.push(lead);
      } catch (error) {
        logger.error(`Error importing lead ${item.cpf}:`, error);
      }
    }

    logger.info(`Imported ${leads.length}/${data.length} leads (batch: ${batchId})`);
    return leads;
  }

  static async updateColor(leadId: string, newColor: LeadColor, reason?: string): Promise<ILead | null> {
    const lead = await Lead.findById(leadId);
    if (!lead) return null;

    const previousColor = lead.color;

    // Block rules
    if (newColor === "vermelho") {
      lead.blocked = true;
      lead.blockReason = reason || "Reclamação registrada";
    }
    if (newColor === "roxo") {
      lead.blocked = false;
      lead.blockReason = undefined;
    }

    lead.previousColor = previousColor;
    lead.color = newColor;
    lead.interactions.push({
      type: "status_change",
      message: `Cor alterada: ${previousColor} → ${newColor}${reason ? ` (${reason})` : ""}`,
      timestamp: new Date(),
    });

    await lead.save();
    logger.info(`Lead ${leadId} color: ${previousColor} → ${newColor}`);
    return lead;
  }

  static async getByColor(color?: LeadColor): Promise<ILead[]> {
    const filter = color ? { color } : {};
    return Lead.find(filter).sort({ updatedAt: -1 }).limit(200);
  }

  static async getStats(): Promise<Record<LeadColor, number>> {
    const colors: LeadColor[] = ["roxo", "azul", "verde", "vermelho", "laranja", "branco"];
    const stats = {} as Record<LeadColor, number>;

    await Promise.all(
      colors.map(async (c) => {
        stats[c] = await Lead.countDocuments({ color: c });
      })
    );

    return stats;
  }

  static async getCostSummary(): Promise<{
    totalCost: number;
    byChannel: Record<string, number>;
  }> {
    const result = await Lead.aggregate([
      { $unwind: "$interactions" },
      { $match: { "interactions.cost": { $gt: 0 } } },
      {
        $group: {
          _id: "$interactions.type",
          total: { $sum: "$interactions.cost" },
        },
      },
    ]);

    const byChannel: Record<string, number> = {};
    let totalCost = 0;
    for (const r of result) {
      byChannel[r._id] = r.total;
      totalCost += r.total;
    }

    return { totalCost, byChannel };
  }

  static async addObservation(leadId: string, text: string): Promise<ILead | null> {
    return Lead.findByIdAndUpdate(
      leadId,
      {
        $push: {
          observations: text,
          interactions: {
            type: "note",
            message: text,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  static async checkExpiredProposals(): Promise<number> {
    const expired = await Lead.updateMany(
      {
        proposalStatus: "pending",
        proposalExpiresAt: { $lt: new Date() },
        color: { $ne: "branco" },
      },
      {
        $set: { color: "branco", proposalStatus: "expired" },
        $push: {
          interactions: {
            type: "status_change",
            message: "Proposta expirada - status alterado para BRANCO",
            timestamp: new Date(),
          },
        },
      }
    );
    if (expired.modifiedCount > 0) {
      logger.info(`${expired.modifiedCount} proposals expired → BRANCO`);
    }
    return expired.modifiedCount;
  }
}
