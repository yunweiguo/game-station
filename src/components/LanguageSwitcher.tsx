'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { setLocale } = useLanguage()

  const getCurrentLocale = () => {
    const match = pathname.match(/^\/([a-z]{2})/)
    return match ? match[1] : 'en'
  }

  const toggleLanguage = () => {
    const currentLocale = getCurrentLocale()
    const newLocale = currentLocale === 'en' ? 'zh' : 'en'
    setLocale(newLocale)
    localStorage.setItem('preferred-locale', newLocale)
    
    // Update the URL to use the new locale
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${newLocale}`)
    router.push(newPathname)
  }

  const currentLocale = getCurrentLocale()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2"
    >
      <Globe className="h-4 w-4" />
      <span>{currentLocale === 'en' ? '中文' : 'English'}</span>
    </Button>
  )
}