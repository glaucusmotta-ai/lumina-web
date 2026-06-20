export const reminderStyles = {
  list: {
    marginTop: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
    alignItems: 'start',
  },

  card: {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '18px',
    border: '1px solid rgba(214, 156, 170, 0.18)',
    boxShadow: '0 10px 24px rgba(120, 72, 86, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minHeight: '100%',
  },

  client: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 700,
    color: '#4b2e38',
    lineHeight: 1.2,
  },

  info: {
    margin: 0,
    fontSize: '14px',
    color: '#8c6a75',
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },

  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap',
  },

  actionButton: {
    border: 'none',
    borderRadius: '12px',
    padding: '10px 14px',
    cursor: 'pointer',
    background: '#f4d9e1',
    color: '#5b3442',
    fontWeight: 600,
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },

  status: {
    marginTop: 'auto',
    paddingTop: '12px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#9b6b78',
  },

    compactList: {
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px',
  },

  compactCard: {
    background: '#ffffff',
    borderRadius: '14px',
    padding: '12px 14px',
    border: '1px solid rgba(214, 156, 170, 0.16)',
    boxShadow: '0 8px 18px rgba(120, 72, 86, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    color: '#8c6a75',
    fontSize: '13px',
  },

  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '6px',
    },

    badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.2px',
    },

    badgeSuccess: {
    background: 'rgba(95, 184, 138, 0.16)',
    color: '#2d7a52',
    },

    badgeError: {
    background: 'rgba(220, 93, 93, 0.14)',
    color: '#b54747',
    },

    badgeAutomatic: {
    background: 'rgba(91, 114, 184, 0.14)',
    color: '#4257a6',
    },

    badgeManual: {
    background: 'rgba(154, 103, 184, 0.14)',
    color: '#7a4ca0',
    },

    badgeOffset: {
    background: 'rgba(214, 156, 170, 0.16)',
    color: '#8a5364',
  },

}


