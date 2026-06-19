import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import { styles } from '../styles/dashboardStyles'

function CampanhasScreen() {
  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>
          Campanhas
        </p>

        <h1 style={styles.title}>
          Relacionamento inteligente
        </h1>

        <p style={styles.subtitle}>
          Crie campanhas leves para fortalecer o relacionamento e aumentar retornos.
        </p>
      </section>
      <Footer />
    </main>
  )
}

export default CampanhasScreen


