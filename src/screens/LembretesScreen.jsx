// src/screens/LembretesScreen.jsx
import { useEffect, useState } from 'react'

import ReminderCard from '../components/ReminderCard'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import { getTodayReminderItems, getReminderApiLogs, sendReminder } from '../services/api/reminderApi'
import { styles } from '../styles/dashboardStyles'
import { reminderStyles } from '../styles/reminderStyles'

function getTodayString() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(date) {
  if (!date) return 'Data não informada'
  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function getLogText(log) {
  const time = log.sentAt
    ? new Date(log.sentAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '--:--'

  const channelLabelMap = {
    email_cliente: 'E-mail Cliente',
    email_usuario: 'E-mail Profissional',
    whatsapp: 'WhatsApp',
    email_manual: 'E-mail Manual',
    email: 'E-mail',
  }
  const statusLabelMap = { sent: 'Enviado', error: 'Erro' }
  const typeLabelMap = { automatico: 'Automático', manual: 'Manual' }
  const offsetLabelMap = { 60: '1 hora antes', 15: '15 minutos antes' }

  return {
    cliente: log.cliente,
    service: log.service,
    horario: log.horario,
    channel: channelLabelMap[log.channel] || log.channel,
    status: statusLabelMap[log.status] || log.status,
    type: typeLabelMap[log.type] || log.type,
    offset: offsetLabelMap[log.offsetMinutes] || (log.type === 'manual' ? 'Manual' : '--'),
    recipient: log.recipient,
    time,
  }
}

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
    service: log.servico || 'Atendimento',
    data: log.data || '',
    horario: log.horario || '',
    channel: log.canal || '',
    recipient: log.destinatario || '',
    type: log.tipo || 'manual',
    offsetMinutes: log.reminder_offset_minutes || null,
    status: log.status || '',
    sentAt: log.sent_at || '',
  }
}

function LembretesScreen() {
  const today = getTodayString()
  const [selectedDate, setSelectedDate] = useState(today)
  const [reminders, setReminders] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const apiReminders = await getTodayReminderItems(selectedDate)
        setReminders(apiReminders.map(normalizeReminder))
      } catch (error) {
        alert(error.message)
        setReminders([])
      } finally {
        setLoading(false)
      }

      try {
        const apiLogs = await getReminderApiLogs()
        setLogs(apiLogs.map(normalizeLog))
      } catch {
        setLogs([])
      }
    }
    load()
  }, [selectedDate])

  async function registerSend({ sessionId, channel, recipient }) {
    try {
      await sendReminder({ session_id: sessionId })
      setLogs((prev) => [{
        id: `manual-${Date.now()}`,
        sessionId,
        cliente: '',
        service: 'Atendimento',
        data: today,
        horario: '',
        channel,
        recipient,
        type: 'manual',
        offsetMinutes: null,
        status: 'sent',
        sentAt: new Date().toISOString(),
      }, ...prev])
    } catch (error) {
      alert(error.message)
    }
  }

  const logsForDate = logs.filter(
    (log) => log.sentAt && log.sentAt.slice(0, 10) === selectedDate,
  )

  const inputStyle = {
    border: '1.5px solid #f1dede',
    borderRadius: 12,
    padding: '8px 14px',
    fontSize: 14,
    color: '#4b3d3d',
    background: '#fff',
    cursor: 'pointer',
  }

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Lembretes</p>
        <h1 style={styles.title}>Comunicação automática</h1>
        <p style={styles.subtitle}>
          Disparos previstos para {formatDate(selectedDate)}.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <label style={{ fontSize: 14, color: '#7a6d6d', fontWeight: 600 }}>
            Ver data:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={inputStyle}
          />
          {selectedDate !== today && (
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              style={{
                ...inputStyle,
                background: 'rgba(214,156,170,0.16)',
                color: '#8f4459',
                fontWeight: 700,
                border: 'none',
              }}
            >
              Hoje
            </button>
          )}
        </div>
      </section>

      <section style={reminderStyles.list}>
        {loading && (
          <article style={reminderStyles.card}>
            <p style={reminderStyles.info}>Carregando...</p>
          </article>
        )}

        {!loading && reminders.length === 0 && (
          <article style={reminderStyles.card}>
            <p style={reminderStyles.info}>
              Nenhum agendamento encontrado para {formatDate(selectedDate)}.
            </p>
          </article>
        )}

        {!loading && [...reminders]
          .sort((a, b) => a.horario.localeCompare(b.horario))
          .map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} onSend={registerSend} />
          ))}
      </section>

      {logsForDate.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <button
            type="button"
            style={reminderStyles.actionButton}
            onClick={() => setShowLogs((c) => !c)}
          >
            {showLogs
              ? 'Ocultar histórico'
              : `Ver histórico de ${formatDate(selectedDate)} (${logsForDate.length})`}
          </button>

          {showLogs && (
            <div style={reminderStyles.compactList}>
              {logsForDate.map((log) => {
                const item = getLogText(log)
                return (
                  <article key={log.id} style={reminderStyles.compactCard}>
                    <strong>{item.cliente}</strong>
                    <span>{item.service}</span>
                    <span>{item.channel}</span>
                    <div style={reminderStyles.badgeRow}>
                      <span style={{ ...reminderStyles.badge, ...(item.status === 'Enviado' ? reminderStyles.badgeSuccess : reminderStyles.badgeError) }}>
                        {item.status}
                      </span>
                      <span style={{ ...reminderStyles.badge, ...(item.type === 'Automático' ? reminderStyles.badgeAutomatic : reminderStyles.badgeManual) }}>
                        {item.type}
                      </span>
                      <span style={{ ...reminderStyles.badge, ...reminderStyles.badgeOffset }}>
                        {item.offset}
                      </span>
                    </div>
                    <span>Destinatário: {item.recipient}</span>
                    <small>Sessão: {item.horario} • Disparo: {item.time}</small>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      )}

      <Footer />
    </main>
  )
}

export default LembretesScreen

