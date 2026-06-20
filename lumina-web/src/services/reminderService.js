import { getStoredSessions } from './scheduleService'

const REMINDER_HISTORY_KEY = 'lumina-reminder-history'

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

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
  const today = getTodayDate()
  const sessions = getStoredSessions()

  return sessions
    .filter((session) => session.date === today)
    .map((session) => ({
      id: session.id,
      cliente:
        session.cliente ||
        session.cliente_nome ||
        session.clientName ||
        session.nome ||
        'Cliente',
      telefone: session.phone || session.telefone || '',
      email: session.email || '',
      data: session.date,
      horario: session.horario,
      status: session.status,
      service: session.service || session.servico || 'Atendimento',
    }))
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


