// src/screens/AgendaScreen.jsx
import { useEffect, useMemo, useState } from 'react'

import SessionCard from '../components/SessionCard'
import SessionFormModal from '../components/SessionFormModal'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'

import { getReminderApiLogs } from '../services/api/reminderApi'
import { createSession, deleteSession, getSessions, updateSession } from '../services/api/sessionApi'
import { SESSION_STATUS } from '../services/scheduleService'
import { styles } from '../styles/dashboardStyles'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function getTodayString() {
  return new Date().toISOString().slice(0, 10)
}

function buildInitialForm(dateStr) {
  return {
    cliente: '',
    servico: '',
    date: dateStr,
    horario: '',
    telefone: '',
    email: '',
    status: SESSION_STATUS.CONFIRMADA,
  }
}

function normalizeSessionFromApi(session) {
  return {
    id: session.id,
    cliente: session.cliente_nome,
    servico: session.servico || '',
    date: session.data || '',
    horario: session.horario || '',
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

function hasConflictInSessions({ sessions, date, horario, ignoreSessionId = null }) {
  if (!date || !horario) return false
  return sessions.some(
    (s) => s.date === date && s.horario === horario && s.id !== ignoreSessionId,
  )
}

function padDay(day) {
  return String(day).padStart(2, '0')
}

function AgendaScreen() {
  const today = getTodayString()
  const todayDate = new Date(today + 'T00:00:00')

  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [reminderLogs, setReminderLogs] = useState([])
  const [sessions, setSessions] = useState([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [form, setForm] = useState(buildInitialForm(today))

  const monthLabel = `${MONTH_NAMES[currentMonth]} de ${currentYear}`

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

  function prevMonth() {
    setSelectedDate(null)
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1) }
    else setCurrentMonth((m) => m - 1)
  }

  function nextMonth() {
    setSelectedDate(null)
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1) }
    else setCurrentMonth((m) => m + 1)
  }

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
  }, [currentYear, currentMonth])

  function getDateKey(day) {
    return `${currentYear}-${padDay(currentMonth + 1)}-${padDay(day)}`
  }

  function getSessionsByDate(date) {
    return sessions.filter((s) => s.date === date)
  }

  function hasAutomaticReminderSent(session) {
    return reminderLogs.some(
      (log) => log.session_id === session.id && log.canal === 'email_cliente' && log.tipo === 'automatico' && log.status === 'sent',
    )
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleCreateSession() {
    if (!form.cliente || !form.servico || !form.date || !form.horario) {
      alert('Preencha cliente, serviço, data e horário.')
      return
    }
    if (hasConflictInSessions({ sessions, date: form.date, horario: form.horario })) {
      alert('Já existe um agendamento para este dia e horário.')
      return
    }
    try {
      const apiSession = await createSession(normalizeSessionToApi(form))
      setSessions((prev) => [...prev, normalizeSessionFromApi(apiSession)])
      setForm(buildInitialForm(today))
      setEditingSessionId(null)
      setIsCreateOpen(false)
    } catch (error) {
      alert(error.message)
    }
  }

  async function handleUpdateSession() {
    if (!form.cliente || !form.servico || !form.date || !form.horario) {
      alert('Preencha cliente, serviço, data e horário.')
      return
    }
    if (hasConflictInSessions({ sessions, date: form.date, horario: form.horario, ignoreSessionId: editingSessionId })) {
      alert('Já existe um agendamento para este dia e horário.')
      return
    }
    try {
      const apiSession = await updateSession(editingSessionId, normalizeSessionToApi(form))
      const normalized = normalizeSessionFromApi(apiSession)
      setSessions((prev) => prev.map((s) => s.id === editingSessionId ? normalized : s))
      setForm(buildInitialForm(today))
      setEditingSessionId(null)
      setIsCreateOpen(false)
    } catch (error) {
      alert(error.message)
    }
  }

  async function handleDeleteSession(sessionId) {
    if (!window.confirm('Deseja realmente excluir este agendamento?')) return
    try {
      await deleteSession(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      setSelectedDate(null)
    } catch (error) {
      alert(error.message)
    }
  }

  function handleStartEdit(session) {
    setEditingSessionId(session.id)
    setForm({
      cliente: session.cliente || '',
      servico: session.servico || '',
      date: session.date || '',
      horario: session.horario || '',
      telefone: session.telefone || '',
      email: session.email || '',
      status: session.status || SESSION_STATUS.CONFIRMADA,
    })
    setIsCreateOpen(true)
  }

  function openCreateModal() {
    setEditingSessionId(null)
    setForm(buildInitialForm(today))
    setIsCreateOpen(true)
  }

  function closeCreateModal() {
    setIsCreateOpen(false)
    setEditingSessionId(null)
    setForm(buildInitialForm(today))
  }

  function openWhatsApp(session) {
    const message = `Olá, ${session.cliente}! Passando para lembrar da sua sessão de ${session.servico} às ${session.horario}.`
    window.open(`https://wa.me/${session.telefone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  function openEmail(session) {
    const subject = 'Lembrete da sua sessão'
    const body = `Olá, ${session.cliente}!\n\nPassando para lembrar da sua sessão de ${session.servico} às ${session.horario}.\n\nAté breve!`
    window.location.href = `mailto:${session.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const selectedSessions = getSessionsByDate(selectedDate || '').sort((a, b) =>
    a.horario.localeCompare(b.horario),
  )
  const selectedDay = selectedDate ? Number(selectedDate.split('-')[2]) : null

  const navButtonStyle = {
    border: 'none',
    background: 'rgba(214, 156, 170, 0.16)',
    color: '#8f4459',
    borderRadius: '50%',
    width: 36,
    height: 36,
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: 16,
    display: 'grid',
    placeItems: 'center',
  }

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Agenda</p>
        <h1 style={styles.title}>Agenda mensal</h1>
        <p style={styles.subtitle}>
          Clique em um dia para visualizar sessões, horários e contatos.
        </p>
        <button type="button" style={styles.buttonPrimary} onClick={openCreateModal}>
          + Novo agendamento
        </button>
      </section>

      <section style={styles.calendarCard}>
        <div style={{ ...styles.calendarHeader, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="button" style={navButtonStyle} onClick={prevMonth}>‹</button>
          <h2 style={styles.calendarTitle}>{monthLabel}</h2>
          <button type="button" style={navButtonStyle} onClick={nextMonth}>›</button>
        </div>

        <div style={styles.weekGrid}>
          {weekDays.map((day, index) => (
            <div key={`${day}-${index}`} style={styles.weekDay}>{day}</div>
          ))}
        </div>

        <div style={styles.monthGrid}>
          {calendarDays.map((day, index) => {
            const dateKey = day ? getDateKey(day) : null
            const daySessions = dateKey ? getSessionsByDate(dateKey) : []
            const isToday = dateKey === today

            return (
              <button
                key={index}
                type="button"
                disabled={!day}
                style={{
                  ...styles.monthDay,
                  ...(isToday ? styles.monthDayToday : {}),
                  ...(daySessions.length > 0 ? styles.monthDayWithSession : {}),
                }}
                onClick={() => dateKey && setSelectedDate(dateKey)}
              >
                {day && (
                  <>
                    <span>{day}</span>
                    {daySessions.length > 0 && (
                      <small style={styles.dayBadge}>{daySessions.length}</small>
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
                Dia {selectedDay} • {MONTH_NAMES[currentMonth]}
              </h2>
              <button type="button" style={styles.popupClose} onClick={() => setSelectedDate(null)}>
                Fechar
              </button>
            </div>
            <div style={styles.popupBody}>
              {selectedSessions.length === 0 && (
                <p style={styles.cardDescription}>Nenhum agendamento neste dia.</p>
              )}
              {selectedSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={{ ...session, reminderSent: hasAutomaticReminderSent(session) }}
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
          onSubmit={editingSessionId ? handleUpdateSession : handleCreateSession}
        />
      )}

      <Footer />
    </main>
  )
}

export default AgendaScreen

