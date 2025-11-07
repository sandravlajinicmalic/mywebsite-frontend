import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'sr' | 'en'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Translation files cache
let translationsCache: Record<Language, Record<string, string> | null> = {
  sr: null,
  en: null,
}

// Load translations from public folder
const loadTranslations = async (lang: Language): Promise<Record<string, string>> => {
  // Return cached translations if available
  if (translationsCache[lang]) {
    return translationsCache[lang]!
  }

  try {
    const response = await fetch(`/translations/${lang}.json`)
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`)
    }
    const translations = await response.json()
    translationsCache[lang] = translations
    return translations
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error)
    return {}
  }
}

const STORAGE_KEY = 'app_language'

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language
    return saved && (saved === 'sr' || saved === 'en') ? saved : 'sr'
  })
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load translations on mount and when language changes
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const loadedTranslations = await loadTranslations(language)
      setTranslations(loadedTranslations)
      setIsLoading(false)
    }
    load()
  }, [language])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    if (isLoading) {
      return key // Return key while loading
    }
    return translations[key] || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

