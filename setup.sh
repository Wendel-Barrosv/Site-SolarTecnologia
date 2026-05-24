#!/bin/bash
# ============================================
# Solar Tecnologia — Script de Inicialização
# ============================================

set -e

echo ""
echo "================================================"
echo "  Solar Tecnologia — Setup do Ambiente"
echo "================================================"
echo ""

# Copy .env if not exists
if [ ! -f .env.local ]; then
  echo "→ Copiando .env.example para .env.local..."
  cp .env.example .env.local
  echo "  ⚠️  Configure as variáveis em .env.local antes de continuar"
fi

# Install dependencies
echo ""
echo "→ Instalando dependências..."
npm install

# Generate Prisma client
echo ""
echo "→ Gerando Prisma Client..."
npx prisma generate

# Run migrations
echo ""
echo "→ Executando migrations do banco..."
npx prisma migrate deploy

# Run seed
echo ""
echo "→ Populando banco com dados iniciais..."
npx ts-node --project tsconfig.json prisma/seed.ts

echo ""
echo "================================================"
echo "  ✅ Setup concluído!"
echo ""
echo "  Acesse: http://localhost:3101"
echo ""
echo "  Admin: admin@solartecnologia.com.br / Admin@2024"
echo "  Cliente: cliente@empresademo.com.br / Cliente@2024"
echo "================================================"
echo ""
