import { useEffect, useMemo, useState } from 'react'

import SessionCard from '../components/SessionCard'
import SessionFormModal from '../components/SessionFormModal'
import Topbar from '../components/Topbar'
import { agendaSessions } from '../data/agendaSessions'
import {
  hasScheduleConflict,
  SESSION_STATUS,
} from '../services/scheduleService'
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

function AgendaScreen() {
  const [selectedDate, setSelectedDate] = useState(null)

  const [sessions, setSessions] = useState(() => {
    const savedSessions = localStorage.getItem('lumina-sessions')

    if (savedSessions) {
      return JSON.parse(savedSessions)
    }

    return agendaSessions
  })

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [form, setForm] = useState(initialForm)

  const year = 2026
  const month = 5
  const monthLabel = 'Junho de 2026'

  useEffect(() => {
    localStorage.setItem(
      'lumina-sessions',
      JSON.stringify(sessions),
    )
  }, [sessions])

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

  function getSessionsByDay(day) {
    if (!day) return []

    return sessions.filter(
      (session) => session.date === getDateKey(day),
    )
  }

  function handleChange(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  function handleCreateSession() {
    if (!form.cliente || !form.servico || !form.date || !form.horario) {
      alert('Preencha cliente, serviço, data e horário.')
      return
    }

    if (
      hasScheduleConflict({
        date: form.date,
        horario: form.horario,
      })
    ) {
      alert('Já existe um agendamento para este dia e horário.')
      return
    }

    const newSession = {
      id: `sessao-${Date.now()}`,
      cliente: form.cliente,
      servico: form.servico,
      date: form.date,
      horario: form.horario,
      telefone: form.telefone,
      email: form.email,
      status: form.status,
    }

    setSessions((currentSessions) => [
      ...currentSessions,
      newSession,
    ])

    setForm(initialForm)
    setIsCreateOpen(false)
  }

  function handleDeleteSession(sessionId) {
    const confirmDelete = window.confirm(
      'Deseja excluir este agendamento?',
    )

    if (!confirmDelete) {
      return
    }

    setSessions((currentSessions) =>
      currentSessions.filter(
        (session) => session.id !== sessionId,
      ),
    )
  }

  function handleStartEdit(session) {
    setEditingSessionId(session.id)

    setForm({
      cliente: session.cliente,
      servico: session.servico,
      date: session.date,
      horario: session.horario,
      telefone: session.telefone,
      email: session.email,
      status: session.status || SESSION_STATUS.CONFIRMADA,
    })

    setIsCreateOpen(true)
  }

  function handleUpdateSession() {
    if (!form.cliente || !form.servico || !form.date || !form.horario) {
      alert('Preencha cliente, serviço, data e horário.')
      return
    }

    if (
      hasScheduleConflict({
        date: form.date,
        horario: form.horario,
        ignoreSessionId: editingSessionId,
      })
    ) {
      alert('Já existe um agendamento para este dia e horário.')
      return
    }

    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === editingSessionId
          ? {
              ...session,
              cliente: form.cliente,
              servico: form.servico,
              date: form.date,
              horario: form.horario,
              telefone: form.telefone,
              email: form.email,
              status: form.status,
            }
          : session,
      ),
    )

    setEditingSessionId(null)
    setForm(initialForm)
    setIsCreateOpen(false)
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

  const selectedSessions = selectedDate
    ? getSessionsByDay(selectedDate)
    : []

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
            const daySessions = getSessionsByDay(day)
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
                onClick={() => day && setSelectedDate(day)}
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
                Dia {selectedDate} • Junho
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
                  session={session}
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
    </main>
  )
}

export default AgendaScreen

