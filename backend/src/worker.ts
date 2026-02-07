import { connectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";
import { WhatsAppService } from "./services/WhatsAppService.js";
import { proposalCheckQueue } from "./queues/index.js";
import { createLeadImportWorker } from "./workers/leadImportWorker.js";
import { createIaCallWorker } from "./workers/iaCallWorker.js";
import { createWhatsappWorker } from "./workers/whatsappWorker.js";
import { createRcsWorker } from "./workers/rcsWorker.js";
import { createSmsWorker } from "./workers/smsWorker.js";
import { createEmailWorker } from "./workers/emailWorker.js";
import { createProposalCheckWorker } from "./workers/proposalCheckWorker.js";

async function start() {
  await connectDatabase();

  // Start all workers
  createLeadImportWorker();
  createIaCallWorker();
  createWhatsappWorker();
  createRcsWorker();
  createSmsWorker();
  createEmailWorker();
  createProposalCheckWorker();

  // Schedule recurring jobs
  // Proposal check every 30 minutes
  await proposalCheckQueue.add(
    "check",
    {},
    { repeat: { every: 30 * 60 * 1000 } }
  );

  // WhatsApp daily reset at midnight (check every hour)
  setInterval(async () => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() < 5) {
      await WhatsAppService.resetDailyCounts();
    }
  }, 60 * 60 * 1000);

  logger.info("All workers started (7 queues active)");
  logger.info("Queues: lead-import, ia-call, whatsapp, rcs, sms, email, proposal-check");
}

start();
