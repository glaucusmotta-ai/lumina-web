import { theme } from './theme'

export const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.colors.background,
    padding: '24px',
  },

  card: {
    width: '100%',
    maxWidth: '380px',
    background: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: '32px',
    boxShadow: `0 10px 30px ${theme.colors.shadow}`,
    border: `1px solid ${theme.colors.border}`,
  },

  logo: {
    fontSize: '32px',
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: '8px',
  },

  subtitle: {
    textAlign: 'center',
    color: theme.colors.textSoft,
    marginBottom: '32px',
    fontSize: '14px',
  },

  input: {
    width: '100%',
    padding: '14px',
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    marginBottom: '16px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },

  button: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: theme.radius.md,
    background: theme.colors.primary,
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    fontSize: '15px',
  },

  secondaryButton: {
    width: '100%',
    padding: '14px',
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: '#ffffff',
    color: theme.colors.text,
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
    fontSize: '15px',
  },

    linkButton: {
    width: '100%',
    border: 'none',
    background: 'transparent',
    color: theme.colors.textSoft,
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '18px',
    fontSize: '14px',
  },

  helperText: {
    color: theme.colors.textSoft,
    fontSize: '14px',
    lineHeight: '1.5',
    textAlign: 'center',
    margin: '0 0 24px',
  },

  passwordWrapper: {
  position: 'relative',
  marginBottom: '16px',
},

passwordInput: {
  width: '100%',
  padding: '14px',
  paddingRight: '90px',
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
},

passwordToggle: {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  background: 'transparent',
  color: theme.colors.textSoft,
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '13px',
},

}


