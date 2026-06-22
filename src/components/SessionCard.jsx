import SessionStatusBadge from './SessionStatusBadge'
import { styles } from '../styles/dashboardStyles'

function SessionCard({
  session,
  onWhatsApp,
  onEmail,
  onEdit,
  onDelete,
}) {
  return (
    <div style={styles.sessionItem}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 10,
        }}
      >
        <h3
          style={{
            ...styles.sessionClient,
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
          {session.horario} • {session.cliente}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <SessionStatusBadge
            status={session.status}
          />

          {session.reminderSent && (
            <SessionStatusBadge
              status="LEMBRETE_ENVIADO"
            />
          )}
        </div>
      </div>

      <p style={styles.sessionText}>
        Serviço: {session.servico}
      </p>

      <p style={styles.sessionText}>
        WhatsApp:{' '}
        {session.telefone || 'Não informado'}
      </p>

      <p style={styles.sessionText}>
        E-mail:{' '}
        {session.email || 'Não informado'}
      </p>

      <div style={styles.sessionActions}>
        <button
          type="button"
          style={styles.buttonPrimary}
          onClick={() => onWhatsApp(session)}
          disabled={!session.telefone}
        >
          WhatsApp
        </button>

        <button
          type="button"
          style={styles.buttonSecondary}
          onClick={() => onEmail(session)}
          disabled={!session.email}
        >
          E-mail
        </button>

        <button
          type="button"
          style={styles.buttonSecondary}
          onClick={() => onEdit(session)}
        >
          Editar
        </button>

        <button
          type="button"
          style={styles.buttonDanger}
          onClick={() => onDelete(session.id)}
        >
          Excluir
        </button>
      </div>
    </div>
  )
}

export default SessionCard


