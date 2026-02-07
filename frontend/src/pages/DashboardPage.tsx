import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, DollarSign, Zap, Upload } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { StatsCharts } from "@/components/dashboard/StatsCharts";
import { ColorKanban } from "@/components/dashboard/ColorKanban";
import { LeadDetail } from "@/components/leads/LeadDetail";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import type { Lead, DashboardMetrics, TimelineDataPoint } from "@/types";

// Mock data for demo (replaces API calls when backend not available)
const MOCK_LEADS: Lead[] = [
  {
    _id: "1", nome: "Maria Silva", cpf: "12345678901", telefones: ["11999990001"], telefonesInvalidos: [],
    email: "maria@email.com", color: "roxo", list: "A", proposalValue: 15000, proposalStatus: "approved",
    callAttempts: [], totalCallAttempts: 3, rcsSent: true, smsSent: true, emailSent: true,
    linkClicked: true, interacted: true, totalCost: 1.45, observations: ["Cliente pagou via PIX"],
    blocked: false, interactions: [
      { type: "status_change", message: "Pagamento confirmado - ROXO", timestamp: new Date().toISOString() },
      { type: "call", message: "Tentativa 3: answered", cost: 0.35, timestamp: new Date(Date.now() - 86400000).toISOString() },
      { type: "whatsapp", message: "Template: Boas-vindas", cost: 0.08, timestamp: new Date(Date.now() - 172800000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 604800000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "2", nome: "João Santos", cpf: "98765432100", telefones: ["11999990002"], telefonesInvalidos: [],
    email: "joao@email.com", color: "azul", list: "A", proposalValue: 8500, proposalStatus: "pending",
    callAttempts: [], totalCallAttempts: 2, rcsSent: false, smsSent: true, emailSent: true,
    linkClicked: false, interacted: false, totalCost: 0.82, observations: ["Pendência documental"],
    blocked: false, interactions: [
      { type: "status_change", message: "Pendência identificada - AZUL", timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 432000000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "3", nome: "Ana Oliveira", cpf: "45678912300", telefones: ["11999990003"], telefonesInvalidos: [],
    email: "ana@email.com", color: "verde", list: "B",
    callAttempts: [], totalCallAttempts: 1, rcsSent: true, smsSent: false, emailSent: true,
    linkClicked: true, linkClickedAt: new Date().toISOString(), interacted: true, interactedAt: new Date().toISOString(),
    totalCost: 0.49, observations: [], blocked: false,
    interactions: [
      { type: "email", message: "Email enviado - Template: Oferta", cost: 0.02, timestamp: new Date().toISOString() },
      { type: "status_change", message: "Link clicado - VERDE", timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "4", nome: "Carlos Mendes", cpf: "32165498700", telefones: ["11999990004"], telefonesInvalidos: [],
    email: "carlos@email.com", color: "vermelho", list: "B",
    callAttempts: [], totalCallAttempts: 4, rcsSent: true, smsSent: true, emailSent: true,
    linkClicked: false, interacted: false, totalCost: 1.92, observations: ["Registrou reclamação no Procon"],
    blocked: true, blockReason: "Reclamação registrada",
    interactions: [
      { type: "status_change", message: "Reclamação - VERMELHO", timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 518400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "5", nome: "Fernanda Lima", cpf: "65498732100", telefones: ["11999990005"], telefonesInvalidos: [],
    email: "fernanda@email.com", color: "laranja", list: "A",
    callAttempts: [], totalCallAttempts: 0, rcsSent: false, smsSent: false, emailSent: false,
    linkClicked: false, interacted: false, totalCost: 0, observations: [], blocked: false,
    interactions: [
      { type: "status_change", message: "Lead importado", timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "6", nome: "Ricardo Alves", cpf: "78912345600", telefones: ["11999990006"], telefonesInvalidos: [],
    email: "ricardo@email.com", color: "laranja", list: "B",
    callAttempts: [], totalCallAttempts: 0, rcsSent: false, smsSent: false, emailSent: false,
    linkClicked: false, interacted: false, totalCost: 0, observations: [], blocked: false,
    interactions: [
      { type: "status_change", message: "Lead importado", timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 43200000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "7", nome: "Patricia Gomes", cpf: "15975348620", telefones: ["11999990007"], telefonesInvalidos: [],
    email: "patricia@email.com", color: "branco", list: "A", proposalStatus: "expired",
    callAttempts: [], totalCallAttempts: 6, rcsSent: true, smsSent: true, emailSent: true,
    linkClicked: false, interacted: false, totalCost: 2.1, observations: [], blocked: false,
    interactions: [
      { type: "status_change", message: "Proposta expirada - BRANCO", timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 864000000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "8", nome: "Lucas Ferreira", cpf: "35795148260", telefones: ["11999990008"], telefonesInvalidos: [],
    email: "lucas@email.com", color: "verde", list: "A", proposalValue: 12000,
    callAttempts: [], totalCallAttempts: 2, rcsSent: true, smsSent: false, emailSent: true,
    linkClicked: true, interacted: true, totalCost: 0.84, observations: [],
    blocked: false, whatsappLastSentAt: new Date().toISOString(),
    interactions: [
      { type: "whatsapp", message: "WhatsApp enviado via connection-3", cost: 0.08, timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 345600000).toISOString(), updatedAt: new Date().toISOString(),
  },
];

const MOCK_METRICS: DashboardMetrics = {
  totalLeads: 8,
  colors: { roxo: 1, azul: 1, verde: 2, vermelho: 1, laranja: 2, branco: 1 },
  costs: { totalCost: 7.62, byChannel: { call: 3.15, whatsapp: 0.96, rcs: 1.44, sms: 0.72, email: 0.24, link_generation: 0.11 } },
  taxaConversao: "12.5",
  taxaInteracao: "37.5",
  whatsapp: { activeConnections: 20, totalSentToday: 47, dailyCapacity: 500 },
};

const MOCK_TIMELINE: TimelineDataPoint[] = [
  { _id: "2026-01-08", total: 3, interacted: 1, converted: 0 },
  { _id: "2026-01-15", total: 5, interacted: 2, converted: 1 },
  { _id: "2026-01-22", total: 8, interacted: 3, converted: 1 },
  { _id: "2026-01-29", total: 12, interacted: 5, converted: 2 },
  { _id: "2026-02-05", total: 8, interacted: 3, converted: 1 },
];

export function DashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [metrics] = useState<DashboardMetrics>(MOCK_METRICS);
  const [timeline] = useState<TimelineDataPoint[]>(MOCK_TIMELINE);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleUpdateColor = (id: string, color: Lead["color"]) => {
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, color, previousColor: l.color } : l)));
    if (selectedLead?._id === id) setSelectedLead((prev) => prev ? { ...prev, color } : null);
  };

  const handleCall = (id: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, totalCallAttempts: l.totalCallAttempts + 1 } : l
      )
    );
  };

  const handleAddObservation = (id: string, text: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, observations: [...l.observations, text] } : l
      )
    );
    if (selectedLead?._id === id) {
      setSelectedLead((prev) => prev ? { ...prev, observations: [...prev.observations, text] } : null);
    }
  };

  // Sync selected lead when leads change
  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find((l) => l._id === selectedLead._id);
      if (updated) setSelectedLead(updated);
    }
  }, [leads]);

  return (
    <div className="space-y-6 animate-stagger">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Dashboard de Conversão
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Olá, {user?.name?.split(" ")[0]}! Acompanhe seus leads e métricas em tempo real.
          </p>
        </div>
        <Button variant="gradient" size="lg" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar Leads
        </Button>
      </motion.div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Leads"
          value={metrics.totalLeads}
          icon={Users}
          color="purple"
          delay={0.1}
        />
        <MetricCard
          title="Taxa de Interação"
          value={Number(metrics.taxaInteracao)}
          format="percentage"
          icon={Zap}
          color="teal"
          delay={0.2}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={Number(metrics.taxaConversao)}
          format="percentage"
          icon={TrendingUp}
          color="green"
          delay={0.3}
        />
        <MetricCard
          title="Custo Total"
          value={metrics.costs.totalCost}
          format="currency"
          icon={DollarSign}
          color="orange"
          delay={0.4}
        />
      </div>

      {/* Color Kanban */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-display font-bold text-foreground mb-3">
          Pipeline por Cor
        </h2>
        <ColorKanban leads={leads} onSelectLead={setSelectedLead} />
      </motion.div>

      {/* Charts & Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <StatsCharts metrics={metrics} timeline={timeline} />
      </motion.div>

      {/* Lead detail modal */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateColor={handleUpdateColor}
          onCall={handleCall}
          onWhatsApp={() => {}}
          onAddObservation={handleAddObservation}
        />
      )}
    </div>
  );
}
