import { motion } from 'framer-motion';
import { ProductCard } from '@/components/dashboard/ProductCard';
import type { Product } from '@/types';

const products: Product[] = [
  {
    id: '1',
    name: 'Crédito para Assalariados',
    description: 'Crédito consignado para trabalhadores CLT com desconto em folha. Aprovação rápida e sem burocracia.',
    publicoPotencial: 'Trabalhadores com carteira assinada',
    publicoNumero: 43,
    status: 'active',
    icon: '💼',
    color: 'teal',
  },
  {
    id: '2',
    name: 'Pagamento Recorrente no Cartão',
    description: 'Cuide da saúde pagando no cartão de crédito de forma recorrente. Parcelas que cabem no bolso.',
    publicoPotencial: 'Pessoas com cartão de crédito ativo',
    publicoNumero: 95,
    status: 'coming_soon',
    icon: '💳',
    color: 'purple',
  },
  {
    id: '3',
    name: 'Crédito via Boleto',
    description: 'Crédito para pessoas sem restrição no nome. Pagamento via boleto bancário.',
    publicoPotencial: 'Pessoas sem restrição SPC/Serasa',
    publicoNumero: 120,
    status: 'coming_soon',
    icon: '📄',
    color: 'blue',
  },
];

export function ProdutosPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold text-foreground">
          Produtos Disponíveis
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore as opções de crédito disponíveis para seus pacientes
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            delay={0.1 * index} 
          />
        ))}
      </div>
    </div>
  );
}
