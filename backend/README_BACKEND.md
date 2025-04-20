# DataWise — Documentação Técnica Consolidada (Backend & Acesso)

> **Versão:** 1.0 – 20 Abr 2025  
> **Escopo:** Backend FastAPI modular **sem Docker**, multi‑tenant (Admin → Gestor → Colaborador), oito serviços *Wise*, integração com frontend React/Vite, porta interna 8088.

---
## 1. Visão Geral do Projeto
O DataWise é um SaaS de gestão e consulta de dados, composto por **8 serviços de negócio** e módulos administrativos correlatos. O backend precisa ser altamente modular para permitir manutenção assistida por IA, e isolar cada empresa (Gestor) via **multi‑tenant** e **Row‑Level‑Security** (RLS) no PostgreSQL.

---
## 2. Requisitos Funcionais
| Item | Descrição |
|-----|-----------|
| **P1** | Autenticação JWT (e‑mail + senha) com três papéis: *AdminMaster*, *Gestor*, *Colaborador*. |
| **P2** | Admin provisiona Gestores e habilita/ desabilita serviços adquiridos. |
| **P3** | Gestor administra usuários, grupos e ACL de conteúdo apenas do seu tenant. |
| **P4** | Serviços devem ser independentes em código (arquivos ≤ 300 linhas) para fácil refatoração por IA. |
| **P5** | Backend expõe API REST em **https://api-datawisenew.datawiserservice.com** (porta 8088). |
| **P6** | Frontend estático hospedado em **https://datawisenew.datawiserservice.com** (porta 8087). |

---
## 3. Papéis, Serviços e Menus
### 3.1 Papéis
| Role | Escopo | Permissões‑chave |
|------|--------|------------------|
| **AdminMaster** (`admin`) | Sistema inteiro | CRUD Gestores; habilitar serviços; acesso a todos os recursos. |
| **Gestor** (`gestor`) | Tenant próprio | CRUD usuários, grupos, bancos; gerencia conteúdo nos serviços liberados pelo Admin. |
| **Colaborador** (`usuario`) | Tenant próprio | Usa serviços permitidos via Grupo/ACL; edita apenas seu perfil. |

### 3.2 Serviços vs. Menus Administrativos
| Serviço | Menu administrativo acoplado | Quem vê |
|---------|-----------------------------|---------|
| DataQueryWise | Gerenciamento de Conhecimento | Admin / Gestor (sempre) |
| LGPDQueryWise | Gerenciamento de LGPD | Se habilitado |
| DPOQueryWise | Gerenciamento de DPO | Se habilitado |
| LegalQueryWise| Gerenciamento Legal | Se habilitado |
| DBManageWise + DataMigrateWise | Gerenciamento de Migrações | Se habilitado |
| EasyApiWise | — | Se habilitado |
| AppGenWise  | — | Se habilitado |
| **Core** | Gerenc. Usuários, Grupos, Bancos, Agentes IA, LLMs, Sincronização | Admin (sempre) / Gestor (sempre) |

---
## 4. Arquitetura Técnica
### 4.1 Tech‑stack
* **Python 3.12**  
* **FastAPI + SQLModel** (uvicorn ASGI)  
* **PostgreSQL 15** (instância já existente)  
* **Passlib + python‑jose** (autenticação)  
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
  README_BACKEND.md
  requirements.txt
  .env.example
```
Cada arquivo é mantido **≤ 150‑300 linhas**.

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

### 5.2 Política RLS genérica
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON users
USING (tenant_id = current_setting('app.tenant_id')::uuid);
```
No backend, após autenticar: `SET app.tenant_id = '<uuid>'`.

---
## 6. Configuração de Ambiente (`backend/.env`)
```env
SECRET_KEY=CHANGEME_SUPER_SECRET
DATABASE_URL=postgresql+psycopg2://postgres:<senha>@85.209.92.173:5432/DataWiseNew-V03
```
> **Nunca** comitar credenciais reais; usar secrets ou variáveis de ambiente no servidor.

---
## 7. Fluxo de Desenvolvimento Local
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env   # edite
python -m app.tools.init_db           # cria tabelas (script a escrever)
uvicorn backend.app.main:app --reload --port 8088
```
Documentação Swagger: <http://localhost:8088/docs>

---
## 8. Deploy em Produção (Ubuntu 22.04)
### 8.1 Service systemd
`/etc/systemd/system/datawise-backend.service`
```ini
[Unit]
Description=DataWise API
After=network.target

[Service]
User=ubuntu
Group=www-data
Environment="PYTHONUNBUFFERED=1"
WorkingDirectory=/home/ubuntu/datawisenew/backend
ExecStart=/home/ubuntu/datawisenew/.venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8088
Restart=always

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now datawise-backend
```

### 8.2 Apache VirtualHost (proxy‑pass)
```apache
<VirtualHost *:443>
  ServerName api-datawisenew.datawiserservice.com
  SSLEngine on
  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:8088/
  ProxyPassReverse / http://127.0.0.1:8088/
  # WebSocket suporte
  RewriteEngine On
  RewriteCond %{HTTP:Upgrade} =websocket [NC]
  RewriteRule /(.*) ws://127.0.0.1:8088/$1 [P,L]
</VirtualHost>
```
Certificado gerenciado via **Certbot** (já configurado).

---
## 9. Integração Frontend
* `VITE_API_URL` **deve** ser `https://api-datawisenew.datawiserservice.com`.
* React Query / Axios pegam token JWT do `localStorage` (`authStore`).
* Ao receber 401 → redirecionar `/login`.

---
## 10. Roadmap de Melhorias Futuras
| Fase | Item |
|------|------|
| **M0** | Endpoint `/auth/refresh` + rota `/auth/logout` |
| **M1** | Tabelas `groups`, `acl`, `tenant_services` + seeds automáticos |
| **M2** | Worker Celery para tarefas longas (embeddings, migrações) |
| **M3** | Logs estruturados + Sentry + Prometheus/Grafana |
| **M4** | Tests CI (GitHub Actions) rodando `pytest` e `ruff` |

---
## 11. Normas de Contribuição
* Use **black + ruff** antes de commit.  
* Arquivos >300 linhas devem ser divididos.  
* Crie tests em `tests/services/<service>/`.  
* Descreva migrations Alembic com mensagem clara (`-m "tenant_services init"`).

---
## 12. Referências
* FastAPI Docs · <https://fastapi.tiangolo.com>  
* SQLModel Docs · <https://sqlmodel.tiangolo.com>  
* Postgres RLS · <https://www.postgresql.org/docs/current/ddl-rowsecurity.html>  
* Passlib (bcrypt) · <https://passlib.readthedocs.io>  

---
### Fim do Documento

