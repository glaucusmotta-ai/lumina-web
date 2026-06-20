import { useState } from 'react'

import ReminderCard from '../components/ReminderCard'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import useReminders from '../hooks/useReminders'
import { styles } from '../styles/dashboardStyles'
import { reminderStyles } from '../styles/reminderStyles'

function formatDate(date) {
  if (!date) {
    return 'Data não informada'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function getReminderDate(reminders) {
  return reminders[0]?.data || new Date().toISOString().slice(0, 10)
}

function getLogDate(log) {
  if (!log.sentAt) {
    return ''
  }

  return new Date(log.sentAt).toISOString().slice(0, 10)
}

function getLogText(log) {
  const time = log.sentAt
    ? new Date(log.sentAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--'

  const channelLabelMap = {
    email_cliente: 'E-mail Cliente',
    email_usuario: 'E-mail Profissional',
    whatsapp: 'WhatsApp',
    email_manual: 'E-mail Manual',
    email: 'E-mail',
  }

  const statusLabelMap = {
    sent: 'Enviado',
    error: 'Erro',
  }

  const typeLabelMap = {
    automatico: 'Automático',
    manual: 'Manual',
  }

  const offsetLabelMap = {
    60: '1 hora antes',
    15: '15 minutos antes',
  }

  const channel =
    channelLabelMap[log.channel] || log.channel

  const status =
    statusLabelMap[log.status] || log.status

  const type =
    typeLabelMap[log.type] || log.type

  const offset =
    offsetLabelMap[log.offsetMinutes] ||
    (log.type === 'manual' ? 'Manual' : '--')

  return {
    cliente: log.cliente,
    service: log.service,
    horario: log.horario,
    channel,
    status,
    type,
    offset,
    recipient: log.recipient,
    time,
  }
}

function LembretesScreen() {
  const { reminders, logs, registerSend } = useReminders()
  const [showLogs, setShowLogs] = useState(false)

  const reminderDate = getReminderDate(reminders)
  const logsFromReminderDate = logs.filter(
    (log) => getLogDate(log) === reminderDate,
  )

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Lembretes</p>

        <h1 style={styles.title}>Comunicação automática</h1>

        <p style={styles.subtitle}>
          Disparos previstos para {formatDate(reminderDate)}.
        </p>
      </section>

      <section style={reminderStyles.list}>
        {reminders.length === 0 && (
          <article style={reminderStyles.card}>
            <p style={reminderStyles.info}>
              Nenhum agendamento encontrado para {formatDate(reminderDate)}.
            </p>
          </article>
        )}

        {[...reminders]
          .sort((a, b) => a.horario.localeCompare(b.horario))
          .map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onSend={registerSend}
          />
        ))}
      </section>

      {logsFromReminderDate.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <button
            type="button"
            style={reminderStyles.actionButton}
            onClick={() => setShowLogs((current) => !current)}
          >
            {showLogs
              ? 'Ocultar histórico'
              : `Ver histórico de ${formatDate(reminderDate)} (${logsFromReminderDate.length})`}
          </button>

          {showLogs && (
            <div style={reminderStyles.compactList}>
              {logsFromReminderDate.map((log) => (
                <article
                  key={log.id}
                  style={reminderStyles.compactCard}
                >
                  {(() => {
                    const item = getLogText(log)

                    return (
                      <>
                        <strong>
                          {item.cliente}
                        </strong>

                        <span>
                          {item.service}
                        </span>

                        <span>
                          {item.channel}
                        </span>

                        <div style={reminderStyles.badgeRow}>
                        <span
                          style={{
                            ...reminderStyles.badge,
                            ...(item.status === 'Enviado'
                              ? reminderStyles.badgeSuccess
                              : reminderStyles.badgeError),
                          }}
                        >
                          {item.status}
                        </span>

                        <span
                          style={{
                            ...reminderStyles.badge,
                            ...(item.type === 'Automático'
                              ? reminderStyles.badgeAutomatic
                              : reminderStyles.badgeManual),
                          }}
                        >
                          {item.type}
                        </span>

                        <span
                          style={{
                            ...reminderStyles.badge,
                            ...reminderStyles.badgeOffset,
                          }}
                        >
                          {item.offset}
                        </span>
                      </div>

                        <span>
                          Destinatário: {item.recipient}
                        </span>

                        <small>
                          Sessão: {item.horario} • Disparo: {item.time}
                        </small>
                      </>
                    )
                  })()}
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      <Footer />
    </main>
  )
}

export default LembretesScreen

