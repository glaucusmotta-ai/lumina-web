import Topbar from '../components/Topbar'
import { styles } from '../styles/dashboardStyles'

const kpis = [
  { label: 'Sessões no mês', value: '77', helper: '+18% vs mês anterior' },
  { label: 'Clientes ativos', value: '42', helper: 'Clientes com atendimento recente' },
  { label: 'Taxa de retorno', value: '68%', helper: 'Clientes que voltaram no período' },
  { label: 'Agendamentos futuros', value: '19', helper: 'Próximas sessões confirmadas' },
  { label: 'Taxa de confirmação', value: '82%', helper: 'Sessões confirmadas pelos clientes' },
]

const insights = [
  'Quinta-feira possui maior volume de sessões.',
  'Clientes retornaram 18% mais este mês.',
  'Horário mais procurado: 18h.',
  '82% das sessões foram confirmadas.',
]

const weeklyHistory = [
  { week: 'Semana 1', sessions: 12 },
  { week: 'Semana 2', sessions: 18 },
  { week: 'Semana 3', sessions: 21 },
  { week: 'Semana 4', sessions: 26 },
]

const localStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginTop: 24,
  },
  card: {
    background: '#fff',
    border: '1px solid rgba(214, 156, 170, 0.22)',
    borderRadius: 20,
    padding: 18,
    boxShadow: '0 12px 30px rgba(120, 72, 86, 0.08)',
  },
  label: {
    margin: 0,
    fontSize: 13,
    color: '#9b6b78',
    fontWeight: 600,
  },
  value: {
    margin: '10px 0 6px',
    fontSize: 30,
    color: '#6f3f4d',
    fontWeight: 800,
  },
  helper: {
    margin: 0,
    fontSize: 12,
    color: '#a58a92',
    lineHeight: 1.4,
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 18,
    marginTop: 22,
  },
  sectionTitle: {
    margin: '0 0 14px',
    fontSize: 18,
    color: '#6f3f4d',
    fontWeight: 800,
  },
  insightItem: {
    margin: '0 0 12px',
    fontSize: 14,
    color: '#7d5b64',
    lineHeight: 1.5,
  },
  historyRow: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 40px',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
    fontSize: 14,
    color: '#7d5b64',
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    background: '#f7e8ed',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #d99aaa, #b96f83)',
  },
}

function MetricasScreen() {
  const maxSessions = Math.max(...weeklyHistory.map((item) => item.sessions))

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Métricas</p>

        <h1 style={styles.title}>Métricas operacionais</h1>

        <p style={styles.subtitle}>
          Acompanhe desempenho, retornos e crescimento dos atendimentos.
        </p>
      </section>

      <section style={localStyles.grid}>
        {kpis.map((item) => (
          <article key={item.label} style={localStyles.card}>
            <p style={localStyles.label}>{item.label}</p>
            <h2 style={localStyles.value}>{item.value}</h2>
            <p style={localStyles.helper}>{item.helper}</p>
          </article>
        ))}
      </section>

      <section style={localStyles.sectionGrid}>
        <article style={localStyles.card}>
          <h2 style={localStyles.sectionTitle}>Insights da semana</h2>

          {insights.map((item) => (
            <p key={item} style={localStyles.insightItem}>
              • {item}
            </p>
          ))}
        </article>

        <article style={localStyles.card}>
          <h2 style={localStyles.sectionTitle}>Evolução semanal</h2>

          {weeklyHistory.map((item) => (
            <div key={item.week} style={localStyles.historyRow}>
              <span>{item.week}</span>

              <div style={localStyles.barTrack}>
                <div
                  style={{
                    ...localStyles.barFill,
                    width: `${(item.sessions / maxSessions) * 100}%`,
                  }}
                />
              </div>

              <strong>{item.sessions}</strong>
            </div>
          ))}
        </article>
      </section>
    </main>
  )
}

export default MetricasScreen


