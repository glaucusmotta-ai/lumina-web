import { useEffect, useMemo, useState } from 'react'

import Topbar from '../components/Topbar'
import { agendaSessions } from '../data/agendaSessions'
import { styles } from '../styles/dashboardStyles'
import { hasScheduleConflict } from '../services/scheduleService'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const initialForm = {
  cliente: '',
  servico: '',
  date: '2026-06-16',
  horario: '',
  telefone: '',
  email: '',
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
    const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1)

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

    if (hasScheduleConflict({
      date: form.date,
      horario: form.horario,
    })) {
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
      status: 'Confirmada',
    }

    setSessions((currentSessions) => [...currentSessions, newSession])
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
    })
    setIsCreateOpen(true)
  }

  function handleUpdateSession() {
    if (!form.cliente || !form.servico || !form.date || !form.horario) {
      alert('Preencha cliente, serviço, data e horário.')
      return
    }

    if (hasScheduleConflict({
      date: form.date,
      horario: form.horario,
      ignoreSessionId: editingSessionId,
    })) {
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
                <div key={session.id} style={styles.sessionItem}>
                  <h3 style={styles.sessionClient}>
                    {session.horario} • {session.cliente}
                  </h3>

                  <p style={styles.sessionText}>
                    Serviço: {session.servico}
                  </p>

                  <p style={styles.sessionText}>
                    WhatsApp: {session.telefone || 'Não informado'}
                  </p>

                  <p style={styles.sessionText}>
                    E-mail: {session.email || 'Não informado'}
                  </p>

                  <div style={styles.sessionActions}>
                    <button
                      type="button"
                      style={styles.buttonPrimary}
                      onClick={() => openWhatsApp(session)}
                    >
                      WhatsApp
                    </button>

                    <button
                      type="button"
                      style={styles.buttonSecondary}
                      onClick={() => openEmail(session)}
                    >
                      E-mail
                    </button>

                    <button
                      type="button"
                      style={styles.buttonSecondary}
                      onClick={() => handleStartEdit(session)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      style={styles.buttonDanger}
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isCreateOpen && (
        <section style={styles.popupOverlay}>
          <div style={styles.popup}>
            <div style={styles.popupHeader}>
              <h2 style={styles.popupTitle}>
                {editingSessionId ? 'Editar agendamento' : 'Novo agendamento'}
              </h2>

              <button
                type="button"
                style={styles.popupClose}
                onClick={closeCreateModal}
              >
                Fechar
              </button>
            </div>

            <div style={styles.popupBody}>
              <div style={styles.formGrid}>
                <input
                  style={styles.formInput}
                  placeholder="Nome do cliente"
                  value={form.cliente}
                  onChange={(event) => handleChange('cliente', event.target.value)}
                />

                <input
                  style={styles.formInput}
                  placeholder="Serviço"
                  value={form.servico}
                  onChange={(event) => handleChange('servico', event.target.value)}
                />

                <input
                  type="date"
                  style={styles.formInput}
                  value={form.date}
                  onChange={(event) => handleChange('date', event.target.value)}
                />

                <input
                  type="time"
                  style={styles.formInput}
                  value={form.horario}
                  onChange={(event) => handleChange('horario', event.target.value)}
                />

                <input
                  style={styles.formInput}
                  placeholder="Telefone / WhatsApp"
                  value={form.telefone}
                  onChange={(event) => handleChange('telefone', event.target.value)}
                />

                <input
                  type="email"
                  style={styles.formInput}
                  placeholder="E-mail"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                />
              </div>

              <button
                type="button"
                style={styles.buttonPrimary}
                onClick={editingSessionId ? handleUpdateSession : handleCreateSession}
              >
                {editingSessionId ? 'Salvar alterações' : 'Salvar sessão'}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default AgendaScreen


