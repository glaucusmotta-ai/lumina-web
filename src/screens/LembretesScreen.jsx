import ReminderCard from '../components/ReminderCard'
import Topbar from '../components/Topbar'
import useReminders from '../hooks/useReminders'
import { styles } from '../styles/dashboardStyles'
import { reminderStyles } from '../styles/reminderStyles'

function LembretesScreen() {
  const { reminders, logs, registerSend } = useReminders()

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>
          Lembretes
        </p>

        <h1 style={styles.title}>
          Comunicação automática
        </h1>

        <p style={styles.subtitle}>
          O Lumina identifica automaticamente os agendamentos do dia e prepara os disparos para clientes.
        </p>
      </section>

      <section style={reminderStyles.list}>
        {reminders.length === 0 && (
          <article style={reminderStyles.card}>
            <p style={reminderStyles.info}>
              Nenhum agendamento encontrado para hoje.
            </p>
          </article>
        )}

        {reminders.map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onSend={registerSend}
          />
        ))}
      </section>

      {logs.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h2
            style={{
              marginBottom: 16,
              color: '#5b3442',
              fontSize: 18,
            }}
          >
            Histórico de disparos
          </h2>

          <div style={reminderStyles.list}>
            {logs.map((log) => (
              <article
                key={log.id}
                style={reminderStyles.card}
              >
                <p style={reminderStyles.info}>
                  Canal: {log.channel}
                </p>

                <p style={reminderStyles.info}>
                  Destinatário: {log.recipient}
                </p>

                <p style={reminderStyles.info}>
                  Enviado em:{' '}
                  {new Date(log.sentAt).toLocaleString('pt-BR')}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default LembretesScreen


