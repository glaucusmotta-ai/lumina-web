import useAuth from '../hooks/useAuth'

function getMessage(days) {
  if (days === 0) return 'Seu trial expira hoje!'
  if (days === 1) return 'Ultimo dia do seu trial gratuito!'
  return days + ' dias restantes no trial gratuito'
}

function getColors(days) {
  if (days <= 3) {
    return { bg: 'rgba(220,53,69,0.08)', border: 'rgba(220,53,69,0.25)', text: '#c0392b', emoji: '⚠️' }
  }
  if (days <= 7) {
    return { bg: 'rgba(255,193,7,0.12)', border: 'rgba(255,193,7,0.30)', text: '#856404', emoji: '⚠️' }
  }
  return { bg: 'rgba(214,156,170,0.12)', border: 'rgba(214,156,170,0.25)', text: '#8f4459', emoji: '🌸' }
}

function TrialBanner() {
  const { isTrial, trialDaysLeft } = useAuth()

  if (!isTrial) return null

  const colors = getColors(trialDaysLeft)

  function handleClick() {
    window.open('https://wa.me/5511999999999?text=Quero%20assinar%20o%20Lumina', '_blank')
  }

  return (
    <div style={{
      background: colors.bg,
      border: '1px solid ' + colors.border,
      borderRadius: 12,
      padding: '10px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 10,
      maxWidth: 1200,
      margin: '0 auto 20px',
    }}>
      <span style={{ fontSize: 14, color: colors.text, fontWeight: 600 }}>
        {colors.emoji} {getMessage(trialDaysLeft)}
      </span>
      <button
        type="button"
        onClick={handleClick}
        style={{
          background: colors.text,
          color: '#fff',
          borderRadius: 999,
          padding: '6px 16px',
          fontSize: 13,
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Assinar agora - R$ 59/mes
      </button>
    </div>
  )
}

export default TrialBanner

