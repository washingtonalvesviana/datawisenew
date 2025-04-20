# DataWise — Documentação Técnica Consolidada (Backend & Acesso)

> **Versão:** 1.0 – 20 Abr 2025  
> **Escopo:** Backend FastAPI modular **sem Docker**, multi‑tenant (Admin → Gestor → Colaborador), oito serviços *Wise*, integração com frontend React/Vite, porta interna 8088.

---
## 1. Visão Geral do Projeto
O DataWise é um SaaS de gestão e consulta de dados, composto por **8 serviços de negócio** e módulos administrativos correlatos. O backend precisa ser altamente modular para permitir manutenção assistida por IA e isolar cada empresa (Gestor) via **multi‑tenant** e **Row‑Level‑Security** (RLS) no PostgreSQL.

---
## 2. Requisitos Funcionais
| Item | Descrição |
|------|-----------|
| **P1** | Autenticação JWT (e‑mail + senha) com três papéis: *AdminMaster*, *Gestor*, *Colaborador*. |
| **P2** | Admin provisiona Gestores e habilita/desabilita serviços adquiridos. |
| **P3** | Gestor administra usuários, grupos e ACL de conteúdo apenas do seu tenant. |
| **P4** | Serviços devem ser independentes em código (arquivos ≤ 300 linhas) para fácil refatoração por IA. |
| **P5** | Backend expõe API REST em **https://api-datawisenew.datawiserservice.com** (porta 8088). |
| **P6** | Frontend estático hospedado em **https://datawisenew.datawiserservice.com** (porta 8087). |

---
## 3. Papéis, Serviços e Menus
### 3.1 Papéis
| Role | Escopo | Permissões‑chave |
|------|--------|------------------|
| **AdminMaster** (`admin`) | Sistema inteiro | CRUD Gestores; habilitar serviços; acesso total. |
| **Gestor** (`gestor`) | Tenant próprio | CRUD usuários, grupos, bancos; gerencia conteúdo nos serviços liberados. |
| **Colaborador** (`usuario`) | Tenant próprio | Usa serviços permitidos via Grupo/ACL; edita apenas seu perfil. |

### 3.2 Serviços × Menus Administrativos
| Serviço | Menu acoplado | Quem vê |
|---------|--------------|---------|
| DataQueryWise | Gerenc. Conhecimento | Admin / Gestor (sempre) |
| LGPDQueryWise | Gerenc. LGPD | Se habilitado |
| DPOQueryWise | Gerenc. DPO | Se habilitado |
| LegalQueryWise | Gerenc. Legal | Se habilitado |
| DBManageWise + DataMigrateWise | Gerenc. Migrações | Se habilitado |
| EasyApiWise | — | Se habilitado |
| AppGenWise | — | Se habilitado |
| **Core** | Gerenc. Usuários, Grupos, Bancos, Agentes IA, LLMs, Sincronização | Admin / Gestor (sempre) |

---
## 4. Arquitetura Técnica
### 4.1 Stack
* **Python 3.12** + **FastAPI + SQLModel**
* **PostgreSQL 15** (RLS, JSONB, uuid‑ossp)
* **Passlib** (bcrypt) e **python‑jose** (JWT)
* **Systemd** para serviço persistente
* **Apache 2 + Certbot** para TLS e proxy‑pass

### 4.2 Estrutura de Pastas
```
backend/
  app/
    core/           # config, segurança, DB session
    models/         # Tenant, User, ...
    services/
      data_query/   # models.py | schemas.py | crud.py | api.py
      lgpd_query/   # ... (idem p/ 8 serviços)
    main.py         # monta routers com importlib
  scripts/          # seeds, jobs
  requirements.txt
  .env.example
```
*Regra*: cada arquivo ≤ 150‑300 linhas.

---
## 5. Esquema de Banco & RLS
### 5.1 Entidades‑chave
```
tenants(id, name, logo_url, created_at)
services(id, code, name)
tenant_services(tenant_id, service_id, enabled bool)
users(id, tenant_id, email, hashed_password, role, is_active)
groups(id, tenant_id, name)
group_members(group_id, user_id)
service_group_acl(service_id, group_id, permissions jsonb)
```
### 5.2 Exemplo de Política RLS
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```
Backend (dependência `get_session`): `SET app.tenant_id='<uuid>'`.

---
## 6. Variáveis de Ambiente (`backend/.env`)
```env
SECRET_KEY=CHANGEME_SUPER_SECRET
DATABASE_URL=postgresql+psycopg2://postgres:<senha>@85.209.92.173:5432/DataWiseNew-V03
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=adm@datawiseservice.com
SMTP_PASS=COLOQUE_SENHA_AQUI
SMTP_SENDER=adm@datawiseservice.com
```

---
## 7. Setup Local (dev)
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
# configure DB & SMTP
python backend/scripts/seed_admin.py run   # cria AdminMaster + envia e‑mail
uvicorn backend.app.main:app --host 0.0.0.0 --port 8088 --reload
```
Swagger: <http://localhost:8088/docs>

---
## 8. Deploy Produção
### 8.1 Systemd
Arquivo `/etc/systemd/system/datawise-backend.service` (vide README_BACKEND).

### 8.2 Apache Proxy
```apache
<VirtualHost *:443>
  ServerName api-datawisenew.datawiserservice.com
  SSLEngine on
  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:8088/
  ProxyPassReverse / http://127.0.0.1:8088/
  RewriteEngine On
  RewriteCond %{HTTP:Upgrade} =websocket [NC]
  RewriteRule /(.*) ws://127.0.0.1:8088/$1 [P,L]
</VirtualHost>
```

---
## 9. Integração Frontend
* `VITE_API_URL` = `https://api-datawisenew.datawiserservice.com`
* Gravar JWT em `localStorage`; incluir Bearer em Axios/React Query.
* 401 ⇒ redirect `/login`.

---
## 10. Roadmap Futuro
| Fase | Item |
|------|------|
| **M0** | Endpoint refresh token + logout |
| **M1** | Tables groups, ACL, tenant_services + seeds |
| **M2** | Celery worker p/ embeddings & migrações |
| **M3** | Observabilidade (Sentry, Prometheus) |
| **M4** | CI GitHub Actions (pytest, ruff) |

---
## 11. Normas de Contribuição
* `black` + `ruff` antes de commit.
* Arquivos >300 linhas → dividir.
* Testes em `tests/services/<service>/`.
* Alembic migrations nomeadas claramente.

---
### Fim do Documento

