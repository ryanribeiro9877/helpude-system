# CLAUDE.md - HelpUde Platform

## Project Overview

HelpUde is a SaaS credit platform for Brazilian healthcare clinics (Plataforma de Credito para Clinicas). It connects clinics to credit lines for healthcare, enabling batch patient consultations, pipeline management, marketing automation, and user access control. The codebase and UI are primarily in Brazilian Portuguese.

**Current state:** Frontend-only prototype with mock data. No backend API integration yet. TanStack Query is configured and ready for future API connections.

## Repository Structure

```
helpude-system/
├── CLAUDE.md
├── helpude-preview.jsx              # Standalone prototype/preview component
└── helpude-platform/
    └── helpude-platform/            # Main application (nested directory)
        ├── src/
        │   ├── components/
        │   │   ├── dashboard/       # Dashboard widgets (MetricCard, ProductCard, LevelProgress)
        │   │   ├── layout/          # Sidebar, Header, MainLayout
        │   │   ├── marketing/       # MarketingConfig.tsx
        │   │   ├── pipeline/        # PipelineBoard.tsx (Kanban view)
        │   │   └── ui/              # Base UI components (shadcn/ui pattern)
        │   ├── contexts/
        │   │   └── AuthContext.tsx   # Authentication state (mock, localStorage-based)
        │   ├── pages/               # Route page components
        │   │   ├── DashboardPage.tsx
        │   │   ├── ConsultasPage.tsx # Batch upload and file management
        │   │   ├── UsuariosPage.tsx  # User management with RBAC
        │   │   ├── LoginPage.tsx
        │   │   ├── ProdutosPage.tsx
        │   │   ├── MarketingPage.tsx
        │   │   └── PipelinePage.tsx
        │   ├── types/
        │   │   └── index.ts         # All TypeScript type definitions
        │   ├── lib/
        │   │   └── utils.ts         # Formatting helpers (currency, CPF, CNPJ, phone)
        │   ├── App.tsx              # Route definitions with PrivateRoute/PublicRoute
        │   ├── main.tsx             # Entry point (React, QueryClient, BrowserRouter, AuthProvider)
        │   └── index.css            # Global styles and CSS variables
        ├── dist/                    # Build output
        ├── package.json
        ├── vite.config.ts
        ├── tsconfig.json
        ├── tailwind.config.js
        └── postcss.config.js
```

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18.2 + TypeScript 5.3 |
| Build Tool | Vite 5.1 |
| Routing | React Router v6.22 |
| Styling | Tailwind CSS 3.4 + shadcn/ui + Radix UI |
| Animations | Framer Motion 11 |
| Server State | TanStack Query v5.24 |
| Forms | React Hook Form 7.51 + Zod 3.22 |
| Charts | Recharts 2.12 |
| Icons | Lucide React |
| Toasts | Sonner |
| Date Utils | date-fns 3.3 |

## Commands

All commands must be run from the project directory: `helpude-platform/helpude-platform/`

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (runs tsc then vite build)
npm run build

# Lint (zero warnings policy)
npm run lint

# Preview production build
npm run preview
```

## Key Conventions

### Import Aliases

Use the `@/` path alias for all imports from `src/`:
```typescript
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import type { User } from '@/types'
```

### TypeScript

- Strict mode is enabled (`strict: true` in tsconfig.json)
- `noUnusedLocals` and `noUnusedParameters` are enforced
- All types are centralized in `src/types/index.ts`
- Target: ES2020, Module: ESNext

### UI Components

- Base UI components live in `src/components/ui/` following the shadcn/ui pattern
- Use the `cn()` utility from `@/lib/utils` for conditional class merging (clsx + tailwind-merge)
- Feature-specific components go in feature directories under `src/components/`
- Pages go in `src/pages/` and are connected via routes in `App.tsx`

### Styling

- Tailwind CSS with CSS variables for theming (defined in `src/index.css`)
- Custom color palette: `helpude-purple-*` (primary) and `helpude-teal-*` (secondary/success)
- Fonts: `font-display` (Outfit) for headings, `font-sans` (Plus Jakarta Sans) for body
- Custom animations available: `fade-in`, `slide-in-right`, `pulse-soft`, `shimmer`

### Authentication

- Auth state is managed via React Context (`AuthContext`)
- Currently mock-based: any email/password combination is accepted
- User session persists in localStorage under `helpude_user`
- Routes are protected with `PrivateRoute` / `PublicRoute` wrappers in `App.tsx`
- Three user levels: 1 (Acesso Inicial), 2 (Cadastro Aprovado), 3 (Analise Plena)
- RBAC roles: admin, operator, viewer

### Data & State Management

- TanStack Query is configured in `main.tsx` (staleTime: 60s, no refetch on window focus)
- Local component state for UI interactions
- No global state management library beyond React Context for auth

### Brazilian Locale

- Currency formatting: `formatCurrency()` uses `pt-BR` locale with BRL
- Document formatting: `formatCPF()`, `formatCNPJ()`, `formatPhone()` in `src/lib/utils.ts`
- All user-facing text is in Portuguese

### Routes

| Path | Page | Description |
|------|------|-------------|
| `/login` | LoginPage | Public authentication |
| `/dashboard` | DashboardPage | Main metrics dashboard |
| `/produtos` | ProdutosPage | Credit product catalog |
| `/consultas` | ConsultasPage | Batch upload and credit queries |
| `/pipeline` | PipelinePage | Kanban pipeline board |
| `/marketing` | MarketingPage | Omnichannel marketing config |
| `/usuarios` | UsuariosPage | User management |
| `/relatorios` | ComingSoonPage | Reports (not implemented) |
| `/configuracoes` | ComingSoonPage | Settings (not implemented) |

## What's Not Yet Implemented

- Backend API integration (all data is mocked)
- Testing framework and tests
- CI/CD pipeline
- Prettier configuration
- Environment config files (.env.example)
- Docker configuration
- Reports page (`/relatorios`)
- Settings page (`/configuracoes`)
- Two of three credit products ("Pagamento Recorrente" and "Credito via Boleto")

## Linting

ESLint is configured with:
- TypeScript ESLint parser and plugin
- React Hooks plugin
- React Refresh plugin
- **Zero max-warnings policy** (`--max-warnings 0`)

Run `npm run lint` before committing to ensure no warnings or errors.

## Build

The build command (`npm run build`) runs TypeScript checking first (`tsc`), then Vite bundling. Both must pass for a successful build. Output goes to `dist/`.
