// Tipos de Usuário e Autenticação
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

// Tipos de Produtos
export type ProductStatus = 'active' | 'coming_soon' | 'inactive';

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

// Tipos de Consultas e Clientes
export type CreditStatus = 'approved' | 'rejected' | 'pending' | 'processing';

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  creditoAprovado?: number;
  creditStatus: CreditStatus;
  consultedAt: Date;
  messagesSent?: boolean;
  emailOpened?: boolean;
  smsReceived?: boolean;
  callReceived?: boolean;
  whatsappSent?: boolean;
}

export interface ConsultaLote {
  id: string;
  fileName: string;
  uploadedAt: Date;
  totalRegistros: number;
  processedAt?: Date;
  status: 'processing' | 'completed' | 'error';
  resultados?: {
    aprovados: number;
    rejeitados: number;
    pendentes: number;
  };
}

// Tipos de Pipeline
export interface PipelineStage {
  id: string;
  name: string;
  count: number;
  color: string;
  icon: string;
}

// Tipos de Marketing
export interface MarketingConfig {
  rcs: {
    enabled: boolean;
    template: string;
    imageUrl?: string;
  };
  email: {
    enabled: boolean;
    subject: string;
    template: string;
  };
  voiceAI: {
    enabled: boolean;
    script: string;
    tone: 'formal' | 'friendly' | 'professional';
  };
  whatsapp: {
    connected: boolean;
    defaultMessage: string;
  };
}

// Tipos de Permissões
export type Permission = 
  | 'view_dashboard'
  | 'upload_base'
  | 'view_clients'
  | 'send_messages'
  | 'manage_users'
  | 'manage_marketing'
  | 'view_reports'
  | 'export_data';

export interface SubUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: Permission[];
  createdAt: Date;
  lastAccess?: Date;
  active: boolean;
}

// Tipos de Dashboard/Métricas
export interface DashboardMetrics {
  totalConsultas: number;
  consultasRestantes: number;
  creditoTotalAprovado: number;
  clientesAprovados: number;
  clientesContatados: number;
  taxaConversao: number;
  mediaCredito: number;
}

export interface ChartData {
  date: string;
  consultas: number;
  aprovados: number;
  conversoes: number;
}

// Tipos de Notificações
export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}
