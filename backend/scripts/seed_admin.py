"""Seed initial AdminMaster user."""
import sys, os
import typer
from sqlmodel import Session
sys.path.append(os.path.abspath(os.path.join(__file__, "../../")))

from app.core.dependencies import engine
from app.models.user import User
from app.models.tenant import Tenant
from app.core.security import hash_password
from app.core.email import send_email

cli = typer.Typer()

@cli.command()
def run(email: str = "adm@datawiseservice.com", password: str = "DevCleveris!2024"):
    with Session(engine) as session:
        root_tenant = Tenant(name="ROOT")
        session.add(root_tenant)
        session.commit()
        session.refresh(root_tenant)

        admin = User(
            tenant_id=root_tenant.id,
            email=email,
            hashed_password=hash_password(password),
            role="admin",
            is_active=True,
        )
        session.add(admin)
        session.commit()

    try:
        send_email(
            subject="Bem‑vindo ao DataWise (AdminMaster)",
            body=f"Seu usuário foi criado. Login: {email}  Senha inicial: {password}",
            to=email,
        )
    except Exception as exc:
        print("Aviso: não foi possível enviar o e‑mail:", exc)

if __name__ == "__main__":
    cli()
