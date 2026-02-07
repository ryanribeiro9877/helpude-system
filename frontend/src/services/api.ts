import type { Lead, LeadColor, DashboardMetrics, TimelineDataPoint } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// Leads
export async function fetchLeads(params?: {
  color?: LeadColor;
  search?: string;
  page?: number;
}): Promise<{ leads: Lead[]; total: number; page: number; pages: number }> {
  const qs = new URLSearchParams();
  if (params?.color) qs.set("color", params.color);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  return request(`/api/leads?${qs}`);
}

export async function fetchLead(id: string): Promise<Lead> {
  return request(`/api/leads/${id}`);
}

export async function updateLeadColor(id: string, color: LeadColor, reason?: string): Promise<Lead> {
  return request(`/api/leads/${id}/color`, {
    method: "PATCH",
    body: JSON.stringify({ color, reason }),
  });
}

export async function addObservation(id: string, text: string): Promise<Lead> {
  return request(`/api/leads/${id}/observation`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function triggerCall(id: string): Promise<{ queued: boolean }> {
  return request(`/api/leads/${id}/call`, { method: "POST" });
}

export async function triggerWhatsApp(id: string): Promise<{ queued: boolean }> {
  return request(`/api/leads/${id}/whatsapp`, { method: "POST" });
}

export async function batchAction(leadIds: string[], action: string): Promise<{ queued: number }> {
  return request("/api/leads/batch-action", {
    method: "POST",
    body: JSON.stringify({ leadIds, action }),
  });
}

export async function importFile(file: File): Promise<{ batchId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/api/leads/import`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error("Erro ao importar");
  return res.json();
}

// Dashboard
export async function fetchMetrics(): Promise<DashboardMetrics> {
  return request("/api/dashboard/metrics");
}

export async function fetchTimeline(): Promise<TimelineDataPoint[]> {
  return request("/api/dashboard/timeline");
}

// Auth
export async function login(email: string, password: string): Promise<{ token: string; user: unknown }> {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(data: Record<string, string>): Promise<{ token: string; user: unknown }> {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
