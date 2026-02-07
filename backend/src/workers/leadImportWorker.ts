import { Worker } from "bullmq";
import * as XLSX from "xlsx";
import { redis } from "../config/redis.js";
import { LeadService } from "../services/LeadService.js";
import { logger } from "../config/logger.js";

export function createLeadImportWorker() {
  const worker = new Worker(
    "lead-import",
    async (job) => {
      const { fileBuffer, fileName, batchId } = job.data;
      logger.info(`Lead Import Worker processing ${fileName} (batch: ${batchId})`);

      const buffer = Buffer.from(fileBuffer, "base64");
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

      const data = rows.map((row) => ({
        nome: row.nome || row.name || row.Nome || "N/A",
        cpf: row.cpf || row.CPF || "N/A",
        telefones: [row.telefone || row.phone || row.Telefone || ""].filter(Boolean),
        email: row.email || row.Email || "",
        list: (row.lista || row.list || "B") as "A" | "B",
      }));

      const leads = await LeadService.importLeads(data, batchId);
      return { imported: leads.length, total: data.length };
    },
    { connection: redis, concurrency: 2 }
  );

  worker.on("completed", (job, result) => {
    logger.info(`Lead Import job ${job.id} completed: ${result.imported}/${result.total} imported`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Lead Import job ${job?.id} failed: ${err.message}`);
  });

  return worker;
}
