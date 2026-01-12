import { motion } from 'framer-motion';
import { 
  Search, 
  Users, 
  DollarSign, 
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  Upload
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { LevelProgress } from '@/components/dashboard/LevelProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import type { Product } from '@/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const products: Product[] = [
  {
    id: '1',
    name: 'Crédito para Assalariados',
    description: 'Crédito consignado para trabalhadores CLT com desconto em folha',
    publicoPotencial: 'Trabalhadores com carteira assinada',
    publicoNumero: 43,
    status: 'active',
    icon: '💼',
    color: 'teal',
  },
  {
    id: '2',
    name: 'Pagamento Recorrente',
    description: 'Cuide da saúde pagando no cartão de forma recorrente',
    publicoPotencial: 'Pessoas com cartão de crédito',
    publicoNumero: 95,
    status: 'coming_soon',
    icon: '💳',
    color: 'purple',
  },
  {
    id: '3',
    name: 'Crédito via Boleto',
    description: 'Crédito para pessoas sem restrição no nome',
    publicoPotencial: 'Pessoas sem restrição SPC/Serasa',
    publicoNumero: 120,
    status: 'coming_soon',
    icon: '📄',
    color: 'blue',
  },
];

const chartData = [
  { date: 'Jan', consultas: 12, aprovados: 8 },
  { date: 'Fev', consultas: 19, aprovados: 14 },
  { date: 'Mar', consultas: 25, aprovados: 18 },
  { date: 'Abr', consultas: 32, aprovados: 24 },
  { date: 'Mai', consultas: 45, aprovados: 35 },
  { date: 'Jun', consultas: 38, aprovados: 28 },
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-stagger">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Veja o resumo da sua clínica e acompanhe seus resultados
          </p>
        </div>
        <Button variant="gradient" size="lg" className="gap-2">
          <Upload className="h-4 w-4" />
          Subir Nova Base
        </Button>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Consultas"
          value={user?.consultasUsadas || 0}
          icon={Search}
          color="purple"
          trend={{ value: 12, isPositive: true }}
          delay={0.1}
        />
        <MetricCard
          title="Clientes Aprovados"
          value={34}
          icon={Users}
          color="teal"
          trend={{ value: 8, isPositive: true }}
          delay={0.2}
        />
        <MetricCard
          title="Crédito Total Aprovado"
          value={485000}
          format="currency"
          icon={DollarSign}
          color="green"
          trend={{ value: 23, isPositive: true }}
          delay={0.3}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={68}
          format="percentage"
          icon={TrendingUp}
          color="orange"
          trend={{ value: 5, isPositive: true }}
          delay={0.4}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Evolução de Consultas</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-helpude-purple-500" />
                    <span className="text-muted-foreground">Consultas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-helpude-teal-500" />
                    <span className="text-muted-foreground">Aprovados</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorConsultas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7b5fc7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7b5fc7" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAprovados" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="consultas"
                      stroke="#7b5fc7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorConsultas)"
                    />
                    <Area
                      type="monotone"
                      dataKey="aprovados"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAprovados)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-helpude-purple-100">
                    <Upload className="h-4 w-4 text-helpude-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Upload de Base</p>
                    <p className="text-xs text-muted-foreground">Até 50 registros</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Button>

              <Button variant="outline" className="w-full justify-between h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-helpude-teal-100">
                    <Users className="h-4 w-4 text-helpude-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Ver Pipeline</p>
                    <p className="text-xs text-muted-foreground">34 clientes aprovados</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Button>

              <Button variant="outline" className="w-full justify-between h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Configurar Marketing</p>
                    <p className="text-xs text-muted-foreground">RCS, Email, WhatsApp</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <LevelProgress />
      </motion.div>

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Produtos Disponíveis
            </h2>
            <p className="text-muted-foreground">
              Explore as opções de crédito para seus pacientes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={0.1 * index} />
          ))}
        </div>
      </div>
    </div>
  );
}
