import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { MarketingService } from "../services/MarketingService.js";
import { logger } from "../config/logger.js";

export function createSmsWorker() {
  const worker = new Worker(
    "sms",
    async (job) => {
      const { leadId } = job.data;
      logger.info(`SMS Worker processing lead ${leadId}`);
      return MarketingService.sendSMS(leadId);
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on("completed", (job, result) => {
    logger.debug(`SMS job ${job.id} completed: success=${result.success}`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`SMS job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
