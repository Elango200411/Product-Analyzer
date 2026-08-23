import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const API_URL = '/api'

// English defaults so the page never crashes in any language
const EN = {
  title: 'Recent analyses',
  loading: 'Loading history...',
  empty: 'Nothing analyzed yet.',
  analyzeFirst: 'Analyze your first product',
  general: 'general',
  error: 'Could not load history. Is the backend running?',
  searchPlaceholder: 'Search by name or category...',
  statTotal: 'Total analyses',
  statQuality: 'Avg quality',
  statValid: 'Valid records',
  delete: 'Delete',
  confirmDelete: 'Delete this analysis?',
  selectHint: 'Select two or more products to compare',
  compareSelected: 'Compare selected',
}

function getScoreClass(score) {
  if (score >= 0.8) return 'excellent'
  if (score >= 0.6) return 'good'
  if (score >= 0.4) return 'fair'
  return 'poor'
}

function formatDate(iso) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
      ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function HistoryPage({ onSelect, onNavigate, onCompare }) {
  const { t } = useLanguage()
  const h = { ...EN, ...(t.history || {}) }

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState([])

  const load = () => {
    setLoading(true)
    setFailed(false)
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error (${res.status})`)
        return res.json()
      })
      .then((data) => setProducts(data.products || []))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const remove = async (id) => {
    if (!window.confirm(h.confirmDelete)) return
    try {
      await fetch(`${API_URL}/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
      setProducts((list) => list.filter((p) => p.id !== id))
      setSelected((sel) => sel.filter((sid) => sid !== id))
    } catch {
      load()
    }
  }

  const toggle = (id) => {
    setSelected((sel) =>
      sel.includes(id)
        ? sel.filter((s) => s !== id)
        : sel.length >= 3 ? sel : [...sel, id]
    )
  }

  const stats = useMemo(() => {
    const total = products.length
    const avg = total
      ? Math.round((products.reduce((a, p) => a + (p.quality_score ?? 0), 0) / total) * 100)
      : 0
    const valid = products.filter((p) => p.is_valid).length
    return { total, avg, valid }
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...products].sort(
      (a, b) => (b.analyzed_at || '').localeCompare(a.analyzed_at || '')
    )
    if (!q) return sorted
    return sorted.filter((p) => {
      const hay = `${p.name || ''} ${p.category || ''} ${p.brand || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
      return hay.includes(q)
    })
  }, [products, query])

  const startCompare = () => {
    const items = products.filter((p) => selected.includes(p.id))
    if (items.length >= 2 && onCompare) onCompare(items)
  }

  if (loading) {
    return (
      <div className="history">
        <h2 className="results-title">{h.title}</h2>
        <p className="page-note">{h.loading}</p>
      </div>
    )
  }

  if (failed) {
    return (
      <div className="history">
        <h2 className="results-title">{h.title}</h2>
        <p className="form-error">{h.error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="history">
        <h2 className="results-title">{h.title}</h2>
        <p className="page-note">
          {h.empty}{' '}
          <button className="link-button" onClick={() => onNavigate('analyzer')}>
            {h.analyzeFirst}
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="history">
      <h2 className="results-title">{h.title}</h2>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">{h.statTotal}</span>
        </div>
        <div className="stat-card">
          <span className={`stat-value ${getScoreClass(stats.avg / 100)}`}>{stats.avg}%</span>
          <span className="stat-label">{h.statQuality}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value good">{stats.valid}/{stats.total}</span>
          <span className="stat-label">{h.statValid}</span>
        </div>
      </div>

      <input
        type="search"
        className="history-search"
        placeholder={h.searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="page-note">{query ? '—' : h.empty}</p>
      ) : (
        <ul className="history-list">
          {filtered.map((product) => {
            const score = Math.round((product.quality_score ?? 0) * 100)
            const scoreClass = getScoreClass(product.quality_score ?? 0)
            return (
              <li key={product.id} className={selected.includes(product.id) ? 'picked' : ''}>
                <label className="pick-box">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggle(product.id)}
                  />
                </label>
                <button className="history-item" onClick={() => onSelect(product)}>
                  <span className="history-name">{product.name}</span>
                  <span className="history-meta">
                    <span className="history-date">{formatDate(product.analyzed_at)}</span>
                    {product.category || h.general}
                    <span className={`history-score ${scoreClass}`}>{score}%</span>
                  </span>
                </button>
                <button
                  className="del-button"
                  title={h.delete}
                  aria-label={h.delete}
                  onClick={() => remove(product.id)}
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {selected.length > 0 && (
        <div className="compare-bar">
          <span>{selected.length < 2 ? h.selectHint : ''}</span>
          <button
            className="btn btn-primary btn-sm"
            disabled={selected.length < 2}
            onClick={startCompare}
          >
            {`${h.compareSelected} (${selected.length})`}
          </button>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
