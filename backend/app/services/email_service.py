import logging
import smtplib

from email.mime.text import MIMEText

from app.config.settings import settings


logger = logging.getLogger(__name__)


def send_email(
    to_email: str,
    subject: str,
    message: str
):
    logger.info(
        "EMAIL_SEND_START to=%s subject=%s smtp_host=%s smtp_port=%s",
        to_email,
        subject,
        settings.SMTP_HOST,
        settings.SMTP_PORT
    )

    email_message = MIMEText(
        message,
        "plain",
        "utf-8"
    )

    email_message["Subject"] = subject
    email_message["From"] = (
        f"{settings.REMINDER_FROM_NAME} <{settings.SMTP_EMAIL}>"
    )
    email_message["To"] = to_email

    try:
        with smtplib.SMTP(
            settings.SMTP_HOST.strip(),
            settings.SMTP_PORT,
            timeout=20
        ) as server:
            server.starttls()
            server.login(
                settings.SMTP_EMAIL.strip(),
                settings.SMTP_PASSWORD
            )
            server.send_message(email_message)

        logger.info(
            "EMAIL_SEND_SUCCESS to=%s subject=%s",
            to_email,
            subject
        )

        return True

    except Exception as error:
        logger.exception(
            "EMAIL_SEND_ERROR to=%s subject=%s error=%s",
            to_email,
            subject,
            str(error)
        )

        raise
    
    
    