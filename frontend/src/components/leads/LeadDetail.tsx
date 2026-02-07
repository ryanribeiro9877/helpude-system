import { useState } from "react";
import { X, Phone, Send, Mail, MessageSquare, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LEAD_COLORS, type Lead, type LeadColor } from "@/types";
import { formatCPF } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LeadTimeline } from "./LeadTimeline";

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onUpdateColor: (id: string, color: LeadColor, reason?: string) => void;
  onCall: (id: string) => void;
  onWhatsApp: (id: string) => void;
  onAddObservation: (id: string, text: string) => void;
}

const COLOR_OPTIONS: LeadColor[] = ["roxo", "azul", "verde", "vermelho", "laranja", "branco"];

export function LeadDetail({ lead, onClose, onUpdateColor, onCall, onWhatsApp, onAddObservation }: LeadDetailProps) {
  const [observation, setObservation] = useState("");
  const colorCfg = LEAD_COLORS[lead.color];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: colorCfg.hex + "40" }}>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{lead.nome}</h2>
              <p className="text-sm text-slate-500">{formatCPF(lead.cpf)} &middot; {lead.email || "Sem email"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: colorCfg.hex }}
              >
                {colorCfg.icon} {colorCfg.label}
              </span>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Blocked banner */}
            {lead.blocked && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">Lead bloqueado: {lead.blockReason}</span>
              </div>
            )}

            {/* Quick info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] uppercase text-slate-400">Lista</p>
                <p className="text-lg font-bold text-slate-800">{lead.list}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] uppercase text-slate-400">Ligações</p>
                <p className="text-lg font-bold text-slate-800">{lead.totalCallAttempts}/6</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] uppercase text-slate-400">Custo Total</p>
                <p className="text-lg font-bold text-green-600">R$ {lead.totalCost.toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-[10px] uppercase text-slate-400">Telefones</p>
                <p className="text-sm font-medium text-slate-800">{lead.telefones.join(", ") || "N/A"}</p>
              </div>
            </div>

            {/* Proposal */}
            {lead.proposalValue && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs text-purple-600">Proposta</p>
                <p className="text-xl font-bold text-purple-800">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(lead.proposalValue)}
                </p>
                <p className="text-xs text-purple-500">Status: {lead.proposalStatus || "N/A"}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => onCall(lead._id)} disabled={lead.blocked || lead.totalCallAttempts >= 6}>
                <Phone className="w-3.5 h-3.5 mr-1" /> Ligar IA
              </Button>
              <Button size="sm" variant="outline" onClick={() => onWhatsApp(lead._id)} disabled={lead.blocked || lead.color === "laranja"}>
                <Send className="w-3.5 h-3.5 mr-1" /> WhatsApp
              </Button>
              <Button size="sm" variant="outline" disabled={lead.blocked}>
                <Mail className="w-3.5 h-3.5 mr-1" /> Email
              </Button>
              <Button size="sm" variant="outline" disabled={lead.blocked}>
                <MessageSquare className="w-3.5 h-3.5 mr-1" /> RCS/SMS
              </Button>
            </div>

            {/* Color change */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Alterar cor:</p>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((c) => {
                  const cfg = LEAD_COLORS[c];
                  return (
                    <button
                      key={c}
                      onClick={() => onUpdateColor(lead._id, c)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-transform hover:scale-110 ${lead.color === c ? "border-slate-800 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: cfg.hex }}
                      title={cfg.label}
                    >
                      {lead.color === c && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Observation */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Nova observação:</p>
              <div className="flex gap-2">
                <Textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Escreva uma observação..."
                  className="text-sm h-16"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (observation.trim()) {
                      onAddObservation(lead._id, observation.trim());
                      setObservation("");
                    }
                  }}
                >
                  Salvar
                </Button>
              </div>
              {lead.observations.length > 0 && (
                <div className="mt-2 space-y-1">
                  {lead.observations.map((obs, i) => (
                    <p key={i} className="text-xs text-slate-500 bg-slate-50 rounded p-2">{obs}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Histórico de interações:</p>
              <LeadTimeline interactions={lead.interactions} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
