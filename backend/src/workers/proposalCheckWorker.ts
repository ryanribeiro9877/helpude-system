import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { LeadService } from "../services/LeadService.js";
import { logger } from "../config/logger.js";

export function createProposalCheckWorker() {
  const worker = new Worker(
    "proposal-check",
    async () => {
      logger.info("Proposal Check Worker running...");
      const expired = await LeadService.checkExpiredProposals();
      return { expiredCount: expired };
    },
    { connection: redis, concurrency: 1 }
  );

  worker.on("completed", (job, result) => {
    logger.debug(`Proposal Check job ${job.id} completed: ${result.expiredCount} expired`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Proposal Check job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
