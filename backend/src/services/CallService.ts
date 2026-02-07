import { Lead, ILead } from "../models/Lead.js";
import { MessageTemplate } from "../models/MessageTemplate.js";
import { logger } from "../config/logger.js";
import { getActionCost } from "../utils/costs.js";

type CallWindow = "morning" | "afternoon" | "evening";

function getCurrentWindow(): CallWindow {
  const hour = new Date().getHours();
  if (hour >= 8 && hour < 12) return "morning";
  if (hour >= 12 && hour < 19) return "afternoon";
  return "evening";
}

function getRecallDelay(attemptNumber: number): number {
  // 5min, 10min, 20min recall delays
  const delays = [5, 10, 20];
  return (delays[Math.min(attemptNumber - 1, delays.length - 1)] ?? 20) * 60 * 1000;
}

export class CallService {
  static readonly MAX_ATTEMPTS = 6;

  static async getNextLeadsToCall(limit: number = 10): Promise<ILead[]> {
    const now = new Date();

    // List A first, then List B. Prioritize scheduled recalls.
    const leads = await Lead.find({
      blocked: false,
      color: { $nin: ["roxo", "vermelho", "branco"] },
      totalCallAttempts: { $lt: CallService.MAX_ATTEMPTS },
      $or: [
        { nextCallAt: { $lte: now } },
        { nextCallAt: null, totalCallAttempts: 0 },
      ],
    })
      .sort({ list: 1, nextCallAt: 1, createdAt: 1 })
      .limit(limit);

    return leads;
  }

  static async processCall(leadId: string): Promise<{
    success: boolean;
    status: string;
    lead: ILead | null;
  }> {
    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, status: "not_found", lead: null };

    if (lead.blocked) return { success: false, status: "blocked", lead };
    if (lead.totalCallAttempts >= CallService.MAX_ATTEMPTS) {
      return { success: false, status: "max_attempts_reached", lead };
    }

    const window = getCurrentWindow();
    const attemptNumber = lead.totalCallAttempts + 1;

    // Pick the best phone: prefer LP phones (first entries), skip invalid
    const validPhones = lead.telefones.filter(
      (p) => !lead.telefonesInvalidos.includes(p)
    );
    if (validPhones.length === 0) {
      logger.warn(`Lead ${leadId} has no valid phones`);
      return { success: false, status: "no_valid_phones", lead };
    }
    const phone = validPhones[0];

    // Get random voice template
    const templates = await MessageTemplate.find({ channel: "voice", active: true });
    const template = templates.length > 0
      ? templates[Math.floor(Math.random() * templates.length)]
      : null;

    // Simulate call result
    const outcomes: Array<"answered" | "no_answer" | "busy" | "invalid" | "voicemail"> = [
      "answered", "no_answer", "no_answer", "busy", "voicemail", "invalid",
    ];
    const status = outcomes[Math.floor(Math.random() * outcomes.length)];
    const duration = status === "answered" ? Math.floor(Math.random() * 300) + 30 : 0;

    const cost = getActionCost("ia_call");

    // Record the attempt
    lead.callAttempts.push({
      attemptNumber,
      phone,
      timestamp: new Date(),
      duration,
      status,
      window,
      scheduledRecall: status !== "answered" && attemptNumber < CallService.MAX_ATTEMPTS
        ? new Date(Date.now() + getRecallDelay(attemptNumber))
        : undefined,
    });
    lead.totalCallAttempts = attemptNumber;
    lead.lastCallAt = new Date();
    lead.totalCost += cost;

    lead.interactions.push({
      type: "call",
      channel: "ia_voice",
      message: `Tentativa ${attemptNumber}: ${status} (${phone}) - ${window}${template ? ` [Template: ${template.name}]` : ""}`,
      cost,
      timestamp: new Date(),
      details: { phone, status, duration, window, attemptNumber },
    });

    // Handle results
    if (status === "invalid") {
      lead.telefonesInvalidos.push(phone);
    }

    if (status === "answered") {
      if (lead.color === "laranja") {
        lead.color = "verde";
        lead.interacted = true;
        lead.interactedAt = new Date();
      }
      lead.nextCallAt = undefined;
    } else if (attemptNumber < CallService.MAX_ATTEMPTS) {
      lead.nextCallAt = new Date(Date.now() + getRecallDelay(attemptNumber));
    }

    await lead.save();
    logger.info(`Call to lead ${leadId}: attempt ${attemptNumber}, status=${status}, phone=${phone}`);

    return { success: status === "answered", status, lead };
  }
}
