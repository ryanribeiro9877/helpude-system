import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { CallService } from "../services/CallService.js";
import { logger } from "../config/logger.js";

export function createIaCallWorker() {
  const worker = new Worker(
    "ia-call",
    async (job) => {
      const { leadId } = job.data;
      logger.info(`IA Call Worker processing lead ${leadId}`);
      const result = await CallService.processCall(leadId);
      return result;
    },
    { connection: redis, concurrency: 5 }
  );

  worker.on("completed", (job, result) => {
    logger.debug(`IA Call job ${job.id} completed: ${result.status}`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`IA Call job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
