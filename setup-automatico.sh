#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# HelpUde Platform - Script de Setup Automatico
# ============================================================
# Configura o ambiente de desenvolvimento da plataforma HelpUde.
# Instala dependencias, verifica tipagem, executa lint e build.
# ============================================================

PROJECT_DIR="helpude-platform/helpude-platform"
LOG_FILE="setup-automatico.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
  local level="$1"
  shift
  local msg="$*"
  local timestamp
  timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo -e "${timestamp} [${level}] ${msg}" | tee -a "$LOG_FILE"
}

info()    { log "${BLUE}INFO${NC}" "$@"; }
success() { log "${GREEN}OK${NC}" "$@"; }
warn()    { log "${YELLOW}WARN${NC}" "$@"; }
error()   { log "${RED}ERRO${NC}" "$@"; }

separator() {
  echo "------------------------------------------------------------" | tee -a "$LOG_FILE"
}

check_command() {
  if ! command -v "$1" &> /dev/null; then
    error "Comando '$1' nao encontrado. Instale-o antes de continuar."
    exit 1
  fi
}

# ============================================================
# Inicio
# ============================================================

echo "" > "$LOG_FILE"
separator
info "Iniciando setup automatico da HelpUde Platform"
separator

# Verificar pre-requisitos
info "Verificando pre-requisitos..."
check_command node
check_command npm

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
success "Node.js ${NODE_VERSION} encontrado"
success "npm ${NPM_VERSION} encontrado"

# Verificar diretorio do projeto
if [ ! -d "$PROJECT_DIR" ]; then
  error "Diretorio do projeto nao encontrado: $PROJECT_DIR"
  error "Execute este script a partir da raiz do repositorio (helpude-system/)."
  exit 1
fi

cd "$PROJECT_DIR"
info "Diretorio do projeto: $(pwd)"

# ============================================================
# 1. Instalar dependencias
# ============================================================
separator
info "[1/4] Instalando dependencias..."

if [ -f "package-lock.json" ]; then
  npm ci --loglevel=error 2>&1 | tee -a "../../$LOG_FILE"
else
  npm install --loglevel=error 2>&1 | tee -a "../../$LOG_FILE"
fi

if [ $? -eq 0 ]; then
  success "Dependencias instaladas com sucesso."
else
  error "Falha ao instalar dependencias."
  exit 1
fi

# ============================================================
# 2. Lint
# ============================================================
separator
info "[2/4] Executando ESLint..."

if npm run lint 2>&1 | tee -a "../../$LOG_FILE"; then
  success "Lint passou sem erros."
else
  warn "Lint reportou problemas. Verifique o output acima."
fi

# ============================================================
# 3. TypeScript check
# ============================================================
separator
info "[3/4] Verificando tipagem TypeScript..."

if npx tsc --noEmit 2>&1 | tee -a "../../$LOG_FILE"; then
  success "Verificacao de tipos passou sem erros."
else
  warn "TypeScript reportou erros de tipagem. Verifique o output acima."
fi

# ============================================================
# 4. Build de producao
# ============================================================
separator
info "[4/4] Gerando build de producao..."

if npm run build 2>&1 | tee -a "../../$LOG_FILE"; then
  success "Build de producao gerado com sucesso."
else
  error "Falha no build de producao."
  exit 1
fi

# ============================================================
# Resumo
# ============================================================
separator
echo ""
success "Setup automatico finalizado com sucesso!"
info "Log completo salvo em: $LOG_FILE"
info "Para iniciar o servidor de desenvolvimento: cd $PROJECT_DIR && npm run dev"
separator
