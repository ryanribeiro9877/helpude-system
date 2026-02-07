import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LEAD_COLORS, type LeadColor, type DashboardMetrics, type TimelineDataPoint } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsChartsProps {
  metrics: DashboardMetrics | null;
  timeline: TimelineDataPoint[];
}

export function StatsCharts({ metrics, timeline }: StatsChartsProps) {
  const pieData = metrics
    ? (Object.entries(metrics.colors) as [LeadColor, number][])
        .filter(([, count]) => count > 0)
        .map(([color, count]) => ({
          name: LEAD_COLORS[color].label,
          value: count,
          fill: LEAD_COLORS[color].hex,
        }))
    : [];

  const chartData = timeline.map((d) => ({
    date: d._id.slice(5),
    total: d.total,
    interacted: d.interacted,
    converted: d.converted,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Timeline chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Evolução (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="total" stroke="#f97316" fill="#f9731620" name="Leads" />
                <Area type="monotone" dataKey="interacted" stroke="#22c55e" fill="#22c55e20" name="Interações" />
                <Area type="monotone" dataKey="converted" stroke="#7b5fc7" fill="#7b5fc720" name="Convertidos" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center">Sem dados de timeline</p>
          )}
        </CardContent>
      </Card>

      {/* Color distribution pie */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Distribuição por Cor</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-xs text-slate-600">
                      {d.name}: <strong>{d.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center">Sem dados</p>
          )}
        </CardContent>
      </Card>

      {/* Cost summary */}
      {metrics && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Custos por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(metrics.costs.byChannel).length > 0 ? (
                Object.entries(metrics.costs.byChannel).map(([channel, cost]) => (
                  <div key={channel} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 capitalize">{channel}</span>
                    <span className="text-xs font-bold text-slate-800">R$ {cost.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">Sem custos registrados</p>
              )}
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Total</span>
                <span className="text-sm font-bold text-green-600">
                  R$ {metrics.costs.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* WhatsApp pool status */}
      {metrics && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">WhatsApp Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Conexões ativas</span>
                <span className="text-sm font-bold text-green-600">{metrics.whatsapp.activeConnections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Enviados hoje</span>
                <span className="text-sm font-bold text-slate-800">{metrics.whatsapp.totalSentToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">Capacidade diária</span>
                <span className="text-sm font-bold text-slate-800">{metrics.whatsapp.dailyCapacity}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${metrics.whatsapp.dailyCapacity > 0 ? (metrics.whatsapp.totalSentToday / metrics.whatsapp.dailyCapacity) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
