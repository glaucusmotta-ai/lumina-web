const REMINDER_HISTORY_KEY = 'lumina-reminder-history'

function getReminderHistory() {
  const data = localStorage.getItem(REMINDER_HISTORY_KEY)

  if (!data) return []

  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

function saveReminderHistory(history) {
  localStorage.setItem(REMINDER_HISTORY_KEY, JSON.stringify(history))
}

export function getTodayReminders() {
  return []
}

export function registerReminderSend({ sessionId, channel, recipient }) {
  const history = getReminderHistory()

  const log = {
    id: `reminder-${Date.now()}`,
    sessionId,
    channel,
    recipient,
    status: 'enviado',
    sentAt: new Date().toISOString(),
  }

  const updated = [log, ...history]

  saveReminderHistory(updated)

  return log
}

export function getReminderLogs() {
  return getReminderHistory()
}

