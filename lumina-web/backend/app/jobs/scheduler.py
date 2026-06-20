from apscheduler.schedulers.background import BackgroundScheduler

from app.jobs.reminder_job import process_daily_reminders

scheduler = BackgroundScheduler()


def start_scheduler():
    print("[SCHEDULER] Inicializando scheduler de lembretes")

    scheduler.add_job(
        process_daily_reminders,
        trigger="interval",
        minutes=60
    )

    print("[SCHEDULER] Executando primeira varredura imediata")
    process_daily_reminders()

    scheduler.start()

    print("[SCHEDULER] Scheduler iniciado")
    
    
    