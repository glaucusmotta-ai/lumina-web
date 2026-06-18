import { useEffect, useState } from 'react'

import {
  getReminderLogs,
  getTodayReminders,
  registerReminderSend,
} from '../services/reminderService'

function useReminders() {
  const [reminders, setReminders] = useState([])
  const [logs, setLogs] = useState([])

  useEffect(() => {
    setReminders(getTodayReminders())
    setLogs(getReminderLogs())
  }, [])

  function registerSend({ sessionId, channel, recipient }) {
    const log = registerReminderSend({
      sessionId,
      channel,
      recipient,
    })

    setLogs((prev) => [log, ...prev])

    return log
  }

  return {
    reminders,
    logs,
    registerSend,
  }
}

export default useReminders


