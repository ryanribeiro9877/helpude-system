import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatCPF(cpf: string): string {
  const numbers = cpf.replace(/\D/g, '')
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatCNPJ(cnpj: string): string {
  const numbers = cnpj.replace(/\D/g, '')
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '')
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function getLevelBadgeColor(level: number): string {
  switch (level) {
    case 1:
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 2:
      return 'bg-helpude-purple-100 text-helpude-purple-700 border-helpude-purple-200'
    case 3:
      return 'bg-helpude-teal-100 text-helpude-teal-700 border-helpude-teal-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getLevelName(level: number): string {
  switch (level) {
    case 1:
      return 'Acesso Inicial'
    case 2:
      return 'Cadastro Aprovado'
    case 3:
      return 'Análise Plena'
    default:
      return 'Desconhecido'
  }
}
