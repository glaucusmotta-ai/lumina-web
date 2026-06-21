import { useEffect, useMemo, useState } from 'react'

import SessionCard from '../components/SessionCard'
import SessionFormModal from '../components/SessionFormModal'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import { getReminderApiLogs } from '../services/api/reminderApi'
import { createSession, getSessions } from '../services/api/sessionApi'
import { SESSION_STATUS } from '../services/scheduleService'
import { styles } from '../styles/dashboardStyles'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const initialForm = {
  cliente: '',
  servico: '',
  date: '2026-06-16',
  horario: '',
  telefone: '',
  email: '',
  status: SESSION_STATUS.CONFIRMADA,
}

function normalizeSessionFromApi(session) {
  return {
    id: session.id,
    cliente: session.cliente_nome,
    servico: session.servico,
    date: session.data,
    horario: session.horario,
    telefone: session.cliente_whatsapp || '',
    email: session.cliente_email || '',
    status: session.status || SESSION_STATUS.CONFIRMADA,
  }
}

function normalizeSessionToApi(form) {
  return {
    cliente_nome: form.cliente,
    cliente_whatsapp: form.telefone || null,
    cliente_email: form.email || null,
    servico: form.servico,
    data: form.date,
    horario: form.horario,
    status: form.status,
  }
}

function hasConflictInSessions({
  sessions,
  date,
  horario,
  ignoreSessionId = null,
}) {
  if (!date || !horario) return false

  return sessions.some(
    (session) =>
      session.date === date &&
      session.horario === horario &&
      session.id !== ignoreSessionId,
  )
}

function AgendaScreen() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [reminderLogs, setReminderLogs] = useState([])
  const [sessions, setSessions] = useState([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [form, setForm] = useState(initialForm)

  const year = 2026
  const month = 5
  const monthLabel = 'Junho de 2026'

  useEffect(() => {
    async function loadAgendaData() {
      try {
        const apiSessions = await getSessions()

        setSessions(apiSessions.map(normalizeSessionFromApi))

        try {
          const apiLogs = await getReminderApiLogs()
          setReminderLogs(apiLogs)
        } catch {
          setReminderLogs([])
        }
      } catch (error) {
        alert(error.message)
        setSessions([])
        setReminderLogs([])
      }
    }

    loadAgendaData()
  }, [])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const emptyDays = Array.from({ length: firstDay }, () => null)

    const monthDays = Array.from(
      { length: daysInMonth },
      (_, index) => index + 1,
    )

    return [...emptyDays, ...monthDays]
  }, [])

  function getDateKey(day) {
    return `2026-06-${String(day).padStart(2, '0')}`
  }

  function getSessionsByDate(date) {
    if (!date) return []

    return sessions.filter((session) => session.date === date)
  }

  function hasAutomaticReminderSent(session) {
    return reminderLogs.some(
      (log) =>
        log.session_id === session.id &&
        log.canal === 'email_cliente' &&
        log.tipo === 'automatico' &&
        log.status === 'sent',
    )
  }

  function handleChange(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  async function handleCreateSession() {
    if (!form.cliente || !form.servico || !form.date || !form.horario) {
      alert('Preencha cliente, serviço, data e horário.')
      return
    }

    if (
      hasConflictInSessions({
        sessions,
        date: form.date,
        horario: form.horario,
      })
    ) {
      alert('Já existe um agendamento para este dia e horário.')
      return
    }

    try {
      const apiSession = await createSession(normalizeSessionToApi(form))
      const normalizedSession = normalizeSessionFromApi(apiSession)

      setSessions((currentSessions) => [
        ...currentSessions,
        normalizedSession,
      ])

      setForm(initialForm)
      setIsCreateOpen(false)
    } catch (error) {
      alert(error.message)
    }
  }

  function handleDeleteSession() {
    alert('Exclusão de agendamento será habilitada no backend na próxima etapa.')
  }

  function handleStartEdit() {
    alert('Edição de agendamento será habilitada no backend na próxima etapa.')
  }

  function handleUpdateSession() {
    alert('Edição de agendamento será habilitada no backend na próxima etapa.')
  }

  function openCreateModal() {
    setEditingSessionId(null)
    setForm(initialForm)
    setIsCreateOpen(true)
  }

  function closeCreateModal() {
    setIsCreateOpen(false)
    setEditingSessionId(null)
    setForm(initialForm)
  }

  function openWhatsApp(session) {
    const message = `Olá, ${session.cliente}! Passando para lembrar da sua sessão de ${session.servico} às ${session.horario}.`
    const url = `https://wa.me/${session.telefone}?text=${encodeURIComponent(message)}`

    window.open(url, '_blank')
  }

  function openEmail(session) {
    const subject = 'Lembrete da sua sessão'
    const body = `Olá, ${session.cliente}!\n\nPassando para lembrar da sua sessão de ${session.servico} às ${session.horario}.\n\nAté breve!`
    const url = `mailto:${session.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.location.href = url
  }

  const selectedSessions = getSessionsByDate(selectedDate).sort((a, b) =>
    a.horario.localeCompare(b.horario),
  )

  const selectedDay = selectedDate
    ? Number(selectedDate.split('-')[2])
    : null

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Agenda</p>

        <h1 style={styles.title}>Agenda mensal</h1>

        <p style={styles.subtitle}>
          Clique em um dia para visualizar sessões, horários e contatos.
        </p>

        <button
          type="button"
          style={styles.buttonPrimary}
          onClick={openCreateModal}
        >
          + Novo agendamento
        </button>
      </section>

      <section style={styles.calendarCard}>
        <div style={styles.calendarHeader}>
          <h2 style={styles.calendarTitle}>{monthLabel}</h2>
        </div>

        <div style={styles.weekGrid}>
          {weekDays.map((day, index) => (
            <div key={`${day}-${index}`} style={styles.weekDay}>
              {day}
            </div>
          ))}
        </div>

        <div style={styles.monthGrid}>
          {calendarDays.map((day, index) => {
            const dateKey = day ? getDateKey(day) : null
            const daySessions = dateKey ? getSessionsByDate(dateKey) : []
            const hasSessions = daySessions.length > 0

            return (
              <button
                key={index}
                type="button"
                disabled={!day}
                style={{
                  ...styles.monthDay,
                  ...(day === 16 ? styles.monthDayToday : {}),
                  ...(hasSessions ? styles.monthDayWithSession : {}),
                }}
                onClick={() => dateKey && setSelectedDate(dateKey)}
              >
                {day && (
                  <>
                    <span>{day}</span>

                    {hasSessions && (
                      <small style={styles.dayBadge}>
                        {daySessions.length}
                      </small>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {selectedDate && (
        <section style={styles.popupOverlay}>
          <div style={styles.popup}>
            <div style={styles.popupHeader}>
              <h2 style={styles.popupTitle}>
                Dia {selectedDay} • Junho
              </h2>

              <button
                type="button"
                style={styles.popupClose}
                onClick={() => setSelectedDate(null)}
              >
                Fechar
              </button>
            </div>

            <div style={styles.popupBody}>
              {selectedSessions.length === 0 && (
                <p style={styles.cardDescription}>
                  Nenhum agendamento neste dia.
                </p>
              )}

              {selectedSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={{
                    ...session,
                    reminderSent: hasAutomaticReminderSent(session),
                  }}
                  onWhatsApp={openWhatsApp}
                  onEmail={openEmail}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteSession}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {isCreateOpen && (
        <SessionFormModal
          form={form}
          isEditing={Boolean(editingSessionId)}
          onChange={handleChange}
          onClose={closeCreateModal}
          onSubmit={
            editingSessionId
              ? handleUpdateSession
              : handleCreateSession
          }
        />
      )}

      <Footer />
    </main>
  )
}

export default AgendaScreen

