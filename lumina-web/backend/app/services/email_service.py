import smtplib

from email.mime.text import MIMEText

from app.config.settings import settings


def send_email(
    to_email: str,
    subject: str,
    message: str
):
    email_message = MIMEText(
        message,
        "plain",
        "utf-8"
    )

    email_message["Subject"] = subject
    email_message["From"] = f"{settings.REMINDER_FROM_NAME} <{settings.SMTP_EMAIL}>"
    email_message["To"] = to_email

    with smtplib.SMTP(
        settings.SMTP_HOST,
        settings.SMTP_PORT
    ) as server:
        server.starttls()
        server.login(
            settings.SMTP_EMAIL,
            settings.SMTP_PASSWORD
        )
        server.send_message(email_message)

    return True


