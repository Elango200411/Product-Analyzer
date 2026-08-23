import { useLanguage } from '../i18n/LanguageContext.jsx'

const EN = {
  title: 'Compare products',
  back: '← Back to history',
  emptyTitle: 'Nothing to compare',
  emptyText: 'Select two or three products in History, then press "Compare selected".',
  goHistory: 'Open history →',
  field: 'Field',
  best: 'Best',
  rows: {
    brand: 'Brand',
    category: 'Category',
    price: 'Price',
    rating: 'Rating',
    review_count: 'Reviews',
    quality_score: 'Quality score',
    is_valid: 'Valid',
  },
}

function fmtMoney(p) {
  if (p.price == null) return null
  const cur = p.currency || 'USD'
  return `${cur} ${Number(p.price).toFixed(2)}`
}

function fmtScore(v) {
  if (v == null) return null
  return `${Math.round(v * 100)}%`
}

// Returns the column indexes that hold the best value for a numeric row
function bestIndexes(values, mode) {
  const nums = values.map((v) => (typeof v === 'number' ? v : null)).filter((v) => v != null)
  if (nums.length < 2 || !mode) return []
  const target = mode === 'min' ? Math.min(...nums) : Math.max(...nums)
  return values.map((v, i) => (typeof v === 'number' && v === target ? i : -1)).filter((i) => i >= 0)
}

function ComparePage({ items, onBack, onNavigate }) {
  const { t } = useLanguage()
  const c = { ...EN, ...(t.compare || {}) }

  if (!items || items.length < 2) {
    return (
      <div className="compare-page">
        <button className="back-button" onClick={onBack}>{c.back}</button>
        <h2 className="results-title">{c.emptyTitle}</h2>
        <p className="page-note">
          {c.emptyText}{' '}
          <button className="link-button" onClick={() => onNavigate('history')}>{c.goHistory}</button>
        </p>
      </div>
    )
  }

  const get = {
    brand: (p) => p.brand,
    category: (p) => p.category,
    price: (p) => p.price != null ? Number(p.price) : null,
    rating: (p) => p.rating != null ? Number(p.rating) : null,
    review_count: (p) => p.review_count != null ? Number(p.review_count) : null,
    quality_score: (p) => p.quality_score != null ? Number(p.quality_score) : null,
    is_valid: (p) => p.is_valid,
  }
  const show = {
    price: (p) => fmtMoney(p),
    rating: (p) => p.rating != null ? `${p.rating}/5` : null,
    review_count: (p) => p.review_count?.toLocaleString(),
    quality_score: (p) => fmtScore(p.quality_score),
    is_valid: (p) => p.is_valid ? '✓' : '✗',
  }

  const rowDefs = [
    { key: 'brand', best: [] },
    { key: 'category', best: [] },
    { key: 'price', best: ['price', 'min'] },
    { key: 'rating', best: ['rating', 'max'] },
    { key: 'review_count', best: ['review_count', 'max'] },
    { key: 'quality_score', best: ['quality_score', 'max'] },
    { key: 'is_valid', best: [] },
  ]

  return (
    <div className="compare-page">
      <button className="back-button" onClick={onBack}>{c.back}</button>
      <h2 className="results-title">{c.title}</h2>

      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th>{c.field}</th>
              {items.map((p) => (
                <th key={p.id}>{p.name || '—'}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowDefs.map(({ key, best }) => {
              const values = items.map((p) => (get[key] ? get[key](p) : p[key]))
              const winners = best.length ? bestIndexes(values, best[1]) : []
              return (
                <tr key={key}>
                  <td className="compare-field">{c.rows[key]}</td>
                  {values.map((v, i) => (
                    <td key={i} className={winners.includes(i) ? 'best-cell' : ''}>
                      {show[key] ? show[key](items[i]) : v ?? '—'}
                      {winners.includes(i) && <span className="best-badge">★</span>}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ComparePage
