import { cadastroStyles as styles } from '../styles/cadastroStyles'

function formatDate(date) {
  if (!date) {
    return 'Não informado'
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString('pt-BR')
}

function ClientCard({ client, onEdit, onDelete }) {
  return (
    <article style={styles.clientCard}>
      <div style={styles.clientHeader}>
        <div>
          <h3 style={styles.clientName}>{client.nome}</h3>
          <p style={styles.clientContact}>
            {client.telefone || 'Telefone não informado'}
          </p>
        </div>

        <span style={styles.clientBadge}>
          {client.origemCliente || 'Cliente'}
        </span>
      </div>

      <div style={styles.clientHighlight}>
        <p style={styles.clientHighlightText}>
          <strong>Próxima sessão:</strong>{' '}
          {formatDate(client.proximaSessao)}
          {client.horarioProximaSessao
            ? ` às ${client.horarioProximaSessao}`
            : ''}
        </p>
      </div>

      <div style={styles.clientInfoGrid}>
        <p style={styles.clientInfo}>
          <strong>WhatsApp:</strong> {client.whatsapp || 'Não informado'}
        </p>

        <p style={styles.clientInfo}>
          <strong>E-mail:</strong> {client.email || 'Não informado'}
        </p>

        <p style={styles.clientInfo}>
          <strong>Nascimento:</strong> {formatDate(client.dataNascimento)}
        </p>

        <p style={styles.clientInfo}>
          <strong>Última sessão:</strong> {formatDate(client.ultimaSessao)}
        </p>

        <p style={styles.clientInfo}>
          <strong>Região:</strong> {client.regiao || 'Não informado'}
        </p>

        <p style={styles.clientInfo}>
          <strong>Local:</strong> {client.localAtendimento || 'Não informado'}
        </p>
      </div>

      {client.observacoes && (
        <p style={styles.clientNotes}>
          {client.observacoes}
        </p>
      )}

      <div style={styles.clientActions}>
        <button
          type="button"
          style={styles.buttonSecondary}
          onClick={() => onEdit(client)}
        >
          Editar
        </button>

        <button
          type="button"
          style={styles.buttonDanger}
          onClick={() => onDelete(client.id)}
        >
          Excluir
        </button>
      </div>
    </article>
  )
}

export default ClientCard


