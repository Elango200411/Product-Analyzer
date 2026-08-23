import { useLanguage } from '../i18n/LanguageContext.jsx'
import { PipelineIcon } from './Icons.jsx'

const AGENT_KEYS = ['research', 'extraction', 'enrichment', 'validation', 'quality']

const TECH = [
  { name: 'FastAPI', color: '#009688' },
  { name: 'React', color: '#61DAFB' },
  { name: 'Multi-Agent AI', color: '#8B5CF6' },
  { name: 'Pydantic', color: '#E92063' },
  { name: 'Vite', color: '#646CFF' },
]

function LandingPage({ onNavigate }) {
  const { t } = useLanguage()

  return (
    <div className="landing">
      <section className="hero">
        <span className="hero-badge">{t.landing.badge}</span>
        <h1 className="hero-title">
          {t.landing.title1}
          <br />
          <span className="gradient-text">{t.landing.title2}</span>
        </h1>
        <p className="hero-subtitle">
          {t.landing.subtitle}
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onNavigate('analyzer')}>
            {t.landing.cta}
          </button>
          <button className="btn btn-ghost" onClick={() => onNavigate('history')}>
            {t.landing.viewHistory}
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <strong>5</strong>
            <span>{t.landing.stats.agents}</span>
          </div>
          <div className="stat">
            <strong>&lt;1s</strong>
            <span>{t.landing.stats.time}</span>
          </div>
          <div className="stat">
            <strong>100%</strong>
            <span>{t.landing.stats.output}</span>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">{t.landing.sectionPipeline}</h2>
        <p className="section-subtitle">
          {t.landing.sectionPipelineSub}
        </p>
        <div className="feature-grid">
          {AGENT_KEYS.map((key, i) => (
            <article key={key} className="feature-card">
              <span className="feature-icon"><PipelineIcon index={i} size={22} /></span>
              <h3>{t.landing.agents[key].title}</h3>
              <p>{t.landing.agents[key].text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how">
        <h2 className="section-title">{t.landing.howItWorks}</h2>
        <div className="steps">
          {t.landing.steps.map((label, i) => (
            <div key={i} className="step">
              <span className="step-num">{i + 1}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="cta-card">
          <h3>{t.landing.tryNow}</h3>
          <p>{t.landing.tryNowText}</p>
          <button className="btn btn-primary" onClick={() => onNavigate('analyzer')}>
            {t.landing.startAnalyzing}
          </button>
        </div>
      </section>

      <section className="tech-section">
        <h2 className="section-title">{t.landing.builtWith}</h2>
        <div className="tech-badges">
          {TECH.map((tech) => (
            <span key={tech.name} className="tech-badge">
              <span className="tech-badge-dot" style={{ background: tech.color }} />
              {tech.name}
            </span>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>{t.landing.footer}</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{t.landing.version}</span>
      </footer>
    </div>
  )
}

export default LandingPage
