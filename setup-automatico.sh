#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

step() { echo -e "\n${CYAN}[$1/$TOTAL] $2${NC}"; }
ok()   { echo -e "${GREEN}  OK${NC}"; }
warn() { echo -e "${YELLOW}  AVISO: $1${NC}"; }
fail() { echo -e "${RED}  ERRO: $1${NC}"; exit 1; }

TOTAL=6

echo -e "${GREEN}"
echo "  _   _      _       _   _     _      "
echo " | | | | ___| |_ __ | | | | __| | ___ "
echo " | |_| |/ _ \ | '_ \| | | |/ _\` |/ _ \\"
echo " |  _  |  __/ | |_) | |_| | (_| |  __/"
echo " |_| |_|\___|_| .__/ \___/ \__,_|\___|"
echo "              |_|   Setup Automatico   "
echo -e "${NC}"

# --------------------------------------------------
# 1. Check prerequisites
# --------------------------------------------------
step 1 "Verificando pre-requisitos..."

for cmd in node npm; do
  if ! command -v "$cmd" &>/dev/null; then
    fail "$cmd nao encontrado. Instale o Node.js >= 18."
  fi
done
echo "  node $(node -v) | npm $(npm -v)"

HAS_DOCKER=true
if ! command -v docker &>/dev/null; then
  HAS_DOCKER=false
  warn "Docker nao encontrado. Passo do docker-compose sera ignorado."
fi
ok

# --------------------------------------------------
# 2. Install backend dependencies
# --------------------------------------------------
step 2 "Instalando dependencias do backend..."
cd "$ROOT_DIR/backend"
npm install --silent 2>&1 | tail -3
ok

# --------------------------------------------------
# 3. Install frontend dependencies
# --------------------------------------------------
step 3 "Instalando dependencias do frontend..."
cd "$ROOT_DIR/frontend"
npm install --silent 2>&1 | tail -3
ok

# --------------------------------------------------
# 4. Configure .env
# --------------------------------------------------
step 4 "Configurando backend/.env..."
cd "$ROOT_DIR/backend"
if [ -f .env ]; then
  warn ".env ja existe, mantendo arquivo atual."
else
  cp .env.example .env
  echo "  Arquivo .env criado a partir de .env.example"
fi
ok

# --------------------------------------------------
# 5. Start MongoDB & Redis (docker-compose)
# --------------------------------------------------
step 5 "Iniciando MongoDB e Redis via Docker..."
cd "$ROOT_DIR"
if [ "$HAS_DOCKER" = true ]; then
  if docker compose version &>/dev/null; then
    COMPOSE_CMD="docker compose"
  elif command -v docker-compose &>/dev/null; then
    COMPOSE_CMD="docker-compose"
  else
    COMPOSE_CMD=""
  fi

  if [ -n "$COMPOSE_CMD" ]; then
    if $COMPOSE_CMD up -d 2>&1 | tail -5; then
      ok
    else
      warn "Docker daemon nao esta rodando. Inicie o Docker e execute: $COMPOSE_CMD up -d"
    fi
  else
    warn "docker compose nao disponivel. Inicie MongoDB e Redis manualmente."
  fi
else
  warn "Docker nao instalado. Inicie MongoDB e Redis manualmente."
fi

# --------------------------------------------------
# 6. Summary
# --------------------------------------------------
step 6 "Setup completo!"
echo ""
echo -e "${GREEN}Tudo pronto! Para rodar o projeto abra 3 terminais:${NC}"
echo ""
echo -e "  ${CYAN}Terminal 1 (API):${NC}       cd backend  && npm run dev"
echo -e "  ${CYAN}Terminal 2 (Worker):${NC}    cd backend  && npm run worker"
echo -e "  ${CYAN}Terminal 3 (Frontend):${NC}  cd frontend && npm run dev"
echo ""
echo -e "  ${YELLOW}API:${NC}      http://localhost:3001"
echo -e "  ${YELLOW}Frontend:${NC} http://localhost:5173"
echo ""
