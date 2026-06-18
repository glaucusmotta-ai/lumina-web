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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <h3 style={styles.sessionClient}>
          {session.horario} • {session.cliente}
        </h3>

        <SessionStatusBadge status={session.status} />
      </div>

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
          onClick={() => onWhatsApp(session)}
        >
          WhatsApp
        </button>

        <button
          type="button"
          style={styles.buttonSecondary}
          onClick={() => onEmail(session)}
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

