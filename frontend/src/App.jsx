import { useEffect, useState } from 'react'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import Header from './components/Header.jsx'
import LandingPage from './components/LandingPage.jsx'
import AnalyzerPage from './components/AnalyzerPage.jsx'
import ResultsPage from './components/ResultsPage.jsx'
import HistoryPage from './components/HistoryPage.jsx'
import PreviewPage from './components/PreviewPage.jsx'

const ROUTES = ['landing', 'analyzer', 'history', 'results', 'preview']

function currentRoute() {
  const h = window.location.hash.replace(/^#\/?/, '')
  return ROUTES.includes(h) ? h : 'landing'
}

const PRODUCT_KEY = 'pa-product'

function loadStoredProduct() {
  try {
    const raw = sessionStorage.getItem(PRODUCT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function AppContent() {
  const [page, setPage] = useState(currentRoute())
  const [product, setProductState] = useState(loadStoredProduct)

  const setProduct = (item) => {
    setProductState(item)
    try {
      if (item) sessionStorage.setItem(PRODUCT_KEY, JSON.stringify(item))
      else sessionStorage.removeItem(PRODUCT_KEY)
    } catch { /* storage unavailable */ }
  }

  useEffect(() => {
    const onHash = () => setPage(currentRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (target) => {
    window.location.hash = target === 'landing' ? '/' : `/${target}`
  }

  const handleAnalyzed = (result) => {
    setProduct(result)
    navigate('results')
  }

  const handlePreview = (item) => {
    setProduct(item)
    navigate('preview')
  }

  const effectivePage =
    page === 'results' && !product ? 'analyzer' :
    page === 'preview' && !product ? 'analyzer' : page

  return (
    <div className="app">
      <Header page={effectivePage} onNavigate={navigate} />
      {effectivePage === 'landing' && <LandingPage onNavigate={navigate} />}
      {effectivePage === 'analyzer' && (
        <AnalyzerPage onAnalyzed={handleAnalyzed} />
      )}
      {effectivePage === 'history' && (
        <HistoryPage
          onSelect={(item) => { setProduct(item); navigate('results') }}
          onNavigate={navigate}
        />
      )}
      {effectivePage === 'results' && (
        <ResultsPage
          product={product}
          onBack={() => navigate('analyzer')}
          onPreview={handlePreview}
        />
      )}
      {effectivePage === 'preview' && (
        <PreviewPage
          product={product}
          onBack={() => navigate('results')}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
