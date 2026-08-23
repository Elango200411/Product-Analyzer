import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const CORE_FIELDS = ['name', 'brand', 'category', 'description', 'price']

function getScoreClass(score) {
  if (score >= 0.8) return 'excellent'
  if (score >= 0.6) return 'good'
  if (score >= 0.4) return 'fair'
  return 'poor'
}

function getFieldConfidence(field, product) {
  if (!product[field]) return 0
  if (field === 'name') return 1.0
  if (field === 'brand') return 0.85
  if (field === 'category') return 0.8
  if (field === 'price') return 0.9
  if (field === 'description') return 0.7
  return 0.5
}

function ConfidenceMeter({ value, t }) {
  const pct = Math.round(value * 100)
  const level = value >= 0.8 ? 'high' : value >= 0.5 ? 'medium' : value > 0 ? 'low' : 'none'
  const label = level === 'high' ? t.common.high : level === 'medium' ? t.common.med : level === 'low' ? t.common.low : t.common.na
  return (
    <div className="confidence-meter">
      <div className="confidence-bar">
        <div className={`confidence-fill ${level}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`confidence-label ${level}`}>{label} {pct > 0 && `${pct}%`}</span>
    </div>
  )
}

function exportJSON(product) {
  const blob = new Blob([JSON.stringify(product, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(product.name || 'product').replace(/\s+/g, '-').toLowerCase()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function exportCSV(product) {
  const headers = ['Field', 'Value']
  const rows = [
    ['name', product.name || ''],
    ['brand', product.brand || ''],
    ['category', product.category || ''],
    ['price', product.price != null ? `${product.currency || 'USD'} ${product.price}` : ''],
    ['rating', product.rating != null ? `${product.rating}/5` : ''],
    ['review_count', product.review_count != null ? String(product.review_count) : ''],
    ['description', product.description || ''],
    ['ingredients', (product.ingredients || []).join('; ')],
    ['tags', (product.tags || []).join('; ')],
    ['quality_score', product.quality_score != null ? String(product.quality_score) : ''],
    ['is_valid', String(product.is_valid)],
    ['errors', (product.errors || []).join('; ')],
  ]
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(product.name || 'product').replace(/\s+/g, '-').toLowerCase()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function copyShareLink(product) {
  const data = encodeURIComponent(JSON.stringify({
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
  }))
  const url = `${window.location.origin}${window.location.pathname}#/share?product=${data}`
  navigator.clipboard.writeText(url).then(() => true).catch(() => false)
}

function PreviewPage({ product, onBack }) {
  const { t } = useLanguage()
  const [toast, setToast] = useState(null)

  if (!product) {
    return (
      <div className="preview-page">
        <p className="page-note">{t.preview.noProduct}</p>
        <button className="btn btn-ghost" onClick={onBack}>{t.preview.goBack}</button>
      </div>
    )
  }

  const scorePercent = Math.round((product.quality_score ?? 0) * 100)
  const scoreClass = getScoreClass(product.quality_score ?? 0)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="preview-page">
      {/* Header */}
      <div className="preview-page-header">
        <button className="back-button" onClick={onBack}>
          {t.preview.back}
        </button>
        <div className="preview-page-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { exportJSON(product); showToast(t.results.exportedJson) }}
          >
            {t.preview.exportJson}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { exportCSV(product); showToast(t.results.exportedCsv) }}
          >
            {t.preview.exportCsv}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { copyShareLink(product); showToast(t.results.linkCopied) }}
          >
            {t.preview.share}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="preview-hero">
        <div className="preview-hero-content">
          <div className="preview-hero-top">
            <div className="preview-hero-info">
              <h1>{product.name || t.preview.unnamedProduct}</h1>
              <div className="preview-hero-meta">
                {product.brand && (
                  <span className="preview-hero-meta-item">
                    🏷️ <strong>{product.brand}</strong>
                  </span>
                )}
                {product.category && (
                  <span className="preview-hero-meta-item">
                    📁 {product.category}
                  </span>
                )}
                {product.rating != null && (
                  <span className="preview-hero-meta-item">
                    ⭐ {product.rating}/5
                    {product.review_count != null && ` (${product.review_count} ${t.preview.reviews})`}
                  </span>
                )}
              </div>
            </div>
            {product.price != null && (
              <div className="preview-price">
                <div className="preview-price-amount">
                  {product.currency || '$'}{Number(product.price).toFixed(2)}
                </div>
                <div className="preview-price-label">{t.preview.priceLabel}</div>
              </div>
            )}
          </div>

          {/* Quality */}
          <div className="quality">
            <div className="quality-header">
              <span className="quality-label">{t.results.qualityScore}</span>
              <span className={`quality-score ${scoreClass}`}>{scorePercent}%</span>
            </div>
            <div className="quality-bar">
              <div className={`quality-fill ${scoreClass}`} style={{ width: `${scorePercent}%` }} />
            </div>
            <div className="quality-breakdown">
              {CORE_FIELDS.map((field) => (
                <div key={field} className="quality-item">
                  <span className={`quality-item-dot ${product[field] ? 'filled' : 'empty'}`} />
                  <span>{field}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="preview-grid">
        {/* Product Details */}
        <div className="preview-section">
          <h3 className="preview-section-title">{t.preview.productDetails}</h3>
          <div className="preview-detail-grid">
            <div className="preview-detail-item">
              <span className="preview-detail-label">{t.preview.brand}</span>
              <span className="preview-detail-value">{product.brand || '—'}</span>
              <ConfidenceMeter value={getFieldConfidence('brand', product)} t={t} />
            </div>
            <div className="preview-detail-item">
              <span className="preview-detail-label">{t.preview.category}</span>
              <span className="preview-detail-value">{product.category || '—'}</span>
              <ConfidenceMeter value={getFieldConfidence('category', product)} t={t} />
            </div>
            <div className="preview-detail-item">
              <span className="preview-detail-label">{t.preview.price}</span>
              <span className="preview-detail-value">
                {product.price != null ? `${product.currency || 'USD'} ${Number(product.price).toFixed(2)}` : '—'}
              </span>
              <ConfidenceMeter value={getFieldConfidence('price', product)} t={t} />
            </div>
            <div className="preview-detail-item">
              <span className="preview-detail-label">{t.preview.rating}</span>
              <span className="preview-detail-value">
                {product.rating != null ? `${product.rating}/5` : '—'}
              </span>
              <ConfidenceMeter value={product.rating != null ? 0.75 : 0} t={t} />
            </div>
          </div>
        </div>

        {/* Tags & Validity */}
        <div className="preview-section">
          <h3 className="preview-section-title">{t.preview.tagsStatus}</h3>
          {product.tags?.length > 0 && (
            <div className="tags" style={{ marginBottom: '1rem' }}>
              {product.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
          <div className="preview-detail-grid">
            <div className="preview-detail-item">
              <span className="preview-detail-label">{t.preview.valid}</span>
              <span className="preview-detail-value" style={{ color: product.is_valid ? 'var(--success)' : 'var(--danger)' }}>
                {product.is_valid ? t.preview.yes : t.preview.no}
              </span>
            </div>
            <div className="preview-detail-item">
              <span className="preview-detail-label">{t.preview.errors}</span>
              <span className="preview-detail-value">
                {product.errors?.length > 0 ? product.errors.length : t.preview.none}
              </span>
            </div>
          </div>
          {product.errors?.length > 0 && (
            <div className="errors" style={{ marginTop: '1rem' }}>
              <ul>
                {product.errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="preview-section" style={{ marginBottom: '1.5rem' }}>
          <h3 className="preview-section-title">{t.preview.description}</h3>
          <p className="preview-description">{product.description}</p>
        </div>
      )}

      {/* Ingredients */}
      {product.ingredients?.length > 0 && (
        <div className="preview-section" style={{ marginBottom: '1.5rem' }}>
          <h3 className="preview-section-title">{t.preview.ingredients}</h3>
          <div className="preview-ingredients-list">
            {product.ingredients.map((ing) => (
              <span key={ing} className="tag">{ing}</span>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {product.sources?.filter(Boolean).length > 0 && (
        <div className="preview-section" style={{ marginBottom: '1.5rem' }}>
          <h3 className="preview-section-title">{t.preview.sources}</h3>
          <div className="preview-sources-list">
            {[...new Set(product.sources.filter(Boolean))].map((src) => (
              <div key={src} className="preview-source-item">
                <span className="preview-source-dot" />
                {src}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast success">
          ✓ {toast}
        </div>
      )}
    </div>
  )
}

export default PreviewPage
