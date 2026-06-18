import Topbar from '../components/Topbar'
import { getMetricsData } from '../services/metricsService'
import { styles } from '../styles/dashboardStyles'

const localStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 14,
    marginTop: 22,
  },
  compactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
    marginTop: 18,
  },
  card: {
    background: '#fff',
    border: '1px solid rgba(214, 156, 170, 0.18)',
    borderRadius: 20,
    padding: 16,
    boxShadow: '0 10px 24px rgba(120, 72, 86, 0.06)',
  },
  compactCard: {
    background: '#fff',
    border: '1px solid rgba(214, 156, 170, 0.16)',
    borderRadius: 18,
    padding: 14,
    boxShadow: '0 8px 18px rgba(120, 72, 86, 0.05)',
  },
  label: {
    margin: 0,
    fontSize: 12,
    color: '#9b6b78',
    fontWeight: 700,
  },
  value: {
    margin: '8px 0 4px',
    fontSize: 'clamp(22px, 2vw, 30px)',
    color: '#6f3f4d',
    fontWeight: 800,
    lineHeight: 1.1,
    wordBreak: 'break-word',
  },
  valueSmall: {
    margin: '8px 0 4px',
    fontSize: 'clamp(17px, 1.4vw, 23px)',
    color: '#6f3f4d',
    fontWeight: 800,
    lineHeight: 1.18,
    wordBreak: 'break-word',
  },
  helper: {
    margin: 0,
    fontSize: 12,
    color: '#a58a92',
    lineHeight: 1.35,
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 14,
    marginTop: 18,
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: 17,
    color: '#6f3f4d',
    fontWeight: 800,
  },
  insightList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 10,
  },
  insightItem: {
    margin: 0,
    padding: '10px 12px',
    borderRadius: 14,
    background: '#fbf3f6',
    fontSize: 13,
    color: '#7d5b64',
    lineHeight: 1.4,
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 14,
    marginTop: 18,
  },
  detailsTitle: {
    margin: '28px 0 0',
    fontSize: 15,
    color: '#9b6b78',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  chartRow: {
    display: 'grid',
    gridTemplateColumns: '110px 1fr 32px',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    fontSize: 13,
    color: '#7d5b64',
  },
  chartLabel: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    background: '#f7e8ed',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #d99aaa, #b96f83)',
  },
  emptyText: {
    margin: 0,
    fontSize: 13,
    color: '#a58a92',
    lineHeight: 1.5,
  },
}

function MetricCard({ item, compact = false }) {
  return (
    <article style={compact ? localStyles.compactCard : localStyles.card}>
      <p style={localStyles.label}>{item.label}</p>

      <h2
        style={
          item.value.length > 18
            ? localStyles.valueSmall
            : localStyles.value
        }
      >
        {item.value}
      </h2>

      <p style={localStyles.helper}>{item.helper}</p>
    </article>
  )
}

function RankingChart({ title, items, valueKey = 'total', labelKey = 'label' }) {
  const maxTotal = Math.max(
    1,
    ...items.map((item) => item[valueKey]),
  )

  return (
    <article style={localStyles.card}>
      <h2 style={localStyles.sectionTitle}>{title}</h2>

      {items.length === 0 && (
        <p style={localStyles.emptyText}>
          Ainda não há dados suficientes para este indicador.
        </p>
      )}

      {items.map((item) => (
        <div key={item[labelKey]} style={localStyles.chartRow}>
          <span style={localStyles.chartLabel}>{item[labelKey]}</span>

          <div style={localStyles.barTrack}>
            <div
              style={{
                ...localStyles.barFill,
                width: `${(item[valueKey] / maxTotal) * 100}%`,
              }}
            />
          </div>

          <strong>{item[valueKey]}</strong>
        </div>
      ))}
    </article>
  )
}

function MetricasScreen() {
  const {
    kpis,
    executiveCards,
    insights,
    originRanking,
    regionRanking,
    locationRanking,
    periodRanking,
    hourRanking,
    weeklyHistory,
    monthlyEvolution,
  } = getMetricsData()

  const mainCharts = [
    {
      title: 'Ocupação por período',
      items: periodRanking,
    },
    {
      title: 'Horário mais procurado',
      items: hourRanking.slice(0, 5),
    },
    {
      title: 'Volume semanal',
      items: weeklyHistory,
      valueKey: 'sessions',
      labelKey: 'week',
    },
    {
      title: 'Evolução mensal',
      items: monthlyEvolution,
    },
  ]

  const detailCharts = [
    {
      title: 'Origem dos clientes',
      items: originRanking,
    },
    {
      title: 'Região dos clientes',
      items: regionRanking,
    },
    {
      title: 'Local preferencial',
      items: locationRanking,
    },
  ]

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Métricas</p>

        <h1 style={styles.title}>Dashboard executivo</h1>

        <p style={styles.subtitle}>
          Visão objetiva de ocupação, horários, recorrência e evolução operacional.
        </p>
      </section>

      <section style={localStyles.grid}>
        {kpis.map((item) => (
          <MetricCard key={item.label} item={item} />
        ))}
      </section>

      <section style={localStyles.compactGrid}>
        {executiveCards.map((item) => (
          <MetricCard key={item.label} item={item} compact />
        ))}
      </section>

      <section style={localStyles.sectionGrid}>
        <article style={localStyles.card}>
          <h2 style={localStyles.sectionTitle}>Insights executivos</h2>

          <div style={localStyles.insightList}>
            {insights.map((item) => (
              <p key={item} style={localStyles.insightItem}>
                {item}
              </p>
            ))}
          </div>
        </article>
      </section>

      <section style={localStyles.chartGrid}>
        {mainCharts.map((chart) => (
          <RankingChart
            key={chart.title}
            title={chart.title}
            items={chart.items}
            valueKey={chart.valueKey}
            labelKey={chart.labelKey}
          />
        ))}
      </section>

      <h2 style={localStyles.detailsTitle}>
        Detalhes comerciais
      </h2>

      <section style={localStyles.chartGrid}>
        {detailCharts.map((chart) => (
          <RankingChart
            key={chart.title}
            title={chart.title}
            items={chart.items}
          />
        ))}
      </section>
    </main>
  )
}

export default MetricasScreen

