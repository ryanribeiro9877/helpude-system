import { motion } from "framer-motion";
import { LEAD_COLORS, type Lead, type LeadColor } from "@/types";
import { LeadCard } from "../leads/LeadCard";

interface ColorKanbanProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

const COLUMN_ORDER: LeadColor[] = ["roxo", "azul", "verde", "vermelho", "laranja", "branco"];

export function ColorKanban({ leads, onSelectLead }: ColorKanbanProps) {
  const grouped = COLUMN_ORDER.reduce((acc, color) => {
    acc[color] = leads.filter((l) => l.color === color);
    return acc;
  }, {} as Record<LeadColor, Lead[]>);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {COLUMN_ORDER.map((color, idx) => {
        const config = LEAD_COLORS[color];
        const columnLeads = grouped[color];

        return (
          <motion.div
            key={color}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex flex-col"
          >
            {/* Column header */}
            <div
              className="rounded-t-lg px-3 py-2 flex items-center justify-between"
              style={{ backgroundColor: config.hex + "20", borderTop: `3px solid ${config.hex}` }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{config.icon}</span>
                <span className="text-xs font-semibold uppercase" style={{ color: config.hex }}>
                  {config.label}
                </span>
              </div>
              <span
                className="text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                style={{ backgroundColor: config.hex, color: "#fff" }}
              >
                {columnLeads.length}
              </span>
            </div>

            {/* Cards */}
            <div className="bg-slate-50/50 rounded-b-lg p-2 space-y-2 min-h-[200px] max-h-[600px] overflow-y-auto">
              {columnLeads.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-8">Nenhum lead</p>
              )}
              {columnLeads.map((lead) => (
                <LeadCard key={lead._id} lead={lead} onClick={() => onSelectLead(lead)} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
