import { SESSION_STATUS } from '../services/scheduleService'

const statusStyles = {
  [SESSION_STATUS.CONFIRMADA]: {
    background: '#e8f7ee',
    color: '#2f7a4f',
  },

  [SESSION_STATUS.PENDENTE]: {
    background: '#fff5df',
    color: '#a06b00',
  },

  [SESSION_STATUS.CANCELADA]: {
    background: '#fdeaea',
    color: '#b54747',
  },

  [SESSION_STATUS.FINALIZADA]: {
    background: '#ecebff',
    color: '#5a4bb7',
  },
}

const baseStyle = {
  padding: '6px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: 'nowrap',
}

function SessionStatusBadge({ status }) {
  return (
    <span
      style={{
        ...baseStyle,
        ...(statusStyles[status] || statusStyles[SESSION_STATUS.PENDENTE]),
      }}
    >
      {status}
    </span>
  )
}

export default SessionStatusBadge


