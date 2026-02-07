import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  cnpj: string;
  clinicName: string;
  level: 1 | 2 | 3;
  consultasUsadas: number;
  consultasLimite: number;
  phone?: string;
  whatsappConnected: boolean;
  approvedAt?: Date;
  level3ApprovedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    clinicName: { type: String, required: true },
    level: { type: Number, enum: [1, 2, 3], default: 1 },
    consultasUsadas: { type: Number, default: 0 },
    consultasLimite: { type: Number, default: 50 },
    phone: String,
    whatsappConnected: { type: Boolean, default: false },
    approvedAt: Date,
    level3ApprovedAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
