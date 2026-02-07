import mongoose, { Schema, Document } from "mongoose";

export interface IWhatsAppConnection extends Document {
  connectionNumber: number;
  phone: string;
  status: "active" | "inactive" | "banned" | "cooldown";
  dailyMessagesSent: number;
  dailyLimit: number;
  totalMessagesSent: number;
  assignedLeads: mongoose.Types.ObjectId[];
  lastMessageAt?: Date;
  lastResetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const whatsappConnectionSchema = new Schema<IWhatsAppConnection>(
  {
    connectionNumber: { type: Number, required: true, unique: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "banned", "cooldown"],
      default: "active",
    },
    dailyMessagesSent: { type: Number, default: 0 },
    dailyLimit: { type: Number, default: 25 },
    totalMessagesSent: { type: Number, default: 0 },
    assignedLeads: [{ type: Schema.Types.ObjectId, ref: "Lead" }],
    lastMessageAt: Date,
    lastResetAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

whatsappConnectionSchema.index({ status: 1, dailyMessagesSent: 1 });

export const WhatsAppConnection = mongoose.model<IWhatsAppConnection>(
  "WhatsAppConnection",
  whatsappConnectionSchema
);
