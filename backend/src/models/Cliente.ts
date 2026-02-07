import mongoose, { Schema, Document } from "mongoose";

export interface ICliente extends Document {
  userId: mongoose.Types.ObjectId;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  creditoAprovado?: number;
  creditStatus: "approved" | "rejected" | "pending" | "processing";
  pipelineStage: "approved" | "contacted" | "engaged" | "converted";
  consultedAt: Date;
  messagesSent: boolean;
  emailOpened: boolean;
  smsReceived: boolean;
  callReceived: boolean;
  whatsappSent: boolean;
  loteId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const clienteSchema = new Schema<ICliente>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nome: { type: String, required: true },
    cpf: { type: String, required: true },
    telefone: String,
    email: String,
    creditoAprovado: Number,
    creditStatus: {
      type: String,
      enum: ["approved", "rejected", "pending", "processing"],
      default: "pending",
    },
    pipelineStage: {
      type: String,
      enum: ["approved", "contacted", "engaged", "converted"],
      default: "approved",
    },
    consultedAt: { type: Date, default: Date.now },
    messagesSent: { type: Boolean, default: false },
    emailOpened: { type: Boolean, default: false },
    smsReceived: { type: Boolean, default: false },
    callReceived: { type: Boolean, default: false },
    whatsappSent: { type: Boolean, default: false },
    loteId: { type: Schema.Types.ObjectId, ref: "ConsultaLote" },
  },
  { timestamps: true }
);

clienteSchema.index({ userId: 1, cpf: 1 });
clienteSchema.index({ userId: 1, pipelineStage: 1 });

export const Cliente = mongoose.model<ICliente>("Cliente", clienteSchema);
