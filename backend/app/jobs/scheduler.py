from apscheduler.schedulers.background import BackgroundScheduler

from app.jobs.reminder_job import process_daily_reminders

scheduler = BackgroundScheduler()


def start_scheduler():
    scheduler.add_job(
        process_daily_reminders,
        trigger="interval",
        minutes=60
    )

    scheduler.start()
    
    