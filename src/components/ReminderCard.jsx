import { reminderStyles as styles } from '../styles/reminderStyles'

function ReminderCard({ reminder, onSend }) {
  const message = `Olá ${reminder.cliente}, passando para lembrar do seu agendamento hoje às ${reminder.horario}. Qualquer dúvida, estamos à disposição.`

  function handleWhatsApp() {
    const text = encodeURIComponent(message)

    window.open(
      `https://wa.me/55${reminder.telefone}?text=${text}`,
      '_blank'
    )

    onSend({
      sessionId: reminder.id,
      channel: 'whatsapp',
      recipient: reminder.telefone,
    })
  }

  function handleEmail() {
    const subject = encodeURIComponent('Lembrete de agendamento')
    const body = encodeURIComponent(message)

    window.location.href = `mailto:${reminder.email}?subject=${subject}&body=${body}`

    onSend({
      sessionId: reminder.id,
      channel: 'email',
      recipient: reminder.email,
    })
  }

  return (
    <article style={styles.card}>
      <h3 style={styles.client}>
        {reminder.cliente}
      </h3>

      <p style={styles.info}>
        Hoje às {reminder.horario}
      </p>

      <p style={styles.info}>
        Serviço: {reminder.service}
      </p>

      <p style={styles.info}>
        WhatsApp: {reminder.telefone || 'Não informado'}
      </p>

      <p style={styles.info}>
        E-mail: {reminder.email || 'Não informado'}
      </p>

      <div style={styles.actions}>
        <button
          style={styles.actionButton}
          onClick={handleWhatsApp}
          disabled={!reminder.telefone}
        >
          WhatsApp
        </button>

        <button
          style={styles.actionButton}
          onClick={handleEmail}
          disabled={!reminder.email}
        >
          E-mail
        </button>
      </div>

      <div style={styles.status}>
        Origem: Agenda • Status: {reminder.status}
      </div>
    </article>
  )
}

export default ReminderCard


