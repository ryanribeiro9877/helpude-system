import mongoose, { Schema, Document } from "mongoose";

export type LeadColor = "roxo" | "azul" | "verde" | "vermelho" | "laranja" | "branco";
export type LeadList = "A" | "B";

export interface IInteraction {
  type: "call" | "whatsapp" | "rcs" | "sms" | "email" | "status_change" | "note";
  channel?: string;
  message?: string;
  cost?: number;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export interface ICallAttempt {
  attemptNumber: number;
  phone: string;
  timestamp: Date;
  duration?: number;
  status: "answered" | "no_answer" | "busy" | "invalid" | "voicemail";
  window: "morning" | "afternoon" | "evening";
  scheduledRecall?: Date;
}

export interface ILead extends Document {
  nome: string;
  cpf: string;
  telefones: string[];
  telefonesInvalidos: string[];
  email: string;
  color: LeadColor;
  previousColor?: LeadColor;
  list: LeadList;
  proposalValue?: number;
  proposalStatus?: "pending" | "approved" | "expired";
  proposalExpiresAt?: Date;

  // WhatsApp
  whatsappConnectionId?: mongoose.Types.ObjectId;
  whatsappLastSentAt?: Date;
  whatsappLinkId?: string;

  // Call tracking
  callAttempts: ICallAttempt[];
  totalCallAttempts: number;
  lastCallAt?: Date;
  nextCallAt?: Date;

  // Marketing tracking
  rcsSent: boolean;
  rcsClickedAt?: Date;
  smsSent: boolean;
  emailSent: boolean;
  emailOpenedAt?: Date;

  // Engagement
  linkClicked: boolean;
  linkClickedAt?: Date;
  interacted: boolean;
  interactedAt?: Date;

  // Cost tracking
  totalCost: number;

  // Observations & blocks
  observations: string[];
  blocked: boolean;
  blockReason?: string;

  // History
  interactions: IInteraction[];
  importBatchId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const interactionSchema = new Schema<IInteraction>(
  {
    type: { type: String, required: true },
    channel: String,
    message: String,
    cost: Number,
    timestamp: { type: Date, default: Date.now },
    details: Schema.Types.Mixed,
  },
  { _id: false }
);

const callAttemptSchema = new Schema<ICallAttempt>(
  {
    attemptNumber: { type: Number, required: true },
    phone: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    duration: Number,
    status: {
      type: String,
      enum: ["answered", "no_answer", "busy", "invalid", "voicemail"],
      required: true,
    },
    window: { type: String, enum: ["morning", "afternoon", "evening"], required: true },
    scheduledRecall: Date,
  },
  { _id: false }
);

const leadSchema = new Schema<ILead>(
  {
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    telefones: [String],
    telefonesInvalidos: [String],
    email: String,
    color: {
      type: String,
      enum: ["roxo", "azul", "verde", "vermelho", "laranja", "branco"],
      default: "laranja",
    },
    previousColor: String,
    list: { type: String, enum: ["A", "B"], default: "B" },
    proposalValue: Number,
    proposalStatus: { type: String, enum: ["pending", "approved", "expired"] },
    proposalExpiresAt: Date,

    whatsappConnectionId: { type: Schema.Types.ObjectId, ref: "WhatsAppConnection" },
    whatsappLastSentAt: Date,
    whatsappLinkId: String,

    callAttempts: [callAttemptSchema],
    totalCallAttempts: { type: Number, default: 0 },
    lastCallAt: Date,
    nextCallAt: Date,

    rcsSent: { type: Boolean, default: false },
    rcsClickedAt: Date,
    smsSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    emailOpenedAt: Date,

    linkClicked: { type: Boolean, default: false },
    linkClickedAt: Date,
    interacted: { type: Boolean, default: false },
    interactedAt: Date,

    totalCost: { type: Number, default: 0 },

    observations: [String],
    blocked: { type: Boolean, default: false },
    blockReason: String,

    interactions: [interactionSchema],
    importBatchId: String,
  },
  { timestamps: true }
);

leadSchema.index({ color: 1 });
leadSchema.index({ list: 1, color: 1 });
leadSchema.index({ cpf: 1 });
leadSchema.index({ nextCallAt: 1 });
leadSchema.index({ blocked: 1, color: 1 });

export const Lead = mongoose.model<ILead>("Lead", leadSchema);
