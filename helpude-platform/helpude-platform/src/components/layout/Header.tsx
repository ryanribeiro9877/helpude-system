import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Sparkles, ArrowUpRight, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/utils';

export function Header() {
  const { user, checkLevelUpgrade } = useAuth();
  const [notifications] = useState(3);
  const canUpgrade = checkLevelUpgrade();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-border sticky top-0 z-30 px-6">
      <div className="h-full flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Buscar clientes, consultas..."
            icon={<Search className="h-4 w-4" />}
            className="bg-muted/50"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Level Upgrade CTA */}
          {canUpgrade && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button variant="gradient" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Evoluir para Nível {(user?.level || 1) + 1}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Consultas Counter */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Consultas</p>
                <p className="text-sm font-semibold">
                  <span className="text-helpude-purple-600">{user.consultasUsadas}</span>
                  <span className="text-muted-foreground">/{user.consultasLimite}</span>
                </p>
              </div>
              <div className="w-16 h-2 bg-helpude-purple-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.consultasUsadas / user.consultasLimite) * 100}%` }}
                  className="h-full bg-gradient-to-r from-helpude-purple-500 to-helpude-teal-500 rounded-full"
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {notifications}
              </span>
            )}
          </Button>

          {/* User Menu */}
          {user && (
            <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.clinicName}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
