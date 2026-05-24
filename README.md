# Solar Tecnologia — SolarWave ERP

Plataforma web para gestão inteligente de usinas solares no Nordeste. Inclui landing page institucional e dashboard completo para clientes e administradores.

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.2.6 (App Router) |
| Linguagem | TypeScript 6 |
| Estilo | Tailwind CSS + CSS customizado |
| Banco de dados | PostgreSQL 16 + Prisma ORM |
| Autenticação | JWT (jose) + bcryptjs |
| Validação | Zod |
| Formulários | React Hook Form |
| Mapa | Leaflet.js (satélite ArcGIS) |
| Container | Docker + Docker Compose |

---

## Funcionalidades

### Landing Page
- Seções: Hero, Produto, Módulos, Cobertura Regional, Benefícios, Integrações, CTA, Contato
- Mapa de satélite interativo da Região Nordeste (Leaflet + ArcGIS World Imagery)
- Formulário de contato com envio por e-mail (SMTP configurável)
- Botão WhatsApp flutuante

### Dashboard
- **Autenticação**: Login por e-mail ou CPF/CNPJ, recuperação de senha, troca obrigatória de senha
- **Chamados**: Abertura, acompanhamento e comentários em tickets de suporte
- **Usuários**: Gerenciamento completo (admin) — aprovar, rejeitar, bloquear, redefinir senha
- **Perfil**: Edição de dados pessoais
- **Configurações**: SMTP, preferências do sistema (admin)
- **Auditoria**: Log de todas as ações sensíveis

### Perfis de Acesso
| Perfil | Permissões |
|--------|-----------|
| `admin` | Acesso total |
| `operador` | Tickets, usuários, clientes |
| `financeiro` | Relatórios e faturamento |
| `comercial` | CRM e leads |
| `support` | Tickets e comentários internos |
| `investidor` | Visualização de dados |
| `client` | Apenas seus próprios dados |

---

## Segurança

- JWT sem fallback hardcoded — falha explicitamente se `JWT_SECRET` não estiver configurado
- Senhas com bcrypt (custo 12)
- Rate limiting em memória: login (5/15 min), cadastro (3/h), recuperação de senha (3/h), contato (5/h)
- Token de reset de senha hasheado com SHA-256 antes de persistir
- Security headers em todas as rotas: `X-Frame-Options`, `CSP`, `HSTS`, `X-Content-Type-Options`, etc.
- Escape de HTML em templates de e-mail (proteção contra XSS)
- Validação Zod em todos os endpoints
- Cookies `HttpOnly`, `Secure`, `SameSite=lax`
- `0 vulnerabilidades` no `npm audit`

---

## Rodar com Docker (recomendado)

```bash
# 1. Copie e preencha as variáveis de ambiente
cp .env.example .env.local

# 2. Suba os containers (app + banco)
docker-compose up --build
```

Acesse: **http://localhost:3101**

> As migrations e o seed rodam automaticamente na primeira inicialização.

---

## Rodar localmente (desenvolvimento)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 3. Subir banco de dados via Docker
docker-compose up db -d

# 4. Gerar Prisma client e aplicar migrations
npx prisma generate
npx prisma migrate deploy

# 5. Popular banco com dados iniciais
npx ts-node --project tsconfig.json prisma/seed.ts

# 6. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3101**

---

## Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/solar_db?schema=public"
JWT_SECRET="chave-aleatoria-minimo-64-chars"
NEXTAUTH_URL="http://localhost:3101"

# SMTP para envio de e-mails (opcional em dev)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="seu@email.com"
SMTP_PASS="app-password-do-google"
SMTP_TO="destino@empresa.com"
```

> Gere um JWT_SECRET seguro: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

---

## Credenciais padrão (seed)

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@solartecnologia.com.br | Admin@2024 |
| Cliente demo | cliente@empresademo.com.br | Cliente@2024 |

> Altere as senhas imediatamente após o primeiro acesso em produção.

---

## Estrutura do Projeto

```
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Landing page
│   │   ├── layout.tsx                    # Layout raiz
│   │   ├── globals.css                   # Estilos globais
│   │   ├── auth/
│   │   │   ├── login/                    # Página de login
│   │   │   ├── cadastro/                 # Auto-cadastro de clientes
│   │   │   └── recuperar-senha/          # Recuperação de senha
│   │   ├── dashboard/
│   │   │   ├── page.tsx                  # Painel principal
│   │   │   ├── chamados/                 # Tickets de suporte
│   │   │   ├── usuarios/                 # Gestão de usuários (admin)
│   │   │   ├── perfil/                   # Perfil do usuário
│   │   │   └── configuracoes/            # Configurações do sistema
│   │   └── api/
│   │       ├── auth/                     # Login, registro, logout, reset
│   │       ├── tickets/                  # CRUD de chamados
│   │       ├── admin/users/              # Gestão de usuários
│   │       ├── admin/roles/              # Perfis de acesso
│   │       ├── config/email/             # Config SMTP
│   │       └── contact/                  # Formulário público
│   ├── components/
│   │   ├── home/                         # Seções da landing page
│   │   │   └── NordesteMap.tsx           # Mapa Leaflet/satélite
│   │   ├── layout/                       # Navbar e Footer
│   │   └── ui/                           # Componentes do dashboard
│   ├── lib/
│   │   ├── auth.ts                       # JWT + session helpers
│   │   ├── email.ts                      # Envio de e-mails (nodemailer)
│   │   ├── prisma.ts                     # Prisma client singleton
│   │   ├── rate-limit.ts                 # Rate limiter em memória
│   │   └── validations.ts                # Schemas Zod compartilhados
│   └── middleware.ts                     # Proteção de rotas (JWT)
├── prisma/
│   ├── schema.prisma                     # Modelos do banco
│   ├── seed.ts                           # Dados iniciais
│   └── migrations/                       # Histórico de migrations
├── docker-compose.yml                    # App + PostgreSQL
├── Dockerfile                            # Imagem de produção (standalone)
├── next.config.mjs                       # Config Next.js + security headers
└── .env.example                          # Template de variáveis de ambiente
```

---

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (porta 3101)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint
npx prisma studio    # Interface visual do banco
npx prisma migrate dev --name nome   # Nova migration
```

---

## Contato

**Solar Tecnologia LTDA**
- CNPJ: 66.837.941/0001-92
- Tel: (85) 98721-7973
- Site: [solartecnologia.com.br](https://solartecnologia.com.br)
