import { motion } from 'framer-motion';
import { Check, Lock, Sparkles, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const levels = [
  {
    level: 1,
    name: 'Acesso Inicial',
    description: 'Até 50 consultas, sem crédito na conta',
    benefits: [
      'Cadastro automático com CNPJ ativo',
      'Upload de base de clientes',
      'Ver resultados das simulações',
      'Ambiente padrão da plataforma',
    ],
    requirements: 'CNPJ ativo',
    icon: '🚀',
  },
  {
    level: 2,
    name: 'Cadastro Aprovado',
    description: 'Consultas ilimitadas, crédito na conta da clínica',
    benefits: [
      'Consultas acima de 50',
      'Crédito cai na conta da clínica',
      'Maior volume de operações',
      'Suporte prioritário',
    ],
    requirements: 'Análise de cadastro aprovada',
    icon: '⭐',
  },
  {
    level: 3,
    name: 'Análise Plena',
    description: 'Parceiro estratégico, benefícios máximos',
    benefits: [
      'Consultas ilimitadas',
      'Crédito direto na conta',
      'Tratamento como parceiro',
      'Taxas diferenciadas',
    ],
    requirements: '90 dias de histórico positivo',
    icon: '👑',
  },
];

export function LevelProgress() {
  const { user, checkLevelUpgrade } = useAuth();
  const currentLevel = user?.level || 1;
  const canUpgrade = checkLevelUpgrade();

  const getDaysUntilLevel3 = () => {
    if (!user?.approvedAt) return 90;
    const daysSince = Math.floor(
      (Date.now() - new Date(user.approvedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, 90 - daysSince);
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-helpude-purple-600 to-helpude-teal-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Sua Jornada HelpUde
        </CardTitle>
        <p className="text-white/80 text-sm mt-1">
          Evolua seu cadastro e desbloqueie mais benefícios
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {levels.map((level) => (
              <div
                key={level.level}
                className={cn(
                  "flex flex-col items-center",
                  level.level <= currentLevel ? "text-helpude-purple-600" : "text-gray-400"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all",
                    level.level < currentLevel && "bg-helpude-purple-600 border-helpude-purple-600 text-white",
                    level.level === currentLevel && "bg-helpude-purple-100 border-helpude-purple-600 text-helpude-purple-600",
                    level.level > currentLevel && "bg-gray-100 border-gray-300 text-gray-400"
                  )}
                >
                  {level.level < currentLevel ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    level.level
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{level.name}</span>
              </div>
            ))}
          </div>
          <Progress 
            value={((currentLevel - 1) / 2) * 100} 
            className="h-2"
          />
        </div>

        {/* Level Cards */}
        <div className="space-y-4">
          {levels.map((level, index) => {
            const isUnlocked = level.level <= currentLevel;
            const isCurrent = level.level === currentLevel;
            const isNext = level.level === currentLevel + 1;

            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all",
                  isCurrent && "border-helpude-purple-400 bg-helpude-purple-50 shadow-lg",
                  isUnlocked && !isCurrent && "border-green-200 bg-green-50/50",
                  !isUnlocked && "border-gray-200 bg-gray-50 opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{level.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "font-semibold",
                          isCurrent && "text-helpude-purple-700"
                        )}>
                          Nível {level.level} - {level.name}
                        </h4>
                        {isCurrent && (
                          <Badge variant="level2">Atual</Badge>
                        )}
                        {isUnlocked && !isCurrent && (
                          <Badge variant="success">
                            <Check className="h-3 w-3 mr-1" />
                            Desbloqueado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {level.description}
                      </p>
                      
                      {/* Benefits */}
                      <ul className="mt-3 space-y-1">
                        {level.benefits.map((benefit, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <Check className={cn(
                              "h-4 w-4",
                              isUnlocked ? "text-green-500" : "text-gray-300"
                            )} />
                            <span className={cn(
                              !isUnlocked && "text-gray-400"
                            )}>
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    {!isUnlocked && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                    {isNext && canUpgrade && (
                      <Button size="sm" variant="gradient">
                        Solicitar Upgrade
                      </Button>
                    )}
                    {isNext && !canUpgrade && currentLevel === 2 && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-amber-600 text-sm">
                          <Clock className="h-4 w-4" />
                          {getDaysUntilLevel3()} dias
                        </div>
                        <span className="text-xs text-muted-foreground">
                          para elegibilidade
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
