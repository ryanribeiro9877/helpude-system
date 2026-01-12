import { motion } from 'framer-motion';
import { Check, Clock, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn, formatNumber } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  delay?: number;
}

export function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const isActive = product.status === 'active';
  const isComingSoon = product.status === 'coming_soon';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn(
        "relative overflow-hidden card-hover border-2",
        isActive 
          ? "border-helpude-teal-200 bg-gradient-to-br from-white to-helpude-teal-50/30" 
          : "border-gray-200 bg-gray-50/50"
      )}>
        {/* Status Ribbon */}
        {isActive && (
          <div className="absolute top-4 right-4">
            <Badge variant="success" className="gap-1">
              <Check className="h-3 w-3" />
              Ativo
            </Badge>
          </div>
        )}
        {isComingSoon && (
          <div className="absolute top-4 right-4">
            <Badge variant="warning" className="gap-1">
              <Clock className="h-3 w-3" />
              Em Breve
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl",
            isActive 
              ? "bg-gradient-to-br from-helpude-teal-400 to-helpude-teal-600 shadow-lg shadow-helpude-teal-500/30"
              : "bg-gray-200"
          )}>
            {product.icon}
          </div>
          <CardTitle className={cn(
            "text-xl",
            !isActive && "text-gray-500"
          )}>
            {product.name}
          </CardTitle>
          <CardDescription className={cn(
            !isActive && "text-gray-400"
          )}>
            {product.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Público Potencial */}
          <div className={cn(
            "flex items-center gap-3 p-4 rounded-xl",
            isActive ? "bg-helpude-teal-100/50" : "bg-gray-100"
          )}>
            <Users className={cn(
              "h-5 w-5",
              isActive ? "text-helpude-teal-600" : "text-gray-400"
            )} />
            <div>
              <p className={cn(
                "text-sm",
                isActive ? "text-helpude-teal-700" : "text-gray-500"
              )}>
                Público Potencial
              </p>
              <p className={cn(
                "text-lg font-bold",
                isActive ? "text-helpude-teal-800" : "text-gray-600"
              )}>
                {formatNumber(product.publicoNumero)} milhões
              </p>
              <p className={cn(
                "text-xs",
                isActive ? "text-helpude-teal-600" : "text-gray-400"
              )}>
                {product.publicoPotencial}
              </p>
            </div>
          </div>

          {/* CTA */}
          {isActive ? (
            <Button className="w-full gap-2" variant="secondary">
              Começar a Usar
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="w-full" variant="outline" disabled>
              Disponível em Breve
            </Button>
          )}
        </CardContent>

        {/* Shimmer Effect for Coming Soon */}
        {isComingSoon && (
          <div className="absolute inset-0 shimmer pointer-events-none" />
        )}
      </Card>
    </motion.div>
  );
}
