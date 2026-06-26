import useAuth from '../hooks/useAuth'
import Footer from '../components/Footer'

function TrialExpiredScreen() {
  const { session, logout } = useAuth()

  function handleAssinar() {
    window.open('https://wa.me/5511999999999?text=Quero%20assinar%20o%20Lumina', '_blank')
  }

  const pageStyle = {
    minHeight: '100vh',
    background: '#fffaf9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    boxSizing: 'border-box',
  }

  const cardStyle = {
    background: '#fff',
    borderRadius: 24,
    padding: '48px 40px',
    maxWidth: 480,
    width: '100%',
    boxShadow: '0 8px 40px rgba(120,72,86,0.10)',
    border: '1px solid rgba(214,156,170,0.24)',
    textAlign: 'center',
  }

  const planBoxStyle = {
    background: 'rgba(214,156,170,0.08)',
    borderRadius: 16,
    padding: '24px',
    marginBottom: 32,
    border: '1px solid rgba(214,156,170,0.20)',
  }

  const primaryBtnStyle = {
    display: 'block',
    width: '100%',
    background: '#d69caa',
    color: '#fff',
    borderRadius: 999,
    padding: '14px 24px',
    fontWeight: 800,
    fontSize: 15,
    border: 'none',
    cursor: 'pointer',
    marginBottom: 12,
  }

  const secondaryBtnStyle = {
    border: 'none',
    background: 'transparent',
    color: '#9b6b78',
    fontSize: 14,
    cursor: 'pointer',
    fontWeight: 600,
  }

  const nome = session && session.nome ? session.nome.split(' ')[0] : ''

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#3d2b2b', marginBottom: 8 }}>
          Seu periodo gratuito encerrou
        </h1>

        <p style={{ fontSize: 15, color: '#7a6d6d', lineHeight: 1.6, marginBottom: 32 }}>
          Ola, {nome}! Seus 14 dias de trial chegaram ao fim.
          Para continuar usando o Lumina, escolha um plano.
        </p>

        <div style={planBoxStyle}>
          <p style={{ fontSize: 13, color: '#9b6b78', fontWeight: 700, marginBottom: 4 }}>
            PLANO ESSENCIAL
          </p>
          <p style={{ fontSize: 36, fontWeight: 900, color: '#6f3446', margin: '8px 0' }}>
            R$ 59
            <span style={{ fontSize: 16, fontWeight: 600 }}>/mes</span>
          </p>
          <p style={{ fontSize: 13, color: '#7a6d6d', lineHeight: 1.6 }}>
            Clientes ilimitados · Agenda completa
            Lembretes automaticos · Metricas · Campanhas
          </p>
        </div>

        <button type="button" onClick={handleAssinar} style={primaryBtnStyle}>
          Quero assinar - R$ 59/mes
        </button>

        <button type="button" onClick={logout} style={secondaryBtnStyle}>
          Sair da conta
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default TrialExpiredScreen

