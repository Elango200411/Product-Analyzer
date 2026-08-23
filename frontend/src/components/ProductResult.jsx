import { useLanguage } from '../i18n/LanguageContext.jsx'

const CORE_FIELDS = ['name', 'brand', 'category', 'description', 'price']

function getScoreClass(score) {
  if (score >= 0.8) return 'excellent'
  if (score >= 0.6) return 'good'
  if (score >= 0.4) return 'fair'
  return 'poor'
}

function ProductResult({ product }) {
  const { t } = useLanguage()

  if (!product) {
    return (
      <div className="product-result">
        <p>{t.results.noResults}</p>
      </div>
    )
  }

  const scorePercent = Math.round((product.quality_score ?? 0) * 100)
  const scoreClass = getScoreClass(product.quality_score ?? 0)

  const fields = [
    { key: 'brand', label: t.results.fields.brand, value: product.brand },
    { key: 'category', label: t.results.fields.category, value: product.category },
    {
      key: 'price',
      label: t.results.fields.price,
      value: product.price != null
        ? `${product.currency || 'USD'} ${Number(product.price).toFixed(2)}`
        : null,
    },
    {
      key: 'rating',
      label: t.results.fields.rating,
      value: product.rating != null
        ? `${product.rating} / 5${product.review_count != null ? ` (${product.review_count})` : ''}`
        : null,
    },
    { key: 'description', label: t.results.fields.description, value: product.description },
  ]

  return (
    <div className="product-result">
      <h3>{product.name || t.preview.unnamedProduct}</h3>

      <div className="result-grid">
        {fields.map((f) => (
          <div key={f.key} className="result-field">
            <span className="label">{f.label}</span>
            <span className="field-value" style={{ color: f.value ? undefined : 'var(--muted)' }}>
              {f.value || '—'}
            </span>
          </div>
        ))}
      </div>

      {product.ingredients?.length > 0 && (
        <div className="result-field" style={{ marginTop: '1rem' }}>
          <span className="label">{t.results.fields.ingredients}</span>
          <span className="field-value">{product.ingredients.join(', ')}</span>
        </div>
      )}

      <div className="quality">
        <div className="quality-header">
          <span className="quality-label">{t.results.qualityScore}</span>
          <span className={`quality-score ${scoreClass}`}>{scorePercent}%</span>
        </div>
        <div className="quality-bar">
          <div
            className={`quality-fill ${scoreClass}`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
        <div className="quality-breakdown">
          {CORE_FIELDS.map((field) => (
            <div key={field} className="quality-item">
              <span
                className={`quality-item-dot ${product[field] ? 'filled' : 'empty'}`}
              />
              <span>{t.results.fields[field]}</span>
            </div>
          ))}
        </div>
      </div>

      {product.tags?.length > 0 && (
        <div className="tags">
          {product.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {!product.is_valid && product.errors?.length > 0 && (
        <div className="errors">
          <ul>
            {product.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProductResult
