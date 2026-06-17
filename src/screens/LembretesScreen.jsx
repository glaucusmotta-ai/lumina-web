import Topbar from '../components/Topbar'
import { styles } from '../styles/dashboardStyles'

function LembretesScreen() {
  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>
          Lembretes
        </p>

        <h1 style={styles.title}>
          Comunicação com clientes
        </h1>

        <p style={styles.subtitle}>
          Gerencie lembretes automáticos por WhatsApp e e-mail com leveza e organização.
        </p>
      </section>
    </main>
  )
}

export default LembretesScreen

