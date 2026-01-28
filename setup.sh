#!/bin/bash

# Cores para output mais agradável
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Iniciando Setup do Projeto SEPLAG ===${NC}"

# Verifica se Docker está instalado e rodando
if ! docker --version > /dev/null 2>&1; then
    echo -e "${RED}Erro: Docker não está instalado. Instale o Docker primeiro.${NC}"
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Erro: Docker não está rodando. Inicie o Docker.${NC}"
    exit 1
fi

echo -e "${YELLOW}Parando e removendo containers, volumes e imagens antigos...${NC}"
# Para e remove containers, volumes e imagens
docker-compose down --volumes --rmi all

echo -e "${GREEN}Limpando volumes órfãos (se houver)...${NC}"
docker volume prune -f

echo -e "${GREEN}Buildando e subindo os serviços...${NC}"
# Build e sobe os serviços
docker-compose up --build -d

# Aguarda um pouco para os serviços subirem
echo -e "${YELLOW}Aguardando os serviços ficarem prontos...${NC}"
sleep 15

echo -e "${GREEN}🎉 Projeto rodando com sucesso! 🎉${NC}"
echo -e "${BLUE}Acesse os serviços:${NC}"
echo -e "  🌐 Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "  🔧 Backend: ${GREEN}http://localhost:3333${NC}"
echo -e "  📦 MinIO Console: ${GREEN}http://localhost:9001${NC} (usuário: admin_storage, senha: Storage_Key_2026!)"
echo -e "  🗄️  PostgreSQL: ${GREEN}localhost:5432${NC} (usuário: srv_discografia, senha: P@ssw0rd_Seplag2026!, db: db_discografia_core)"
echo -e "${YELLOW}Para parar o projeto: docker-compose down${NC}"
echo -e "${BLUE}=== Setup Concluído ===${NC}"