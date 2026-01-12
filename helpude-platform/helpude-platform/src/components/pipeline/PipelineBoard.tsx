import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Phone, 
  Eye,
  Send,
  MoreHorizontal,
  User,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency, formatCPF } from '@/lib/utils';
import type { Cliente } from '@/types';

interface PipelineColumn {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  clients: Cliente[];
}

// Mock data
const mockClientes: Cliente[] = [
  { id: '1', nome: 'Maria Silva', cpf: '12345678901', telefone: '11999998888', email: 'maria@email.com', creditoAprovado: 15000, creditStatus: 'approved', consultedAt: new Date(), messagesSent: true, emailOpened: true, smsReceived: true, callReceived: false },
  { id: '2', nome: 'João Santos', cpf: '98765432101', telefone: '11988887777', email: 'joao@email.com', creditoAprovado: 8500, creditStatus: 'approved', consultedAt: new Date(), messagesSent: true, emailOpened: false, smsReceived: true, callReceived: true },
  { id: '3', nome: 'Ana Costa', cpf: '45678912301', telefone: '11977776666', email: 'ana@email.com', creditoAprovado: 22000, creditStatus: 'approved', consultedAt: new Date(), messagesSent: false },
  { id: '4', nome: 'Carlos Oliveira', cpf: '32165498701', telefone: '11966665555', email: 'carlos@email.com', creditoAprovado: 12000, creditStatus: 'approved', consultedAt: new Date(), messagesSent: true, emailOpened: true, smsReceived: true, callReceived: true, whatsappSent: true },
];

export function PipelineBoard() {
  const columns: PipelineColumn[] = [
    {
      id: 'approved',
      title: 'Crédito Aprovado',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      clients: mockClientes.filter(c => c.creditStatus === 'approved' && !c.messagesSent),
    },
    {
      id: 'contacted',
      title: 'Mensagem Enviada',
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      clients: mockClientes.filter(c => c.messagesSent && !c.emailOpened && !c.smsReceived),
    },
    {
      id: 'engaged',
      title: 'Engajamento',
      icon: Eye,
      color: 'text-helpude-purple-600',
      bgColor: 'bg-helpude-purple-100',
      clients: mockClientes.filter(c => c.emailOpened || c.smsReceived || c.callReceived),
    },
    {
      id: 'converted',
      title: 'Convertidos',
      icon: DollarSign,
      color: 'text-helpude-teal-600',
      bgColor: 'bg-helpude-teal-100',
      clients: mockClientes.filter(c => c.whatsappSent),
    },
  ];

  const handleWhatsAppClick = (client: Cliente) => {
    const message = encodeURIComponent(
      `Olá ${client.nome.split(' ')[0]}! Temos uma ótima notícia: você foi pré-aprovado para um crédito de ${formatCurrency(client.creditoAprovado || 0)}. Gostaria de saber mais?`
    );
    const phone = client.telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Pipeline de Clientes</h2>
          <p className="text-muted-foreground">Acompanhe o status dos seus clientes aprovados</p>
        </div>
        <Button variant="outline">
          Exportar Relatório
        </Button>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1 }}
          >
            <Card className="h-full border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-lg", column.bgColor)}>
                      <column.icon className={cn("h-4 w-4", column.color)} />
                    </div>
                    <CardTitle className="text-base font-semibold">
                      {column.title}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="font-bold">
                    {column.clients.length}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                <AnimatePresence>
                  {column.clients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white rounded-xl border border-border hover:border-helpude-purple-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-helpude-purple-400 to-helpude-teal-400 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{client.nome}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatCPF(client.cpf)}
                            </p>
                          </div>
                        </div>
                        <button className="p-1 hover:bg-muted rounded">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Crédito Aprovado */}
                      {client.creditoAprovado && (
                        <div className="mb-3 p-2 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-600 font-medium">Crédito Aprovado</p>
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(client.creditoAprovado)}
                          </p>
                        </div>
                      )}

                      {/* Engagement Icons */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className={cn(
                          "p-1.5 rounded",
                          client.emailOpened ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        )}>
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        <div className={cn(
                          "p-1.5 rounded",
                          client.smsReceived ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        )}>
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                        <div className={cn(
                          "p-1.5 rounded",
                          client.callReceived ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        )}>
                          <Phone className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* WhatsApp Action */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppClick(client);
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chamar no WhatsApp
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {column.clients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Nenhum cliente nesta etapa</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
