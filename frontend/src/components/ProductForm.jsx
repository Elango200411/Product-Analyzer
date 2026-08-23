import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { PipelineIcon } from './Icons.jsx'

async function analyze(name) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }
  try {
    const res = await fetch('/api/analyze', options)
    if (!res.ok) throw new Error(`Server error (${res.status})`)
    return await res.json()
  } catch (err) {
    const res = await fetch('http://localhost:8000/api/analyze', options)
    if (!res.ok) throw new Error(`Server error (${res.status})`)
    return await res.json()
  }
}

function ProductForm({ initialProduct = '', onAnalyze }) {
  const { t } = useLanguage()
  const [product, setProduct] = useState(initialProduct)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState(-1)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading) return
    setStage(0)
    const timer = setInterval(
      () => setStage((s) => Math.min(s + 1, t.analyzer.stages.length - 1)),
      400
    )
    return () => clearInterval(timer)
  }, [loading, t.analyzer.stages.length])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!product.trim()) {
      setError(t.analyzer.errorEmpty)
      return
    }
    setLoading(true)
    try {
      const data = await analyze(product.trim())
      onAnalyze(data.product)
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? t.analyzer.errorServer
          : err.message
      )
    } finally {
      setLoading(false)
      setStage(-1)
    }
  }

  return (
    <>
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder={t.analyzer.placeholder}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? t.analyzer.analyzing : t.analyzer.button}
        </button>
      </form>
      {loading && (
        <div className="loading-bar">
          <div className="loading-fill" />
        </div>
      )}
      {loading && (
        <div className="stages" aria-live="polite">
          {t.analyzer.stages.map((label, i) => (
            <div
              key={i}
              className={`stage ${i < stage ? 'done' : ''} ${i === stage ? 'active' : ''}`}
            >
              <span className="stage-dot" />
              <span className="stage-icon"><PipelineIcon index={i} size={15} /></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}

export default ProductForm
