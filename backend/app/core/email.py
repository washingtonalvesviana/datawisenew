import smtplib, ssl
from email.message import EmailMessage
from .config import settings

def send_email(subject: str, body: str, to: str):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = settings.SMTP_SENDER
    msg['To'] = to
    msg.set_content(body)

    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, context=context) as server:
        server.login(settings.SMTP_USER, settings.SMTP_PASS)
        server.send_message(msg)
