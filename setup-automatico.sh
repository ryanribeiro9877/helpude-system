#!/bin/bash

# ============================================
# HelpUde Platform - Script de Setup Automatico
# ============================================
# Este script configura o ambiente de desenvolvimento
# da plataforma HelpUde automaticamente.
# ============================================

set -e

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="helpude-platform/helpude-platform"

print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}  HelpUde Platform - Setup Automatico${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
}

print_step() {
    echo -e "${YELLOW}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

check_node() {
    print_step "Verificando Node.js..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js nao encontrado. Instale o Node.js 18+ antes de continuar."
        echo "  Visite: https://nodejs.org/"
        exit 1
    fi

    NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 18+ necessario. Versao atual: $(node -v)"
        exit 1
    fi
    print_success "Node.js $(node -v) encontrado"
}

check_npm() {
    print_step "Verificando npm..."
    if ! command -v npm &> /dev/null; then
        print_error "npm nao encontrado."
        exit 1
    fi
    print_success "npm $(npm -v) encontrado"
}

install_dependencies() {
    print_step "Instalando dependencias..."
    cd "$PROJECT_DIR"
    npm install
    cd - > /dev/null
    print_success "Dependencias instaladas com sucesso"
}

create_env_file() {
    ENV_FILE="$PROJECT_DIR/.env"
    if [ ! -f "$ENV_FILE" ]; then
        print_step "Criando arquivo .env..."
        cat > "$ENV_FILE" << 'EOF'
VITE_API_URL=https://api.helpude.com.br
VITE_APP_ENV=development
EOF
        print_success "Arquivo .env criado"
    else
        print_success "Arquivo .env ja existe, mantendo configuracao atual"
    fi
}

run_build() {
    print_step "Executando build de verificacao..."
    cd "$PROJECT_DIR"
    if npm run build; then
        print_success "Build concluido com sucesso"
    else
        print_error "Build falhou. Verifique os erros acima."
        cd - > /dev/null
        exit 1
    fi
    cd - > /dev/null
}

run_lint() {
    print_step "Executando linter..."
    cd "$PROJECT_DIR"
    if npm run lint 2>/dev/null; then
        print_success "Linter passou sem erros"
    else
        echo -e "${YELLOW}[AVISO]${NC} Linter reportou problemas. Verifique os avisos acima."
    fi
    cd - > /dev/null
}

print_summary() {
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}  Setup concluido com sucesso!${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo "Para iniciar o servidor de desenvolvimento:"
    echo ""
    echo -e "  ${BLUE}cd $PROJECT_DIR${NC}"
    echo -e "  ${BLUE}npm run dev${NC}"
    echo ""
    echo "Scripts disponiveis:"
    echo "  npm run dev      - Servidor de desenvolvimento"
    echo "  npm run build    - Build para producao"
    echo "  npm run lint     - Executar linter"
    echo "  npm run preview  - Preview do build"
    echo ""
}

# === Execucao Principal ===

print_header
check_node
check_npm
install_dependencies
create_env_file
run_build
run_lint
print_summary
