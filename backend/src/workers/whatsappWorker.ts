import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { WhatsAppService } from "../services/WhatsAppService.js";
import { logger } from "../config/logger.js";

export function createWhatsappWorker() {
  const worker = new Worker(
    "whatsapp",
    async (job) => {
      const { leadId } = job.data;
      logger.info(`WhatsApp Worker processing lead ${leadId}`);
      const result = await WhatsAppService.sendMessage(leadId);
      return result;
    },
    { connection: redis, concurrency: 3 }
  );

  worker.on("completed", (job, result) => {
    logger.debug(`WhatsApp job ${job.id} completed: success=${result.success}`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`WhatsApp job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
