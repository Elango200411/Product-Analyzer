import { useState } from 'react'
import ProductResult from './ProductResult.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { PipelineIcon, ValidationIcon } from './Icons.jsx'

const PIPELINE_KEYS = ['research_status', 'extraction_status', 'enrichment_added', 'validation_status', 'quality_status']

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

function ResultsPage({ product, onBack, onPreview }) {
  const { t } = useLanguage()
  const [toast, setToast] = useState(null)

  if (!product) return null

  const pipeline = product._pipeline || {}

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="results-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button className="back-button" onClick={onBack}>
          {t.results.back}
        </button>
        <div className="results-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => { exportJSON(product); showToast(t.results.exportedJson) }}>
            {t.results.exportJson}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { exportCSV(product); showToast(t.results.exportedCsv) }}>
            {t.results.exportCsv}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { copyShareLink(product); showToast(t.results.linkCopied) }}>
            {t.results.share}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onPreview && onPreview(product)}>
            {t.results.fullPreview}
          </button>
        </div>
      </div>

      <h2 className="results-title">{t.results.title}</h2>

      {/* Pipeline Visualization */}
      <div className="pipeline-viz">
        <div className="pipeline-title">{t.results.pipeline}</div>
        <div className="pipeline-steps">
          {PIPELINE_KEYS.map((key, i) => {
            const isComplete = key === 'enrichment_added'
              ? (pipeline[key] || []).length > 0
              : pipeline[key] === 'ok'
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`pipeline-step ${isComplete ? 'complete' : ''}`}>
                  <div className="pipeline-step-icon">
                    {isComplete ? <ValidationIcon size={18} /> : <PipelineIcon index={i} size={18} />}
                  </div>
                  <span className="pipeline-step-label">{t.results.pipelineLabels[i]}</span>
                </div>
                {i < PIPELINE_KEYS.length - 1 && (
                  <div className={`pipeline-connector ${isComplete ? 'active' : ''}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <ProductResult product={product} />

      {toast && (
        <div className="toast success">✓ {toast}</div>
      )}
    </div>
  )
}

export default ResultsPage
