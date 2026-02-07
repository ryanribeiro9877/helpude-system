import { Phone, Mail, MessageSquare, DollarSign } from "lucide-react";
import { LEAD_COLORS, type Lead } from "@/types";
import { formatCPF } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const colorCfg = LEAD_COLORS[lead.color];

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-lg p-3 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-medium text-slate-800 truncate">{lead.nome}</p>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: colorCfg.hex + "20", color: colorCfg.hex }}>
          {lead.list}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mb-2">{formatCPF(lead.cpf)}</p>

      {lead.proposalValue && (
        <div className="flex items-center gap-1 mb-2">
          <DollarSign className="w-3 h-3 text-green-500" />
          <span className="text-xs font-semibold text-green-600">
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(lead.proposalValue)}
          </span>
        </div>
      )}

      {/* Channel indicators */}
      <div className="flex items-center gap-1.5">
        {lead.totalCallAttempts > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
            <Phone className="w-3 h-3" /> {lead.totalCallAttempts}/6
          </span>
        )}
        {lead.emailSent && <Mail className="w-3 h-3 text-blue-400" />}
        {lead.smsSent && <MessageSquare className="w-3 h-3 text-amber-400" />}
        {lead.rcsSent && <MessageSquare className="w-3 h-3 text-purple-400" />}
        {lead.whatsappLastSentAt && (
          <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
        )}
      </div>

      {lead.totalCost > 0 && (
        <p className="text-[10px] text-slate-400 mt-1.5">
          Custo: R$ {lead.totalCost.toFixed(2)}
        </p>
      )}
    </button>
  );
}
