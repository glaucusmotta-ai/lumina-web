import { reminderStyles as styles } from '../styles/reminderStyles'

function formatDate(date) {
  if (!date) {
    return 'Data não informada'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function ReminderCard({ reminder, onSend }) {
  const message = `Olá ${reminder.cliente}, passando para lembrar do seu agendamento em ${formatDate(reminder.data)} às ${reminder.horario}. Qualquer dúvida, estamos à disposição.`

  async function handleWhatsApp() {
    await onSend({
      sessionId: reminder.id,
      channel: 'whatsapp',
      recipient: reminder.telefone,
    })

    const text = encodeURIComponent(message)

    window.open(
      `https://wa.me/55${reminder.telefone}?text=${text}`,
      '_blank',
    )
  }

  async function handleEmail() {
    const result = await onSend({
      sessionId: reminder.id,
      channel: 'email_manual',
      recipient: reminder.email,
    })

    if (!result) {
      alert('Falha ao enviar e-mail.')
      return
    }

    alert(
      'Lembrete enviado por e-mail com sucesso.',
    )
  }
  return (
    <article style={styles.card}>
      <h3 style={styles.client}>
        {reminder.cliente}
      </h3>

      <p style={styles.info}>
        Data: {formatDate(reminder.data)} • Horário: {reminder.horario}
      </p>

      <div style={styles.actions}>
        <button
          type="button"
          style={styles.actionButton}
          onClick={handleWhatsApp}
          disabled={!reminder.telefone}
        >
          Abrir WhatsApp
        </button>

        <button
          type="button"
          style={styles.actionButton}
          onClick={handleEmail}
          disabled={!reminder.email}
        >
          E-mail manual
        </button>
      </div>
    </article>
  )
}

export default ReminderCard

