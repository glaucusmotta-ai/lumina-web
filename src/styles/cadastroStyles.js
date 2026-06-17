import { theme } from './theme'

export const cadastroStyles = {
  page: {
    minHeight: '100vh',
    background: theme.colors.background,
    padding: '32px 20px 48px',
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
    maxWidth: '620px',
  },

  contentGrid: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 420px) minmax(0, 1fr)',
    gap: '20px',
    alignItems: 'start',
  },

  formCard: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '22px',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
  },

  formHeader: {
    marginBottom: '18px',
  },

  formTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: '8px',
  },

  formSubtitle: {
    fontSize: '14px',
    color: theme.colors.textSoft,
    lineHeight: 1.5,
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
  },

  input: {
    width: '100%',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '12px 14px',
    fontSize: '14px',
    color: theme.colors.text,
    outline: 'none',
    background: '#ffffff',
    boxSizing: 'border-box',
  },

  textarea: {
    width: '100%',
    minHeight: '96px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '12px 14px',
    fontSize: '14px',
    color: theme.colors.text,
    outline: 'none',
    background: '#ffffff',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },

  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '18px',
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

  listHeader: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '18px',
    marginBottom: '14px',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: '6px',
  },

  sectionSubtitle: {
    fontSize: '14px',
    color: theme.colors.textSoft,
  },

  searchWrapper: {
    marginBottom: '14px',
  },

  searchInput: {
    width: '100%',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '12px 14px',
    fontSize: '14px',
    color: theme.colors.text,
    outline: 'none',
    background: '#ffffff',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
    boxSizing: 'border-box',
  },

  clientList: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '14px',
  },

  clientCard: {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '18px',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
  },

  clientHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },

  clientName: {
    fontSize: '18px',
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: '6px',
  },

  clientContact: {
    fontSize: '14px',
    color: theme.colors.textSoft,
  },

  clientBadge: {
    background: theme.colors.primarySoft,
    color: theme.colors.text,
    borderRadius: '999px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },

  clientInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '8px 14px',
    marginBottom: '12px',
  },

  clientInfo: {
    fontSize: '13px',
    color: theme.colors.textSoft,
    lineHeight: 1.5,
  },

  clientNotes: {
    fontSize: '14px',
    color: theme.colors.text,
    lineHeight: 1.6,
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '12px',
    marginTop: '10px',
  },

  clientActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '14px',
    flexWrap: 'wrap',
  },

  emptyState: {
    background: theme.colors.surface,
    border: `1px dashed ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '28px',
    textAlign: 'center',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
  },

  emptyTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: '8px',
  },

  emptyDescription: {
    fontSize: '14px',
    color: theme.colors.textSoft,
    lineHeight: 1.6,
  },

  actionPanel: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 22px',
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '18px',
    boxShadow: `0 8px 24px ${theme.colors.shadow}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },

  actionBar: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },

  actionButton: {
    border: `1px solid ${theme.colors.border}`,
    background: '#ffffff',
    color: theme.colors.text,
    padding: '11px 16px',
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
  },

  actionButtonActive: {
    border: 'none',
    background: theme.colors.primary,
    color: '#ffffff',
  },

  totalInfo: {
    fontSize: '14px',
    color: theme.colors.textSoft,
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '11px 16px',
  },

  singleColumn: {
    width: '100%',
    maxWidth: '980px',
    margin: '0 auto',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },

  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: theme.colors.textSoft,
    marginLeft: '4px',
  },

  scheduleRow: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
    gap: '12px',
    alignItems: 'end',
  },

  select: {
    width: '100%',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '12px 14px',
    fontSize: '14px',
    color: theme.colors.text,
    outline: 'none',
    background: '#ffffff',
    boxSizing: 'border-box',
  },

  formSection: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: '16px',
    background: theme.colors.background,
  },

  formSectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: '12px',
  },

    nameBirthRow: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 0.6fr',
    gap: '12px',
    alignItems: 'end',
  },

  compactRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px',
  },

    clientHighlight: {
    background: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    padding: '12px 14px',
    marginBottom: '14px',
  },

  clientHighlightText: {
    fontSize: '14px',
    color: theme.colors.text,
    lineHeight: 1.5,
  },

}


