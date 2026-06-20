import { useNavigate } from 'react-router-dom'

import { styles } from '../styles/dashboardStyles'

function DashboardCard({ title, description, path }) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(path)
  }

  return (
    <button
      type="button"
      style={styles.card}
      onClick={handleClick}
    >
      <div style={styles.cardContent}>
        <h2 style={styles.cardTitle}>
          {title}
        </h2>

        <p style={styles.cardDescription}>
          {description}
        </p>
      </div>
    </button>
  )
}

export default DashboardCard


