"use client"

import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { NextIntlClientProvider } from 'next-intl'
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { ToastContainer } from "@/components/ui/toast"

// Client-side providers wrapper
function ClientProviders({ children, messages, locale }: { 
  children: React.ReactNode, 
  messages: Record<string, unknown>, 
  locale: string 
}) {
  return (
    <SessionProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <LanguageProvider>
          <ErrorBoundary>
            {children}
            <ToastContainer />
          </ErrorBoundary>
        </LanguageProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  )
}

export default ClientProviders