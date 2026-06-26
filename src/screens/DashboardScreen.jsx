import DashboardCard from '../components/DashboardCard'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'

import { dashboardModules } from '../data/dashboardModules'
import { styles } from '../styles/dashboardStyles'
import TrialBanner from '../components/TrialBanner'

function DashboardScreen() {
  return (
    <main style={styles.page}>
      <TrialBanner />
      <Topbar />

      <section style={styles.header}>
        <p style={styles.kicker}>
          Facilitando seu dia a dia
        </p>

        <h1 style={styles.title}>
          Bem-vindo ao Lumina
        </h1>

        <p style={styles.subtitle}>
          Organize sua rotina com leveza, clareza e cuidado.
        </p>
      </section>

      <section style={styles.grid}>
        {dashboardModules.map((module) => (
          <DashboardCard
            key={module.id}
            title={module.title}
            description={module.description}
            path={module.path}
          />
        ))}
      </section>
      <Footer />
    </main>
  )
}

export default DashboardScreen


