import { useEffect, useState } from 'react'

import {
  getReminderApiLogs,
  getTodayReminderItems,
  sendReminder,
} from '../services/api/reminderApi'

import {
  getReminderLogs,
  getTodayReminders,
  registerReminderSend,
} from '../services/reminderService'

function normalizeReminder(reminder) {
  return {
    id: reminder.id,
    cliente: reminder.cliente_nome || 'Cliente',
    telefone: reminder.cliente_whatsapp || '',
    email: reminder.cliente_email || '',
    data: reminder.data,
    horario: reminder.horario,
    status: reminder.status,
    service: reminder.servico || 'Atendimento',
  }
}

function normalizeLog(log) {
  return {
    id: log.id,
    sessionId: log.session_id,
    cliente: log.cliente_nome || 'Cliente não informado',
    clienteEmail: log.cliente_email || '',
    service: log.servico || 'Atendimento',
    data: log.data || '',
    horario: log.horario || '',
    channel: log.canal,
    recipient: log.destinatario,
    type: log.tipo || 'manual',
    offsetMinutes: log.reminder_offset_minutes || null,
    status: log.status,
    sentAt: log.sent_at,
    errorMessage: log.error_message || null,
  }
}

function useReminders() {
  const [reminders, setReminders] = useState([])
  const [logs, setLogs] = useState([])

  useEffect(() => {
    async function loadReminders() {
      try {
        const apiReminders = await getTodayReminderItems()
        const apiLogs = await getReminderApiLogs()

        const normalizedReminders = apiReminders.map(normalizeReminder)

        setReminders(
          normalizedReminders.length > 0
            ? normalizedReminders
            : getTodayReminders(),
        )

        setLogs(apiLogs.map(normalizeLog))
      } catch {
        setReminders(getTodayReminders())
        setLogs(getReminderLogs())
      }
    }

    loadReminders()
  }, [])

  async function registerSend({
    sessionId,
    channel,
    recipient,
  }) {
    try {
      await sendReminder({
        session_id: sessionId,
      })

      const newLog = {
        id: `api-${Date.now()}`,
        sessionId,
        channel,
        recipient,
        status: 'enviado',
        sentAt: new Date().toISOString(),
      }

      setLogs((prev) => [newLog, ...prev])

      return newLog
    } catch {
      const log = registerReminderSend({
        sessionId,
        channel,
        recipient,
      })

      setLogs((prev) => [log, ...prev])

      return log
    }
  }

  return {
    reminders,
    logs,
    registerSend,
  }
}

export default useReminders


