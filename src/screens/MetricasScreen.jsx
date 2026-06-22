import { useEffect, useState } from 'react'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import { getMetricsData } from '../services/metricsService'
import { styles } from '../styles/dashboardStyles'

const localStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginTop: 24,
  },
  sectionShell: {
    marginTop: 26,
    display: 'grid',
    gap: 18,
  },
  accordion: {
    background: '#fff',
    border: '1px solid rgba(214, 156, 170, 0.24)',
    borderRadius: 26,
    boxShadow: '0 18px 42px rgba(120, 72, 86, 0.08)',
    overflow: 'hidden',
  },
  accordionButton: {
    width: '100%',
    border: 'none',
    background: 'linear-gradient(135deg, rgba(255,255,255,1), rgba(253, 246, 248, 1))',
    padding: '22px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
    cursor: 'pointer',
    textAlign: 'left',
  },
  accordionTitleBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  accordionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(214, 156, 170, 0.18)',
    color: '#8f4459',
    fontSize: 22,
    flexShrink: 0,
  },
  accordionTitle: {
    margin: 0,
    color: '#6f3446',
    fontSize: 20,
    fontWeight: 800,
  },
  accordionSubtitle: {
    margin: '4px 0 0',
    color: '#9b6b78',
    fontSize: 14,
    lineHeight: 1.5,
  },
  chevron: {
    width: 38,
    height: 38,
    borderRadius: 14,
    display: 'grid',
    placeItems: 'center',
    background: '#fff',
    color: '#8f4459',
    boxShadow: '0 10px 22px rgba(120, 72, 86, 0.08)',
    fontSize: 18,
    fontWeight: 900,
    transition: 'transform 180ms ease',
    flexShrink: 0,
  },
  content: {
    padding: 24,
    display: 'grid',
    gap: 22,
    animation: 'fadeInContent 220ms ease',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: 18,
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 18,
  },
  card: {
    background: '#fff',
    border: '1px solid rgba(214, 156, 170, 0.22)',
    borderRadius: 22,
    padding: 20,
    boxShadow: '0 12px 30px rgba(120, 72, 86, 0.07)',
    transition: 'transform 180ms ease, box-shadow 180ms ease',
  },
  label: {
    margin: 0,
    fontSize: 13,
    color: '#9b6b78',
    fontWeight: 700,
  },
  value: {
    margin: '8px 0 0',
    fontSize: 28,
    color: '#6f3446',
    fontWeight: 900,
  },
  description: {
    margin: '8px 0 0',
    color: '#9b6b78',
    fontSize: 14,
    lineHeight: 1.55,
  },
  barRow: {
    marginTop: 14,
  },
  barTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    fontSize: 13,
    color: '#6f3446',
    fontWeight: 700,
  },
  barTrack: {
    marginTop: 8,
    height: 10,
    borderRadius: 999,
    background: 'rgba(214, 156, 170, 0.16)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    background: 'linear-gradient(90deg, #d69caa, #8f4459)',
    transition: 'width 700ms ease',
  },
  loading: {
    marginTop: 30,
    color: '#9b6b78',
    fontWeight: 700,
  },
}

function MetricCard({ metric }) {
  return (
    <article style={localStyles.card}>
      <p style={localStyles.label}>{metric.label}</p>

      <h3 style={localStyles.value}>{metric.value}</h3>

      {metric.helper && (
        <p style={localStyles.description}>{metric.helper}</p>
      )}
    </article>
  )
}

function ExpandableRankingChart({ chart }) {
  const [expanded, setExpanded] = useState(false)
  const [animateBars, setAnimateBars] = useState(false)

  const data = expanded ? chart.data : chart.data.slice(0, 5)
  const maxValue = Math.max(...chart.data.map((item) => Number(item.value) || 0), 1)

  useEffect(() => {
    setAnimateBars(false)

    const timer = setTimeout(() => {
      setAnimateBars(true)
    }, 80)

    return () => clearTimeout(timer)
  }, [chart.title, expanded])

  return (
    <article style={localStyles.card}>
      <p style={localStyles.label}>{chart.title}</p>

      {data.map((item) => {
        const value = Number(item.value) || 0
        const width = `${Math.max((value / maxValue) * 100, 4)}%`

        return (
          <div key={item.label} style={localStyles.barRow}>
            <div style={localStyles.barTop}>
              <span>{item.label}</span>
              <span>{value}</span>
            </div>

            <div style={localStyles.barTrack}>
              <div
                style={{
                  ...localStyles.barFill,
                  width: animateBars ? width : '0%',
                }}
              />
            </div>
          </div>
        )
      })}

      {chart.data.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          style={{
            marginTop: 16,
            border: 'none',
            background: 'rgba(214, 156, 170, 0.16)',
            color: '#8f4459',
            borderRadius: 999,
            padding: '9px 14px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {expanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </article>
  )
}

function MetricasScreen() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openInsights, setOpenInsights] = useState(true)
  const [openCharts, setOpenCharts] = useState(false)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getMetricsData()
        setMetrics(data)
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadMetrics()
  }, [])

  if (loading) {
    return (
      <main style={styles.page}>
        <Topbar variant="back" />
        <p style={localStyles.loading}>Carregando métricas...</p>
        <Footer />
      </main>
    )
  }

  if (!metrics) {
    return (
      <main style={styles.page}>
        <Topbar variant="back" />
        <p style={localStyles.loading}>Não foi possível carregar as métricas.</p>
        <Footer />
      </main>
    )
  }

  const {
    kpis = [],
    executiveCards = [],
    insights = [],
    originRanking = [],
    regionRanking = [],
    locationRanking = [],
    periodRanking = [],
    hourRanking = [],
    weeklyHistory = [],
    monthlyEvolution = [],
  } = metrics

  const mainCharts = [
    {
      title: 'Ocupação por período',
      data: periodRanking.map((item) => ({
        label: item.label,
        value: item.total,
      })),
    },
    {
      title: 'Horário mais procurado',
      data: hourRanking.slice(0, 5).map((item) => ({
        label: item.label,
        value: item.total,
      })),
    },
    {
      title: 'Volume semanal',
      data: weeklyHistory.map((item) => ({
        label: item.week,
        value: item.sessions,
      })),
    },
    {
      title: 'Evolução mensal',
      data: monthlyEvolution.map((item) => ({
        label: item.label,
        value: item.total,
      })),
    },
  ]

  const detailCharts = [
    {
      title: 'Origem dos clientes',
      data: originRanking.map((item) => ({
        label: item.label,
        value: item.total,
      })),
    },
    {
      title: 'Região dos clientes',
      data: regionRanking.map((item) => ({
        label: item.label,
        value: item.total,
      })),
    },
    {
      title: 'Local preferencial',
      data: locationRanking.map((item) => ({
        label: item.label,
        value: item.total,
      })),
    },
  ]

  function renderAccordion({
    icon,
    title,
    subtitle,
    isOpen,
    onToggle,
    children,
  }) {
    return (
      <section style={localStyles.accordion}>
        <button type="button" style={localStyles.accordionButton} onClick={onToggle}>
          <div style={localStyles.accordionTitleBox}>
            <span style={localStyles.accordionIcon}>{icon}</span>
            <div>
              <h2 style={localStyles.accordionTitle}>{title}</h2>
              <p style={localStyles.accordionSubtitle}>{subtitle}</p>
            </div>
          </div>

          <span
            style={{
              ...localStyles.chevron,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ˅
          </span>
        </button>

        {isOpen && <div style={localStyles.content}>{children}</div>}
      </section>
    )
  }

  return (
    <main style={styles.page}>
      <Topbar variant="back" />

      <section style={styles.header}>
        <p style={styles.kicker}>Métricas</p>
        <h1 style={styles.title}>Dashboard Executivo Lumina</h1>
        <p style={styles.subtitle}>
          Visão consolidada de clientes, sessões, retornos e desempenho operacional.
        </p>
      </section>

      <section style={localStyles.grid}>
        {kpis.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section style={localStyles.sectionShell}>
        {renderAccordion({
          icon: '✦',
          title: 'Insights e Indicadores Principais',
          subtitle: 'Resumo executivo com os indicadores mais relevantes para tomada de decisão.',
          isOpen: openInsights,
          onToggle: () => setOpenInsights((current) => !current),
          children: (
            <>
              <div style={localStyles.cardGrid}>
                {executiveCards.map((card) => (
                  <article key={card.label} style={localStyles.card}>
                    <p style={localStyles.label}>{card.label}</p>
                    <h3 style={localStyles.value}>{card.value}</h3>
                    {card.helper && (
                      <p style={localStyles.description}>{card.helper}</p>
                    )}
                  </article>
                ))}
              </div>

              <div style={localStyles.cardGrid}>
                {insights.map((item) => (
                  <article key={item} style={localStyles.card}>
                    <p style={localStyles.description}>{item}</p>
                  </article>
                ))}
              </div>
            </>
          ),
        })}

        {renderAccordion({
          icon: '◷',
          title: 'Gráficos e Análises Detalhadas',
          subtitle: 'Análises visuais, rankings e comparativos para aprofundamento operacional.',
          isOpen: openCharts,
          onToggle: () => setOpenCharts((current) => !current),
          children: (
            <>
              <div style={localStyles.chartGrid}>
                {mainCharts.map((chart) => (
                  <ExpandableRankingChart key={chart.title} chart={chart} />
                ))}
              </div>

              <div style={localStyles.chartGrid}>
                {detailCharts.map((chart) => (
                  <ExpandableRankingChart key={chart.title} chart={chart} />
                ))}
              </div>
            </>
          ),
        })}
      </section>

      <Footer />
    </main>
  )
}

export default MetricasScreen


