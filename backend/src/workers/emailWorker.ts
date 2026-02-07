import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { MarketingService } from "../services/MarketingService.js";
import { logger } from "../config/logger.js";

export function createEmailWorker() {
  const worker = new Worker(
    "email",
    async (job) => {
      const { leadId } = job.data;
      logger.info(`Email Worker processing lead ${leadId}`);
      return MarketingService.sendEmail(leadId);
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on("completed", (job, result) => {
    logger.debug(`Email job ${job.id} completed: success=${result.success}`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Email job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
