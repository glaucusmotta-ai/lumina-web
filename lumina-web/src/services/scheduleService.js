import { agendaSessions } from '../data/agendaSessions'

const SESSIONS_STORAGE_KEY = 'lumina-sessions'

export function getStoredSessions() {
  const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY)

  if (storedSessions) {
    return JSON.parse(storedSessions)
  }

  return agendaSessions
}

export function saveStoredSessions(sessions) {
  localStorage.setItem(
    SESSIONS_STORAGE_KEY,
    JSON.stringify(sessions),
  )
}

export function hasScheduleConflict({
  date,
  horario,
  ignoreSessionId = null,
}) {
  if (!date || !horario) {
    return false
  }

  const sessions = getStoredSessions()

  return sessions.some((session) =>
    session.date === date &&
    session.horario === horario &&
    session.id !== ignoreSessionId,
  )
}

export function createScheduleSession(sessionData) {
  const sessions = getStoredSessions()

  const newSession = {
    id: `sessao-${Date.now()}`,
    status: SESSION_STATUS.CONFIRMADA,
    ...sessionData,
  }

  saveStoredSessions([...sessions, newSession])

  return newSession
}

export const SESSION_STATUS = {
  CONFIRMADA: 'Confirmada',
  PENDENTE: 'Pendente',
  CANCELADA: 'Cancelada',
  FINALIZADA: 'Finalizada',
}


