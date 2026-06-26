from apscheduler.schedulers.background import BackgroundScheduler

from app.jobs.reminder_job import process_daily_reminders
from app.jobs.trial_job import run_trial_expiration

scheduler = BackgroundScheduler()


def start_scheduler():
    print("[SCHEDULER] Inicializando scheduler")

    scheduler.add_job(process_daily_reminders, trigger="interval", minutes=60)
    scheduler.add_job(run_trial_expiration, trigger="cron", hour=6, minute=0)

    print("[SCHEDULER] Executando primeira varredura imediata")
    process_daily_reminders()
    run_trial_expiration()

    scheduler.start()
    print("[SCHEDULER] Scheduler iniciado")
    
    