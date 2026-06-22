export const SESSION_STATUS = {
  CONFIRMADA: 'Confirmada',
  PENDENTE: 'Pendente',
  CANCELADA: 'Cancelada',
  FINALIZADA: 'Finalizada',
}

export function hasScheduleConflictInSessions({
  sessions,
  date,
  horario,
  ignoreSessionId = null,
}) {
  if (!date || !horario) {
    return false
  }

  return sessions.some((session) =>
    session.date === date &&
    session.horario === horario &&
    session.id !== ignoreSessionId,
  )
}

