const CLIENTS_STORAGE_KEY = 'lumina_clients'
const SESSIONS_STORAGE_KEY = 'lumina-sessions'

const CURRENT_MONTH = '2026-06'
const TODAY = '2026-06-16'

function getStoredItems(key) {
  const storedItems = localStorage.getItem(key)

  if (!storedItems) {
    return []
  }

  return JSON.parse(storedItems)
}

function getCurrentMonthSessions(sessions) {
  return sessions.filter((session) =>
    session.date?.startsWith(CURRENT_MONTH),
  )
}

function getFutureSessions(sessions) {
  return sessions.filter((session) =>
    session.date >= TODAY,
  )
}

function getConfirmedSessions(sessions) {
  return sessions.filter((session) =>
    session.status === 'Confirmada',
  )
}

function getRanking(items, fieldName) {
  const totals = items.reduce((accumulator, item) => {
    const value = item[fieldName] || 'Não informado'

    accumulator[value] = (accumulator[value] || 0) + 1

    return accumulator
  }, {})

  return Object.entries(totals)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
}

function getTopLabel(ranking) {
  if (!ranking.length) {
    return 'Não informado'
  }

  const topTotal = ranking[0].total

  return ranking
    .filter((item) => item.total === topTotal)
    .map((item) => item.label)
    .join(' / ')
}

function getHourFromSession(session) {
  if (!session.horario) {
    return null
  }

  return Number(session.horario.split(':')[0])
}

function getPeriodFromSession(session) {
  const hour = getHourFromSession(session)

  if (hour === null || Number.isNaN(hour)) {
    return 'Não informado'
  }

  if (hour < 12) {
    return 'Manhã'
  }

  if (hour < 18) {
    return 'Tarde'
  }

  return 'Noite'
}

function getPeriodRanking(sessions) {
  const periods = [
    { label: 'Manhã', total: 0 },
    { label: 'Tarde', total: 0 },
    { label: 'Noite', total: 0 },
  ]

  sessions.forEach((session) => {
    const period = getPeriodFromSession(session)
    const targetPeriod = periods.find((item) => item.label === period)

    if (targetPeriod) {
      targetPeriod.total += 1
    }
  })

  return periods
}

function getHourRanking(sessions) {
  const totals = sessions.reduce((accumulator, session) => {
    if (!session.horario) {
      return accumulator
    }

    const hour = `${session.horario.split(':')[0]}h`

    accumulator[hour] = (accumulator[hour] || 0) + 1

    return accumulator
  }, {})

  return Object.entries(totals)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
}

function getPeriodBreakdown(sessions, periodLabel) {
  const filteredSessions = sessions.filter((session) =>
    getPeriodFromSession(session) === periodLabel,
  )

  return getHourRanking(filteredSessions)
}

function formatSessionsText(total) {
  return total === 1 ? '1 sessão' : `${total} sessões`
}

function getPeriodHelper(periodRanking, periodBreakdown) {
  if (!periodRanking.length || periodRanking[0].total === 0) {
    return 'Sem sessões registradas no período'
  }

  const topPeriod = periodRanking[0]
  const breakdownText = periodBreakdown
    .map((item) => `${item.label}: ${formatSessionsText(item.total)}`)
    .join(' • ')

  return `${breakdownText} • Total: ${formatSessionsText(topPeriod.total)}`
}

function getHourHelper(hourRanking) {
  if (!hourRanking.length) {
    return 'Sem horários registrados'
  }

  const topHour = hourRanking[0]

  return `${formatSessionsText(topHour.total)} registradas neste horário`
}

function getWeekNumber(date) {
  const day = Number(date.split('-')[2])

  if (day <= 7) return 1
  if (day <= 14) return 2
  if (day <= 21) return 3

  return 4
}

function getWeeklyHistory(sessions) {
  const weeks = [
    { week: 'Semana 1', sessions: 0 },
    { week: 'Semana 2', sessions: 0 },
    { week: 'Semana 3', sessions: 0 },
    { week: 'Semana 4', sessions: 0 },
  ]

  sessions.forEach((session) => {
    if (!session.date) {
      return
    }

    const weekIndex = getWeekNumber(session.date) - 1

    if (weeks[weekIndex]) {
      weeks[weekIndex].sessions += 1
    }
  })

  return weeks
}

function getMonthlyEvolution(sessions) {
  const totals = sessions.reduce((accumulator, session) => {
    if (!session.date) {
      return accumulator
    }

    const month = session.date.slice(0, 7)

    accumulator[month] = (accumulator[month] || 0) + 1

    return accumulator
  }, {})

  return Object.entries(totals)
    .map(([month, total]) => ({
      label: month,
      total,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function getMetricsData() {
  const clients = getStoredItems(CLIENTS_STORAGE_KEY)
  const sessions = getStoredItems(SESSIONS_STORAGE_KEY)

  const monthSessions = getCurrentMonthSessions(sessions)
  const futureSessions = getFutureSessions(sessions)
  const confirmedSessions = getConfirmedSessions(sessions)

  const originRanking = getRanking(clients, 'origemCliente')
  const regionRanking = getRanking(clients, 'regiao')
  const locationRanking = getRanking(clients, 'localAtendimento')
  const periodRanking = getPeriodRanking(monthSessions)
  const hourRanking = getHourRanking(monthSessions)
  const weeklyHistory = getWeeklyHistory(monthSessions)
  const monthlyEvolution = getMonthlyEvolution(sessions)

  const topPeriod = getTopLabel(periodRanking)
  const topPeriodBreakdown = getPeriodBreakdown(monthSessions, topPeriod)

  const confirmationRate = sessions.length
    ? Math.round((confirmedSessions.length / sessions.length) * 100)
    : 0

  const returnRate = clients.length && monthSessions.length
    ? Math.min(100, Math.round((monthSessions.length / clients.length) * 100))
    : 0

  return {
    kpis: [
      {
        label: 'Sessões no mês',
        value: String(monthSessions.length),
        helper: 'Total de atendimentos registrados em junho',
      },
      {
        label: 'Clientes ativos',
        value: String(clients.length),
        helper: 'Clientes cadastrados no Lumina',
      },
      {
        label: 'Taxa de confirmação',
        value: `${confirmationRate}%`,
        helper: 'Sessões confirmadas no histórico',
      },
      {
        label: 'Agendamentos futuros',
        value: String(futureSessions.length),
        helper: 'Sessões a partir de hoje',
      },
      {
        label: 'Taxa de retorno',
        value: `${returnRate}%`,
        helper: 'Estimativa baseada em sessões/clientes',
      },
    ],
    executiveCards: [
      {
        label: 'Origem principal',
        value: getTopLabel(originRanking),
        helper: 'Canal com maior volume de clientes',
      },
      {
        label: 'Região principal',
        value: getTopLabel(regionRanking),
        helper: 'Região com maior recorrência',
      },
      {
        label: 'Local mais usado',
        value: getTopLabel(locationRanking),
        helper: 'Espaço preferencial dos clientes',
      },
      {
        label: 'Faixa do dia mais utilizada',
        value: topPeriod,
        helper: getPeriodHelper(periodRanking, topPeriodBreakdown),
      },
      {
        label: 'Horário mais procurado',
        value: getTopLabel(hourRanking),
        helper: getHourHelper(hourRanking),
      },
    ],
    insights: [
      `Origem com maior recorrência: ${getTopLabel(originRanking)}.`,
      `Região com maior recorrência: ${getTopLabel(regionRanking)}.`,
      `Local preferencial mais usado: ${getTopLabel(locationRanking)}.`,
      `Faixa do dia mais utilizada: ${topPeriod}.`,
      `Horário mais procurado: ${getTopLabel(hourRanking)}.`,
    ],
    weeklyHistory,
    monthlyEvolution,
    originRanking,
    regionRanking,
    locationRanking,
    periodRanking,
    hourRanking,
  }
}

