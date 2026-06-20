function Footer() {
  return (
    <footer
      style={{
        marginTop: 48,
        paddingTop: 24,
        paddingBottom: 18,
        borderTop: '1px solid rgba(214, 156, 170, 0.16)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: '#9b6b78',
          fontWeight: 600,
          letterSpacing: '0.2px',
        }}
      >
        Powered by 3G Brasil
      </p>

      <p
        style={{
          margin: '6px 0 0',
          fontSize: 12,
          color: '#b08994',
        }}
      >
        comercial@3g-brasil.com
      </p>
    </footer>
  )
}

export default Footer

