import { SESSION_STATUS } from '../services/scheduleService'

const statusStyles = {
  [SESSION_STATUS.CONFIRMADA]: {
    background: 'rgba(95, 184, 138, 0.16)',
    color: '#2d7a52',
    border: '1px solid rgba(95, 184, 138, 0.24)',
    label: 'Confirmada',
  },

  [SESSION_STATUS.PENDENTE]: {
    background: 'rgba(255, 213, 102, 0.18)',
    color: '#a06b00',
    border: '1px solid rgba(255, 213, 102, 0.28)',
    label: 'Pendente',
  },

  [SESSION_STATUS.CANCELADA]: {
    background: 'rgba(220, 93, 93, 0.14)',
    color: '#b54747',
    border: '1px solid rgba(220, 93, 93, 0.22)',
    label: 'Cancelada',
  },

  [SESSION_STATUS.FINALIZADA]: {
    background: 'rgba(115, 103, 240, 0.14)',
    color: '#5a4bb7',
    border: '1px solid rgba(115, 103, 240, 0.22)',
    label: 'Finalizada',
  },

  PRESENCA_CONFIRMADA: {
    background: 'rgba(73, 182, 214, 0.14)',
    color: '#23748d',
    border: '1px solid rgba(73, 182, 214, 0.22)',
    label: 'Presença confirmada',
  },

  LEMBRETE_ENVIADO: {
    background: 'rgba(214, 156, 170, 0.16)',
    color: '#8a5364',
    border: '1px solid rgba(214, 156, 170, 0.22)',
    label: 'Lembrete enviado',
  },
}

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5px 10px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  whiteSpace: 'nowrap',
  letterSpacing: '0.2px',
  transition: 'all 0.2s ease',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: 1,
}

function SessionStatusBadge({ status }) {
  const currentStatus =
    statusStyles[status] ||
    statusStyles[SESSION_STATUS.PENDENTE]

  return (
    <span
      style={{
        ...baseStyle,
        background: currentStatus.background,
        color: currentStatus.color,
        border: currentStatus.border,
      }}
    >
      {currentStatus.label}
    </span>
  )
}

export default SessionStatusBadge


