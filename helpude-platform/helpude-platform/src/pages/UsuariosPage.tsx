import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Shield,
  ShieldCheck,
  Eye,
  Edit,
  Trash2,
  Mail,
  UserCheck,
  UserX
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn, getInitials } from '@/lib/utils';
import type { SubUser, Permission } from '@/types';

const mockUsers: SubUser[] = [
  {
    id: '1',
    name: 'Ana Carolina',
    email: 'ana@clinica.com',
    role: 'admin',
    permissions: ['view_dashboard', 'upload_base', 'view_clients', 'send_messages', 'manage_users', 'manage_marketing', 'view_reports', 'export_data'],
    createdAt: new Date('2024-01-10'),
    lastAccess: new Date(),
    active: true,
  },
  {
    id: '2',
    name: 'Carlos Eduardo',
    email: 'carlos@clinica.com',
    role: 'operator',
    permissions: ['view_dashboard', 'upload_base', 'view_clients', 'send_messages'],
    createdAt: new Date('2024-02-15'),
    lastAccess: new Date(),
    active: true,
  },
  {
    id: '3',
    name: 'Mariana Silva',
    email: 'mariana@clinica.com',
    role: 'viewer',
    permissions: ['view_dashboard', 'view_clients'],
    createdAt: new Date('2024-03-01'),
    lastAccess: new Date('2024-03-10'),
    active: false,
  },
];

const permissionLabels: Record<Permission, string> = {
  view_dashboard: 'Ver Dashboard',
  upload_base: 'Upload de Base',
  view_clients: 'Ver Clientes',
  send_messages: 'Enviar Mensagens',
  manage_users: 'Gerenciar Usuários',
  manage_marketing: 'Gerenciar Marketing',
  view_reports: 'Ver Relatórios',
  export_data: 'Exportar Dados',
};

const roleConfig = {
  admin: {
    label: 'Administrador',
    color: 'bg-helpude-purple-100 text-helpude-purple-700 border-helpude-purple-200',
    icon: ShieldCheck,
  },
  operator: {
    label: 'Operador',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Shield,
  },
  viewer: {
    label: 'Visualizador',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Eye,
  },
};

export function UsuariosPage() {
  const [users, setUsers] = useState<SubUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as SubUser['role'],
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    const user: SubUser = {
      id: Date.now().toString(),
      ...newUser,
      permissions: newUser.role === 'admin' 
        ? Object.keys(permissionLabels) as Permission[]
        : newUser.role === 'operator'
        ? ['view_dashboard', 'upload_base', 'view_clients', 'send_messages']
        : ['view_dashboard', 'view_clients'],
      createdAt: new Date(),
      active: true,
    };
    
    setUsers(prev => [...prev, user]);
    setIsAddModalOpen(false);
    setNewUser({ name: '', email: '', role: 'viewer' });
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, active: !user.active } : user
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Gerenciamento de Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
            Controle o acesso e permissões dos membros da sua equipe
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredUsers.map((user, index) => {
          const role = roleConfig[user.role];
          const RoleIcon = role.icon;

          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "border-0 shadow-sm transition-all",
                !user.active && "opacity-60"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={cn(
                        user.active 
                          ? "bg-gradient-to-br from-helpude-purple-400 to-helpude-teal-400" 
                          : "bg-gray-300"
                      )}>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{user.name}</p>
                        <Badge className={cn("gap-1", role.color)}>
                          <RoleIcon className="h-3 w-3" />
                          {role.label}
                        </Badge>
                        {!user.active && (
                          <Badge variant="outline" className="text-gray-500">
                            Inativo
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {user.permissions.slice(0, 4).map(perm => (
                          <span
                            key={perm}
                            className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                          >
                            {permissionLabels[perm]}
                          </span>
                        ))}
                        {user.permissions.length > 4 && (
                          <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                            +{user.permissions.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:block text-right">
                      <p className="text-xs text-muted-foreground">Último acesso</p>
                      <p className="text-sm font-medium">
                        {user.lastAccess?.toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleUserStatus(user.id)}
                        className={user.active ? "text-amber-600" : "text-green-600"}
                      >
                        {user.active ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {filteredUsers.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Nenhum usuário encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Convide um membro da equipe para acessar a plataforma
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                placeholder="Nome completo"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Função</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['admin', 'operator', 'viewer'] as const).map((role) => {
                  const config = roleConfig[role];
                  const Icon = config.icon;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setNewUser(prev => ({ ...prev, role }))}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all text-center",
                        newUser.role === role
                          ? "border-helpude-purple-500 bg-helpude-purple-50"
                          : "border-border hover:border-helpude-purple-200"
                      )}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddUser}>
              Enviar Convite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
