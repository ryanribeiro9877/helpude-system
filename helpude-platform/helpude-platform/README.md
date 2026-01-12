# HelpUde - Plataforma de Crédito para Clínicas

![HelpUde](https://img.shields.io/badge/HelpUde-Plataforma%20de%20Cr%C3%A9dito-7b5fc7)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

Plataforma completa para clínicas conectarem seus pacientes a linhas de crédito para saúde. Gerencie consultas em lote, acompanhe o pipeline de clientes aprovados e automatize o marketing.

## 🚀 Funcionalidades

### Sistema de Níveis Progressivos

| Nível | Nome | Benefícios |
|-------|------|------------|
| **1** | Acesso Inicial | Até 50 consultas, upload de base, visualização de resultados |
| **2** | Cadastro Aprovado | Consultas ilimitadas, crédito na conta da clínica |
| **3** | Análise Plena | Parceiro estratégico, taxas diferenciadas, suporte premium |

### Produtos Disponíveis

- **💼 Crédito para Assalariados** (Ativo) - 43 milhões de brasileiros
- **💳 Pagamento Recorrente** (Em breve) - 95 milhões com cartão de crédito
- **📄 Crédito via Boleto** (Em breve) - 120 milhões sem restrição

### Dashboard

- Métricas em tempo real
- Gráficos de evolução
- Progresso de nível
- Ações rápidas

### Consultas em Lote

- Upload de arquivos CSV/XLSX
- Processamento automático
- Visualização de resultados
- Download de relatórios

### Pipeline de Clientes

- Kanban visual com 4 etapas
- Crédito Aprovado → Mensagem Enviada → Engajamento → Convertido
- Integração direta com WhatsApp
- Indicadores de abertura de email/SMS

### Automação de Marketing

- **RCS/SMS**: Templates com variáveis dinâmicas
- **E-mail Marketing**: Editor de templates
- **Ligação IA**: Script e tom de voz configuráveis
- **WhatsApp**: Mensagem padrão para chamadas diretas

### Gestão de Usuários

- Hierarquia de permissões (Admin, Operador, Visualizador)
- Controle granular de acessos
- Ativação/Desativação de usuários

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build rápido
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Radix UI** para componentes acessíveis
- **React Router** para navegação
- **TanStack Query** para gerenciamento de estado
- **Recharts** para gráficos
- **Sonner** para notificações

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/helpude-platform.git

# Entre na pasta
cd helpude-platform

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Executa o linter
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── dashboard/       # Componentes do dashboard
│   ├── layout/          # Sidebar, Header, MainLayout
│   ├── marketing/       # Configuração de marketing
│   ├── pipeline/        # Board de pipeline
│   └── ui/              # Componentes base (Button, Card, etc)
├── contexts/
│   └── AuthContext.tsx  # Contexto de autenticação
├── hooks/               # Custom hooks
├── lib/
│   └── utils.ts         # Funções utilitárias
├── pages/               # Páginas da aplicação
├── types/
│   └── index.ts         # Tipos TypeScript
├── App.tsx              # Rotas da aplicação
├── main.tsx             # Entry point
└── index.css            # Estilos globais
```

## 🎨 Design System

### Cores Principais

- **Purple**: `#7b5fc7` - Cor primária
- **Teal**: `#14b8a6` - Cor secundária/sucesso
- **Dark Purple**: `#3d246c` - Textos e CTAs

### Tipografia

- **Display**: Outfit (títulos)
- **Body**: Plus Jakarta Sans (corpo)

### Componentes

Todos os componentes seguem o padrão shadcn/ui com customizações para a marca HelpUde.

## 🚀 Deploy no Lovable

1. Acesse [lovable.dev](https://lovable.dev)
2. Crie um novo projeto
3. Faça upload dos arquivos ou conecte ao repositório GitHub
4. O deploy é automático

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=https://api.helpude.com.br
VITE_APP_ENV=development
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da HelpUde. Todos os direitos reservados.

---

Desenvolvido com 💜 para conectar clínicas e pacientes ao crédito para saúde.
