import { Phone, Mail, MessageSquare, ArrowRightLeft, FileText } from "lucide-react";
import type { LeadInteraction } from "@/types";

const ICON_MAP: Record<string, React.ElementType> = {
  call: Phone,
  whatsapp: MessageSquare,
  rcs: MessageSquare,
  sms: MessageSquare,
  email: Mail,
  status_change: ArrowRightLeft,
  note: FileText,
};

const COLOR_MAP: Record<string, string> = {
  call: "text-teal-500 bg-teal-50",
  whatsapp: "text-green-500 bg-green-50",
  rcs: "text-purple-500 bg-purple-50",
  sms: "text-amber-500 bg-amber-50",
  email: "text-blue-500 bg-blue-50",
  status_change: "text-slate-500 bg-slate-50",
  note: "text-indigo-500 bg-indigo-50",
};

interface LeadTimelineProps {
  interactions: LeadInteraction[];
}

export function LeadTimeline({ interactions }: LeadTimelineProps) {
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sorted.length === 0) {
    return <p className="text-xs text-slate-400 py-4 text-center">Nenhuma interação registrada</p>;
  }

  return (
    <div className="relative space-y-3 pl-6">
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200" />

      {sorted.map((interaction, i) => {
        const Icon = ICON_MAP[interaction.type] || FileText;
        const colorClass = COLOR_MAP[interaction.type] || "text-slate-500 bg-slate-50";
        const date = new Date(interaction.timestamp);

        return (
          <div key={i} className="relative flex gap-3">
            <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ${colorClass}`}>
              <Icon className="w-3 h-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-700">{interaction.message}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-slate-400">
                  {date.toLocaleDateString("pt-BR")} {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                {interaction.cost != null && interaction.cost > 0 && (
                  <span className="text-[10px] text-green-600 font-medium">
                    R$ {interaction.cost.toFixed(2)}
                  </span>
                )}
                {interaction.channel && (
                  <span className="text-[10px] text-slate-400">{interaction.channel}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
