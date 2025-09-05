'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface LanguageContextType {
  locale: string
  setLocale: (locale: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {}
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState('en')

  useEffect(() => {
    // Load saved locale from localStorage on mount
    const savedLocale = localStorage.getItem('preferred-locale')
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale)
    localStorage.setItem('preferred-locale', newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)