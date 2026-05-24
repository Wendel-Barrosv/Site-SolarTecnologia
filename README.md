# Solar Tecnologia — SolarWave ERP

Plataforma de gestão inteligente para energia solar.

## Stack
- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript
- **Estilo**: Tailwind CSS + CSS customizado (preservado do design original)
- **Banco**: PostgreSQL + Prisma ORM
- **Auth**: JWT (jose) + bcryptjs
- **Forms**: React Hook Form + Zod
- **Container**: Docker + docker-compose

## Rodar com Docker (recomendado)

```bash
# Copie e configure as variáveis
cp .env.example .env.local

# Suba tudo
docker-compose up --build
```

Acesse: **http://localhost:3101**

## Rodar local (desenvolvimento)

```bash
# 1. Instalar dependências
npm install

# 2. Configure .env.local com seu banco local

# 3. Gerar Prisma client + migrations
npx prisma generate
npx prisma migrate dev --name init

# 4. Popular banco com dados iniciais
npx ts-node --project tsconfig.json prisma/seed.ts

# 5. Iniciar servidor
npm run dev
```

## Credenciais padrão

| Usuário | E-mail | Senha |
|---------|--------|-------|
| Admin | admin@solartecnologia.com.br | Admin@2024 |
| Cliente demo | cliente@empresademo.com.br | Cliente@2024 |

## Estrutura

```
src/
├── app/
│   ├── page.tsx                    # Landing page (home)
│   ├── auth/login/page.tsx         # Login
│   ├── auth/cadastro/page.tsx      # Cadastro
│   ├── auth/recuperar-senha/...    # Recuperação de senha
│   ├── dashboard/
│   │   ├── page.tsx               # Dashboard do cliente
│   │   ├── chamados/page.tsx      # Lista de chamados
│   │   ├── chamados/novo/...      # Novo chamado
│   │   ├── chamados/[id]/...      # Detalhe do chamado
│   │   └── perfil/page.tsx        # Perfil do usuário
│   └── api/
│       ├── auth/login/            # POST /api/auth/login
│       ├── auth/register/         # POST /api/auth/register
│       ├── auth/logout/           # POST /api/auth/logout
│       ├── auth/forgot-password/  # POST /api/auth/forgot-password
│       ├── tickets/               # GET/POST /api/tickets
│       ├── tickets/[id]/          # GET/PATCH/DELETE
│       ├── tickets/[id]/comments/ # POST comentários
│       └── contact/               # POST formulário de contato
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── home/HeroSection.tsx
│   ├── home/ProdutoSection.tsx
│   ├── home/ModulosSection.tsx
│   ├── home/DashboardSection.tsx
│   ├── home/BenefitsSection.tsx
│   ├── home/IntegracoesSection.tsx
│   ├── home/CTASection.tsx
│   ├── ui/DashboardSidebar.tsx
│   ├── ui/TicketCommentForm.tsx
│   └── WhatsAppButton.tsx
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── auth.ts                    # JWT + session helpers
│   └── validations.ts             # Zod schemas
├── middleware.ts                   # Proteção de rotas
└── types/index.ts                  # TypeScript types
prisma/
├── schema.prisma                   # Modelos do banco
└── seed.ts                         # Dados iniciais
```

## Contato

- **CNPJ**: 66.837.941/0001-92
- **Tel**: (85) 98721-7973
- **Site**: www.solartecnologia.com.br
