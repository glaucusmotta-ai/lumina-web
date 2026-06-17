import { theme } from './theme'

export const styles = {
  page: {
    minHeight: '100vh',
    background: theme.colors.background,
    padding: '32px 20px 48px',
  },

  topbar: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.text,
  },

  logoutButton: {
    border: `1px solid ${theme.colors.border}`,
    background: '#ffffff',
    color: theme.colors.text,
    padding: '10px 18px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontWeight: '600',
  },

  header: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 32px',
  },

  kicker: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: '8px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },

  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: '12px',
    lineHeight: 1.2,
  },

  subtitle: {
    fontSize: '15px',
    color: theme.colors.textSoft,
    lineHeight: 1.6,
    maxWidth: '520px',
  },

  calendarCard: {
    width: '100%',
    maxWidth: '980px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: theme.radius.lg,
    padding: '18px',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
  },

  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },

  calendarTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: theme.colors.text,
  },

  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px',
    marginBottom: '12px',
  },

  weekDay: {
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: theme.colors.textSoft,
    padding: '8px 0',
  },

  monthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '10px',
  },

  monthDay: {
    height: '64px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    background: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '15px',
    fontWeight: '600',
    color: theme.colors.text,
    position: 'relative',
    transition: 'all 0.2s ease',
  },

  monthDayToday: {
    background: theme.colors.primary,
    color: '#ffffff',
  },

  monthDayWithSession: {
    border: `2px solid ${theme.colors.primary}`,
  },

  dayBadge: {
    position: 'absolute',
    bottom: '8px',
    fontSize: '11px',
    background: theme.colors.primarySoft,
    color: theme.colors.text,
    borderRadius: '999px',
    padding: '2px 8px',
  },

  popupOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.25)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    zIndex: 1000,
  },

  popup: {
    width: '100%',
    maxWidth: '520px',
    maxHeight: '82vh',
    background: '#ffffff',
    borderRadius: theme.radius.lg,
    padding: '0',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    overflow: 'hidden',
  },

  popupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    padding: '24px 24px 16px',
    borderBottom: `1px solid ${theme.colors.border}`,
    zIndex: 10,
  },

  popupBody: {
    maxHeight: 'calc(82vh - 88px)',
    overflowY: 'auto',
    padding: '20px 24px 24px',
  },

  popupTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: theme.colors.text,
  },

  popupClose: {
    border: 'none',
    background: theme.colors.primarySoft,
    color: theme.colors.text,
    padding: '10px 14px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontWeight: '600',
  },

  formGrid: {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '12px',
  marginBottom: '18px',
},

formInput: {
  width: '100%',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  padding: '12px 14px',
  fontSize: '14px',
  color: theme.colors.text,
  outline: 'none',
  background: '#ffffff',
},

  sessionItem: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '16px',
    marginBottom: '14px',
    background: '#ffffff',
  },

  sessionClient: {
    fontSize: '18px',
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: '10px',
  },

  sessionText: {
    fontSize: '14px',
    color: theme.colors.textSoft,
    marginBottom: '6px',
  },

  sessionActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap',
  },

  buttonPrimary: {
    border: 'none',
    background: theme.colors.primary,
    color: '#ffffff',
    padding: '10px 14px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontWeight: '700',
  },

  buttonSecondary: {
    border: `1px solid ${theme.colors.border}`,
    background: '#ffffff',
    color: theme.colors.text,
    padding: '10px 14px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontWeight: '700',
  },

  buttonDanger: {
    border: 'none',
    background: '#f4d7dc',
    color: '#8a4f5b',
    padding: '10px 14px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontWeight: '700',
  },

  grid: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
  },

  card: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '24px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
    minHeight: '170px',
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.text,
  },

  cardDescription: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: theme.colors.textSoft,
  },
}


