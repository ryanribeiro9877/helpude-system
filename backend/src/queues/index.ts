import { Queue } from "bullmq";
import { redis } from "../config/redis.js";

export const leadImportQueue = new Queue("lead-import", { connection: redis });
export const iaCallQueue = new Queue("ia-call", { connection: redis });
export const whatsappQueue = new Queue("whatsapp", { connection: redis });
export const rcsQueue = new Queue("rcs", { connection: redis });
export const smsQueue = new Queue("sms", { connection: redis });
export const emailQueue = new Queue("email", { connection: redis });
export const proposalCheckQueue = new Queue("proposal-check", { connection: redis });

export const ALL_QUEUES = {
  "lead-import": leadImportQueue,
  "ia-call": iaCallQueue,
  whatsapp: whatsappQueue,
  rcs: rcsQueue,
  sms: smsQueue,
  email: emailQueue,
  "proposal-check": proposalCheckQueue,
};
