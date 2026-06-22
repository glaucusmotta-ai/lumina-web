import { getClients } from './api/clientApi'
import { getSessions } from './api/sessionApi'

const CURRENT_MONTH = '2026-06'
const TODAY = '2026-06-16'

function normalizeSession(session) {
  return {
    id: session.id,
    cliente: session.cliente_nome || '',
    servico: session.servico || '',
    date: session.data || '',
    horario: session.horario || '',
    status: session.status || '',
  }
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
    String(session.status).toLowerCase() === 'confirmada',
  )
}

function getRanking(items, fieldName) {
  const totals = items.reduce((acc, item) => {
    const value = item[fieldName] || 'Não informado'
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})

  return Object.entries(totals)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
}

function getTopLabel(ranking) {
  if (!ranking.length) return 'Não informado'

  const topTotal = ranking[0].total

  return ranking
    .filter((item) => item.total === topTotal)
    .map((item) => item.label)
    .join(' / ')
}

function getPeriodFromSession(session) {
  if (!session.horario) return 'Não informado'

  const hour = Number(session.horario.split(':')[0])

  if (Number.isNaN(hour)) return 'Não informado'
  if (hour < 12) return 'Manhã'
  if (hour < 18) return 'Tarde'

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
    const item = periods.find((periodItem) => periodItem.label === period)

    if (item) item.total += 1
  })

  return periods
}

function getHourRanking(sessions) {
  const totals = sessions.reduce((acc, session) => {
    if (!session.horario) return acc

    const hour = `${session.horario.split(':')[0]}h`
    acc[hour] = (acc[hour] || 0) + 1

    return acc
  }, {})

  return Object.entries(totals)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
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
    if (!session.date) return

    const index = getWeekNumber(session.date) - 1

    if (weeks[index]) {
      weeks[index].sessions += 1
    }
  })

  return weeks
}

function getMonthlyEvolution(sessions) {
  const totals = sessions.reduce((acc, session) => {
    if (!session.date) return acc

    const month = session.date.slice(0, 7)
    acc[month] = (acc[month] || 0) + 1

    return acc
  }, {})

  return Object.entries(totals)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

function formatSessionsText(total) {
  return total === 1 ? '1 sessão' : `${total} sessões`
}

function getHourHelper(hourRanking) {
  if (!hourRanking.length) return 'Sem horários registrados'

  return `${formatSessionsText(hourRanking[0].total)} registradas neste horário`
}

export async function getMetricsData() {
  const [clients, rawSessions] = await Promise.all([
    getClients(),
    getSessions(),
  ])

  const sessions = rawSessions.map(normalizeSession)

  const monthSessions = getCurrentMonthSessions(sessions)
  const futureSessions = getFutureSessions(sessions)
  const confirmedSessions = getConfirmedSessions(sessions)

  const originRanking = getRanking(clients, 'origem_cliente')
  const locationRanking = getRanking(clients, 'local_atendimento')
  const regionRanking = getRanking(clients, 'regiao')
  const periodRanking = getPeriodRanking(monthSessions)
  const hourRanking = getHourRanking(monthSessions)
  const weeklyHistory = getWeeklyHistory(monthSessions)
  const monthlyEvolution = getMonthlyEvolution(sessions)

  const topPeriod = getTopLabel(periodRanking)

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
        helper: 'Baseado nas sessões do mês',
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


