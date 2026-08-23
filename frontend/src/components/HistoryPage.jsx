import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const API_URL = '/api'

function getScoreClass(score) {
  if (score >= 0.8) return 'excellent'
  if (score >= 0.6) return 'good'
  if (score >= 0.4) return 'fair'
  return 'poor'
}

function HistoryPage({ onSelect, onNavigate }) {
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorKey, setErrorKey] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error (${res.status})`)
        return res.json()
      })
      .then((data) => setProducts(data.products || []))
      .catch(() => setErrorKey('load_error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="history">
        <h2 className="results-title">{t.history.title}</h2>
        <p className="page-note">{t.history.loading}</p>
      </div>
    )
  }

  if (errorKey) {
    return (
      <div className="history">
        <h2 className="results-title">{t.history.title}</h2>
        <p className="form-error">{t.history.error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="history">
        <h2 className="results-title">{t.history.title}</h2>
        <p className="page-note">
          {t.history.empty}{' '}
          <button className="link-button" onClick={() => onNavigate('analyzer')}>
            {t.history.analyzeFirst}
          </button>
        </p>
      </div>
    )
  }

  const sorted = [...products].sort(
    (a, b) => (b.analyzed_at || '').localeCompare(a.analyzed_at || '')
  )

  return (
    <div className="history">
      <h2 className="results-title">{t.history.title}</h2>
      <ul className="history-list">
        {sorted.map((product) => {
          const score = Math.round((product.quality_score ?? 0) * 100)
          const scoreClass = getScoreClass(product.quality_score ?? 0)
          return (
            <li key={product.id}>
              <button
                className="history-item"
                onClick={() => onSelect(product)}
              >
                <span className="history-name">{product.name}</span>
                <span className="history-meta">
                  {product.category || t.history.general}
                  <span className={`history-score ${scoreClass}`}>{score}%</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default HistoryPage
