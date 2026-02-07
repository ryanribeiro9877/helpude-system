import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorKanban } from "@/components/dashboard/ColorKanban";
import { LeadDetail } from "@/components/leads/LeadDetail";
import { LEAD_COLORS, type Lead, type LeadColor } from "@/types";

// Reuse mock data for now
const MOCK_LEADS: Lead[] = [
  {
    _id: "p1", nome: "Maria Silva", cpf: "12345678901", telefones: ["11999990001"], telefonesInvalidos: [],
    email: "maria@email.com", color: "roxo", list: "A", proposalValue: 15000, proposalStatus: "approved",
    callAttempts: [], totalCallAttempts: 3, rcsSent: true, smsSent: true, emailSent: true,
    linkClicked: true, interacted: true, totalCost: 1.45, observations: ["Cliente pagou via PIX"],
    blocked: false, interactions: [
      { type: "status_change", message: "Pagamento confirmado - ROXO", timestamp: new Date().toISOString() },
    ],
    createdAt: new Date(Date.now() - 604800000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "p2", nome: "João Santos", cpf: "98765432100", telefones: ["11999990002"], telefonesInvalidos: [],
    email: "joao@email.com", color: "azul", list: "A", proposalValue: 8500, proposalStatus: "pending",
    callAttempts: [], totalCallAttempts: 2, rcsSent: false, smsSent: true, emailSent: true,
    linkClicked: false, interacted: false, totalCost: 0.82, observations: ["Pendência documental"],
    blocked: false, interactions: [], createdAt: new Date(Date.now() - 432000000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "p3", nome: "Ana Oliveira", cpf: "45678912300", telefones: ["11999990003"], telefonesInvalidos: [],
    email: "ana@email.com", color: "verde", list: "B",
    callAttempts: [], totalCallAttempts: 1, rcsSent: true, smsSent: false, emailSent: true,
    linkClicked: true, interacted: true, totalCost: 0.49, observations: [], blocked: false,
    interactions: [], createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "p4", nome: "Carlos Mendes", cpf: "32165498700", telefones: ["11999990004"], telefonesInvalidos: [],
    email: "carlos@email.com", color: "vermelho", list: "B",
    callAttempts: [], totalCallAttempts: 4, rcsSent: true, smsSent: true, emailSent: true,
    linkClicked: false, interacted: false, totalCost: 1.92, observations: ["Reclamação no Procon"],
    blocked: true, blockReason: "Reclamação registrada",
    interactions: [], createdAt: new Date(Date.now() - 518400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "p5", nome: "Fernanda Lima", cpf: "65498732100", telefones: ["11999990005"], telefonesInvalidos: [],
    email: "fernanda@email.com", color: "laranja", list: "A",
    callAttempts: [], totalCallAttempts: 0, rcsSent: false, smsSent: false, emailSent: false,
    linkClicked: false, interacted: false, totalCost: 0, observations: [], blocked: false,
    interactions: [], createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "p6", nome: "Ricardo Alves", cpf: "78912345600", telefones: ["11999990006"], telefonesInvalidos: [],
    email: "ricardo@email.com", color: "laranja", list: "B",
    callAttempts: [], totalCallAttempts: 0, rcsSent: false, smsSent: false, emailSent: false,
    linkClicked: false, interacted: false, totalCost: 0, observations: [], blocked: false,
    interactions: [], createdAt: new Date(Date.now() - 43200000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "p7", nome: "Patricia Gomes", cpf: "15975348620", telefones: ["11999990007"], telefonesInvalidos: [],
    email: "patricia@email.com", color: "branco", list: "A", proposalStatus: "expired",
    callAttempts: [], totalCallAttempts: 6, rcsSent: true, smsSent: true, emailSent: true,
    linkClicked: false, interacted: false, totalCost: 2.1, observations: [], blocked: false,
    interactions: [], createdAt: new Date(Date.now() - 864000000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: "p8", nome: "Lucas Ferreira", cpf: "35795148260", telefones: ["11999990008"], telefonesInvalidos: [],
    email: "lucas@email.com", color: "verde", list: "A", proposalValue: 12000,
    callAttempts: [], totalCallAttempts: 2, rcsSent: true, smsSent: false, emailSent: true,
    linkClicked: true, interacted: true, totalCost: 0.84, observations: [],
    blocked: false, whatsappLastSentAt: new Date().toISOString(),
    interactions: [], createdAt: new Date(Date.now() - 345600000).toISOString(), updatedAt: new Date().toISOString(),
  },
];

const COLOR_FILTERS: LeadColor[] = ["roxo", "azul", "verde", "vermelho", "laranja", "branco"];

export function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [colorFilter, setColorFilter] = useState<LeadColor | null>(null);

  const filteredLeads = leads.filter((l) => {
    if (colorFilter && l.color !== colorFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.nome.toLowerCase().includes(q) || l.cpf.includes(q);
    }
    return true;
  });

  const handleUpdateColor = (id: string, color: LeadColor) => {
    setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, color, previousColor: l.color } : l)));
    if (selectedLead?._id === id) setSelectedLead((prev) => prev ? { ...prev, color } : null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">Pipeline de Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize e gerencie seus leads por status de cor
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <div className="flex items-center gap-1">
          <Filter className="w-4 h-4 text-slate-400 mr-1" />
          <Button
            size="sm"
            variant={colorFilter === null ? "default" : "outline"}
            onClick={() => setColorFilter(null)}
          >
            Todos
          </Button>
          {COLOR_FILTERS.map((c) => {
            const cfg = LEAD_COLORS[c];
            return (
              <Button
                key={c}
                size="sm"
                variant={colorFilter === c ? "default" : "outline"}
                onClick={() => setColorFilter(colorFilter === c ? null : c)}
                style={colorFilter === c ? { backgroundColor: cfg.hex, borderColor: cfg.hex } : {}}
              >
                {cfg.icon} {cfg.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Kanban */}
      <ColorKanban leads={filteredLeads} onSelectLead={setSelectedLead} />

      {/* Lead detail */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdateColor={handleUpdateColor}
          onCall={() => {}}
          onWhatsApp={() => {}}
          onAddObservation={(id, text) => {
            setLeads((prev) =>
              prev.map((l) =>
                l._id === id ? { ...l, observations: [...l.observations, text] } : l
              )
            );
          }}
        />
      )}
    </div>
  );
}
