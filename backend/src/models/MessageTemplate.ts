import mongoose, { Schema, Document } from "mongoose";

export interface IMessageTemplate extends Document {
  channel: "whatsapp" | "rcs" | "sms" | "email" | "voice";
  name: string;
  content: string;
  subject?: string;
  variables: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageTemplateSchema = new Schema<IMessageTemplate>(
  {
    channel: {
      type: String,
      enum: ["whatsapp", "rcs", "sms", "email", "voice"],
      required: true,
    },
    name: { type: String, required: true },
    content: { type: String, required: true },
    subject: String,
    variables: [String],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

messageTemplateSchema.index({ channel: 1, active: 1 });

export const MessageTemplate = mongoose.model<IMessageTemplate>(
  "MessageTemplate",
  messageTemplateSchema
);
