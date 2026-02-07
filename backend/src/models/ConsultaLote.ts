import mongoose, { Schema, Document } from "mongoose";

export interface IConsultaLote extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  totalRegistros: number;
  status: "processing" | "completed" | "error";
  resultados?: {
    aprovados: number;
    rejeitados: number;
    pendentes: number;
  };
  uploadedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const consultaLoteSchema = new Schema<IConsultaLote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    totalRegistros: { type: Number, required: true },
    status: {
      type: String,
      enum: ["processing", "completed", "error"],
      default: "processing",
    },
    resultados: {
      aprovados: Number,
      rejeitados: Number,
      pendentes: Number,
    },
    uploadedAt: { type: Date, default: Date.now },
    processedAt: Date,
  },
  { timestamps: true }
);

export const ConsultaLote = mongoose.model<IConsultaLote>(
  "ConsultaLote",
  consultaLoteSchema
);
