import ClientCard from './ClientCard'
import EmptyState from './EmptyState'

import { cadastroStyles as styles } from '../styles/cadastroStyles'

function ClientList({ clients, searchTerm, onEdit, onDelete }) {
  if (clients.length === 0) {
    return (
      <EmptyState
        title={searchTerm ? 'Nenhum cliente encontrado.' : 'Você ainda não possui clientes cadastrados.'}
        description={
          searchTerm
            ? 'Tente buscar por outro nome.'
            : 'Cadastre seu primeiro cliente para começar a organizar seus atendimentos.'
        }
      />
    )
  }

  return (
    <section style={styles.clientList}>
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

export default ClientList


