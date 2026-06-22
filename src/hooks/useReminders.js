import { useEffect, useState } from 'react'

import {
  getReminderApiLogs,
  getTodayReminderItems,
  sendReminder,
} from '../services/api/reminderApi'

function normalizeReminder(reminder) {
  return {
    id: reminder.id,
    sessionId: reminder.id,
    cliente: reminder.cliente_nome || 'Cliente',
    telefone: reminder.cliente_whatsapp || '',
    email: reminder.cliente_email || '',
    data: reminder.data || '',
    horario: reminder.horario || '',
    status: reminder.status || '',
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
    channel: log.canal || '',
    recipient: log.destinatario || '',
    type: log.tipo || 'manual',
    offsetMinutes: log.reminder_offset_minutes || null,
    status: log.status || '',
    sentAt: log.sent_at || '',
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
        setReminders(apiReminders.map(normalizeReminder))
      } catch (error) {
        alert(error.message)
        setReminders([])
      }

      try {
        const apiLogs = await getReminderApiLogs()
        setLogs(apiLogs.map(normalizeLog))
      } catch {
        setLogs([])
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
        cliente: '',
        service: 'Atendimento',
        data: new Date().toISOString().slice(0, 10),
        horario: '',
        channel,
        recipient,
        type: 'manual',
        offsetMinutes: null,
        status: 'sent',
        sentAt: new Date().toISOString(),
      }

      setLogs((prev) => [newLog, ...prev])

      return newLog
    } catch (error) {
      alert(error.message)
      return null
    }
  }

  return {
    reminders,
    logs,
    registerSend,
  }
}

export default useReminders

