import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { MarketingService } from "../services/MarketingService.js";
import { logger } from "../config/logger.js";

export function createRcsWorker() {
  const worker = new Worker(
    "rcs",
    async (job) => {
      const { leadId } = job.data;
      logger.info(`RCS Worker processing lead ${leadId}`);
      return MarketingService.sendRCS(leadId);
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on("completed", (job, result) => {
    logger.debug(`RCS job ${job.id} completed: success=${result.success}`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`RCS job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
