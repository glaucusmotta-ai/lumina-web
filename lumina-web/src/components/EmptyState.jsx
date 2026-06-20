import { cadastroStyles as styles } from '../styles/cadastroStyles'

function EmptyState({ title, description }) {
  return (
    <div style={styles.emptyState}>
      <p style={styles.emptyTitle}>{title}</p>
      <p style={styles.emptyDescription}>{description}</p>
    </div>
  )
}

export default EmptyState

