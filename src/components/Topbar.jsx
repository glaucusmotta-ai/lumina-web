import { useNavigate } from 'react-router-dom'

import useAuth from '../hooks/useAuth'
import { styles } from '../styles/dashboardStyles'

function Topbar({ variant = 'logout' }) {
  const navigate = useNavigate()
  const { session, logout } = useAuth()

  function handleClick() {
    if (variant === 'back') {
      navigate('/dashboard')
      return
    }

    logout()
    window.location.href = '/'
  }

  return (
    <header style={styles.topbar}>
      <div>
        <div style={styles.brand}>
          Lumina
        </div>

        {session?.nome && (
          <div style={styles.sessionInfo}>
            {session.nome}
          </div>
        )}
      </div>

      <button
        type="button"
        style={styles.logoutButton}
        onClick={handleClick}
      >
        {variant === 'back' ? 'Voltar' : 'Sair'}
      </button>
    </header>
  )
}

export default Topbar


