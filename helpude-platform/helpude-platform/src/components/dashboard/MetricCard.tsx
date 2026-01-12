import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  format?: 'number' | 'currency' | 'percentage';
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'purple' | 'teal' | 'blue' | 'green' | 'orange';
  delay?: number;
}

const colorClasses = {
  purple: {
    bg: 'bg-helpude-purple-100',
    icon: 'text-helpude-purple-600',
    gradient: 'from-helpude-purple-500 to-helpude-purple-600',
  },
  teal: {
    bg: 'bg-helpude-teal-100',
    icon: 'text-helpude-teal-600',
    gradient: 'from-helpude-teal-500 to-helpude-teal-600',
  },
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    gradient: 'from-green-500 to-green-600',
  },
  orange: {
    bg: 'bg-orange-100',
    icon: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600',
  },
};

export function MetricCard({ 
  title, 
  value, 
  format = 'number', 
  icon: Icon, 
  trend,
  color = 'purple',
  delay = 0 
}: MetricCardProps) {
  const formattedValue = format === 'currency' 
    ? formatCurrency(value)
    : format === 'percentage'
    ? `${value}%`
    : formatNumber(value);

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="p-6 card-hover border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.p 
              className="text-3xl font-display font-bold text-foreground"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.2 }}
            >
              {formattedValue}
            </motion.p>
            
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-500"
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
                <span className="text-muted-foreground font-normal">vs mês anterior</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-xl",
            colors.bg
          )}>
            <Icon className={cn("h-6 w-6", colors.icon)} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
