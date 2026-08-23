import { createContext, useContext, useEffect, useState } from 'react'
import translations from './translations.js'

const LanguageContext = createContext()

const SUPPORTED_LANGS = Object.keys(translations)

const LANG_FLAGS = {
  en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', ja: '🇯🇵',
  ar: '🇸🇦', zh: '🇨🇳', pt: '🇧🇷', ko: '🇰🇷',
  // Indian languages
  hi: '🇮🇳', bn: '🇮🇳', te: '🇮🇳', mr: '🇮🇳', ta: '🇮🇳',
  gu: '🇮🇳', ur: '🇮🇳', kn: '🇮🇳', or: '🇮🇳', ml: '🇮🇳',
  pa: '🇮🇳', as: '🇮🇳', mai: '🇮🇳', sa: '🇮🇳', ne: '🇳🇵',
  sd: '🇵🇰', kok: '🇮🇳', doi: '🇮🇳', mni: '🇮🇳',
  brx: '🇮🇳', sat: '🇮🇳', ks: '🇮🇳',
}
const LANG_GROUPS = [
  {
    label: 'Global',
    langs: ['en', 'es', 'fr', 'de', 'ja', 'ar', 'zh', 'pt', 'ko'],
  },
  {
    label: 'Indian — Major',
    langs: ['hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'or', 'ml', 'pa', 'as'],
  },
  {
    label: 'Indian — Regional',
    langs: ['ur', 'mai', 'sa', 'ne', 'sd', 'kok', 'doi', 'mni', 'brx', 'sat', 'ks'],
  },
]

function detectLanguage() {
  const stored = localStorage.getItem('pa-lang')
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored
  const browserLang = navigator.language.slice(0, 2)
  if (SUPPORTED_LANGS.includes(browserLang)) return browserLang
  return 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(detectLanguage)

  const changeLang = (newLang) => {
    if (SUPPORTED_LANGS.includes(newLang)) {
      setLang(newLang)
      localStorage.setItem('pa-lang', newLang)
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = 'ltr'
  }, [lang])

  const t = translations[lang] || translations.en

  return (
    <LanguageContext.Provider
      value={{ lang, changeLang, t, LANG_FLAGS, SUPPORTED_LANGS, LANG_GROUPS }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
