// Lead Colors
export type LeadColor = "roxo" | "azul" | "verde" | "vermelho" | "laranja" | "branco";

export const LEAD_COLORS: Record<LeadColor, { label: string; hex: string; bg: string; text: string; icon: string }> = {
  roxo: { label: "Pago", hex: "#7b5fc7", bg: "bg-purple-100", text: "text-purple-700", icon: "💜" },
  azul: { label: "Pendência", hex: "#3b82f6", bg: "bg-blue-100", text: "text-blue-700", icon: "💙" },
  verde: { label: "Interagiu", hex: "#22c55e", bg: "bg-green-100", text: "text-green-700", icon: "💚" },
  vermelho: { label: "Reclamação", hex: "#ef4444", bg: "bg-red-100", text: "text-red-700", icon: "❤️" },
  laranja: { label: "Sem interação", hex: "#f97316", bg: "bg-orange-100", text: "text-orange-700", icon: "🧡" },
  branco: { label: "Expirada", hex: "#94a3b8", bg: "bg-slate-100", text: "text-slate-500", icon: "🤍" },
};

// Lead
export interface LeadInteraction {
  type: "call" | "whatsapp" | "rcs" | "sms" | "email" | "status_change" | "note";
  channel?: string;
  message?: string;
  cost?: number;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface CallAttempt {
  attemptNumber: number;
  phone: string;
  timestamp: string;
  duration?: number;
  status: "answered" | "no_answer" | "busy" | "invalid" | "voicemail";
  window: "morning" | "afternoon" | "evening";
  scheduledRecall?: string;
}

export interface Lead {
  _id: string;
  nome: string;
  cpf: string;
  telefones: string[];
  telefonesInvalidos: string[];
  email: string;
  color: LeadColor;
  previousColor?: LeadColor;
  list: "A" | "B";
  proposalValue?: number;
  proposalStatus?: "pending" | "approved" | "expired";
  proposalExpiresAt?: string;
  whatsappConnectionId?: string;
  whatsappLastSentAt?: string;
  whatsappLinkId?: string;
  callAttempts: CallAttempt[];
  totalCallAttempts: number;
  lastCallAt?: string;
  nextCallAt?: string;
  rcsSent: boolean;
  rcsClickedAt?: string;
  smsSent: boolean;
  emailSent: boolean;
  emailOpenedAt?: string;
  linkClicked: boolean;
  linkClickedAt?: string;
  interacted: boolean;
  interactedAt?: string;
  totalCost: number;
  observations: string[];
  blocked: boolean;
  blockReason?: string;
  interactions: LeadInteraction[];
  importBatchId?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalLeads: number;
  colors: Record<LeadColor, number>;
  costs: {
    totalCost: number;
    byChannel: Record<string, number>;
  };
  taxaConversao: string;
  taxaInteracao: string;
  whatsapp: {
    activeConnections: number;
    totalSentToday: number;
    dailyCapacity: number;
  };
}

export interface TimelineDataPoint {
  _id: string;
  total: number;
  interacted: number;
  converted: number;
}

// User & Auth
export type UserLevel = 1 | 2 | 3;

export interface User {
  id: string;
  email: string;
  name: string;
  cnpj: string;
  clinicName: string;
  level: UserLevel;
  consultasUsadas: number;
  consultasLimite: number;
  createdAt: Date;
  approvedAt?: Date;
  level3ApprovedAt?: Date;
  avatar?: string;
  phone?: string;
  whatsappConnected?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Products
export type ProductStatus = "active" | "coming_soon" | "inactive";

export interface Product {
  id: string;
  name: string;
  description: string;
  publicoPotencial: string;
  publicoNumero: number;
  status: ProductStatus;
  icon: string;
  color: string;
}

// Permissions
export type Permission =
  | "view_dashboard"
  | "upload_base"
  | "view_clients"
  | "send_messages"
  | "manage_users"
  | "manage_marketing"
  | "view_reports"
  | "export_data";

export interface SubUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  permissions: Permission[];
  createdAt: Date;
  lastAccess?: Date;
  active: boolean;
}

// Notifications
export interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}
