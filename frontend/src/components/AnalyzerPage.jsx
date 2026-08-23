import { useState } from 'react'
import ProductForm from './ProductForm.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

function AnalyzerPage({ onAnalyzed }) {
  const { t } = useLanguage()
  const [preset, setPreset] = useState(null)
  const [presetKey, setPresetKey] = useState(0)

  const examples = t.analyzer.examples

  const useExample = (name) => {
    setPreset(name)
    setPresetKey((k) => k + 1)
  }

  return (
    <div className="analyzer">
      <h2 className="results-title">{t.analyzer.title}</h2>
      <p
        className="page-note"
        dangerouslySetInnerHTML={{ __html: t.analyzer.note }}
      />
      <ProductForm
        key={presetKey}
        initialProduct={preset}
        onAnalyze={onAnalyzed}
      />
      <div className="examples">
        <span>{t.analyzer.tryLabel}</span>
        {examples.map((example) => (
          <button
            key={example}
            className="example-chip"
            onClick={() => useExample(example)}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}

export default AnalyzerPage
