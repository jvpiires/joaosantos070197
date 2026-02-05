# 🎵 Sistema de Gestão Discográfica (SGD)

**Solução Full Stack para Gerenciamento de Discografia**  
Desafio SEPLAG-MT 2026 • João Santos (joaosantos070197)

---

## 📌 Visão Geral

O **SGD (Sistema de Gestão Discográfica)** é uma aplicação **full stack** para gerenciamento de acervos musicais, permitindo controle de artistas, álbuns, favoritos e usuários, com autenticação segura e armazenamento de mídia em object storage.

O sistema foi projetado com foco em:

- Arquitetura em camadas  
- Segurança com JWT  
- Escalabilidade (stateless + storage externo)  
- Boas práticas de API REST  
- Ambiente 100% containerizado  

---

## 🏗 Arquitetura do Sistema

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | React + TypeScript + Vite + Tailwind + PrimeReact |
| **Backend** | Spring Boot + Java 21 + OpenAPI (Swagger) |
| **Banco de Dados** | PostgreSQL |
| **Armazenamento de Mídia** | MinIO (S3-compatible) |
| **Autenticação** | JWT (RS256) |
| **Infra Local** | Docker Compose |

**Portas padrão:**

| Serviço | URL |
|--------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3333 |
| Swagger | http://localhost:3333/swagger-ui/index.html |
| MinIO Console | http://localhost:9001 |
| PostgreSQL | localhost:5432 |

---

## 🚀 Como Executar o Projeto

### ✅ Opção Recomendada — Execução Automática

```bash
cd projeto-seplag/joaosantos070197
bash setup.sh
```

O script realiza automaticamente:

- Criação de network Docker  
- Inicialização do PostgreSQL  
- Execução de migrations (Flyway)  
- Inicialização do MinIO  
- Build e start do backend  
- Build e start do frontend  

---

### 🛠 Execução Manual (Desenvolvimento)

#### Backend
```bash
cd backend
./mvnw clean spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Banco
```bash
docker run -p 5432:5432 postgres:15-alpine
```

#### Storage (MinIO)
```bash
docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
```

---

## 🔐 Autenticação

O sistema utiliza **JWT com assinatura assimétrica (RS256)**.

Fluxo:

1. Usuário faz login (`/auth/login`)
2. Backend valida credenciais
3. Retorna:
   - `access_token` (15 min)
   - `refresh_token` (7 dias)
4. Cliente envia token em:

```
Authorization: Bearer <access_token>
```

✔ Stateless  
✔ Escalável  
✔ Sem sessão em servidor  

---

## 👥 Perfis de Usuário

| Permissão | USER | ADMIN |
|-----------|------|-------|
| CRUD Artistas | ✅ | ✅ |
| CRUD Álbuns | ✅ | ✅ |
| Favoritar álbuns | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Gerenciar usuários | ❌ | ✅ |
| Alterar roles | ❌ | ✅ |
| Sincronizar regionais | ❌ | ✅ |

---

## 🎼 Funcionalidades

### 🎤 Artistas
- CRUD completo  
- Upload de foto  
- Busca por nome  
- Soft delete com auditoria  

### 💿 Álbuns
- CRUD vinculado a artistas  
- Upload de capa (PNG/JPG)  
- Favoritação por usuário  

### ❤️ Favoritos
- Listagem personalizada  
- Remoção em massa  

### 📊 Dashboard
- Total de artistas  
- Total de álbuns  
- Total de favoritos  

### 🛠 Administração
- Gerenciamento de usuários  
- Alteração de roles  
- Sincronização de regionais via API externa  

---

## 🔗 Principais Endpoints

### Público
```
POST /auth/login
POST /auth/register

```

### Protegidos (USER / ADMIN)
```
GET    /api/v1/artists
POST   /api/v1/artists
GET    /api/v1/albums
POST   /api/v1/albums/{id}/favorite
```

### ADMIN
```
GET /api/users
PUT /api/users/{id}/role
POST /api/v1/regionais/sync
```

---

## 🗂 Estrutura do Projeto

```
backend/
  ├─ controller
  ├─ service
  ├─ repository
  ├─ security
  └─ config

frontend/
  ├─ pages
  ├─ components
  ├─ services
  └─ hooks
```

---

## 🧪 Testes

### Backend
- Services (CRUD + regras de negócio)  
- Autenticação  
- JWT  
- Rate limiting  

### Frontend
```bash
npm run test
npm run test:coverage
npm run lint
```

---

## 🔑 Dados de Acesso (Dev)

**Admin**
```
admin
123456

```

**Usuário**
```
user
123456

```

---

## 🧠 Decisões Técnicas Relevantes

| Decisão | Motivo |
|--------|-------|
| JWT RS256 | Segurança + escalabilidade |
| MinIO | Storage desacoplado do servidor |
| Arquitetura em camadas | Manutenibilidade |
| Flyway | Versionamento de schema |
| Validações em múltiplas camadas | Defesa em profundidade |

---

## 👨‍💻 Autor

João Santos  
GitHub: github.com/joaosantos070197  

Projeto desenvolvido para o **Desafio SEPLAG-MT 2026**.
