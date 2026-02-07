import { Worker } from "bullmq";
import * as XLSX from "xlsx";
import { connectDatabase } from "./config/database.js";
import { redis } from "./config/redis.js";
import { ConsultaLote } from "./models/ConsultaLote.js";
import { Cliente } from "./models/Cliente.js";
import { User } from "./models/User.js";

async function start() {
  await connectDatabase();

  const worker = new Worker(
    "consultas",
    async (job) => {
      const { loteId, userId, fileBuffer, fileName } = job.data;
      console.log(`Processing lote ${loteId} - ${fileName}`);

      try {
        const buffer = Buffer.from(fileBuffer, "base64");
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const maxConsultas = user.consultasLimite - user.consultasUsadas;
        const registros = rows.slice(0, Math.min(rows.length, maxConsultas));

        let aprovados = 0;
        let rejeitados = 0;
        let pendentes = 0;

        for (const row of registros) {
          const creditStatus = Math.random() > 0.4 ? "approved" : "rejected";
          const creditoAprovado =
            creditStatus === "approved"
              ? Math.floor(Math.random() * 50000) + 5000
              : undefined;

          if (creditStatus === "approved") aprovados++;
          else rejeitados++;

          await Cliente.create({
            userId,
            nome: row.nome || row.name || "N/A",
            cpf: row.cpf || row.CPF || "N/A",
            telefone: row.telefone || row.phone || "",
            email: row.email || "",
            creditoAprovado,
            creditStatus,
            loteId,
          });
        }

        await User.findByIdAndUpdate(userId, {
          $inc: { consultasUsadas: registros.length },
        });

        await ConsultaLote.findByIdAndUpdate(loteId, {
          status: "completed",
          totalRegistros: registros.length,
          processedAt: new Date(),
          resultados: { aprovados, rejeitados, pendentes },
        });

        console.log(
          `Lote ${loteId} completed: ${aprovados} approved, ${rejeitados} rejected`
        );
      } catch (error) {
        console.error(`Error processing lote ${loteId}:`, error);
        await ConsultaLote.findByIdAndUpdate(loteId, { status: "error" });
        throw error;
      }
    },
    { connection: redis, concurrency: 3 }
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  console.log("Worker started, waiting for jobs...");
}

start();
