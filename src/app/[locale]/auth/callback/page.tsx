'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function AuthCallback() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const t = useTranslations('auth')

  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      // Check if user is admin by email (temporary solution)
      if (session.user?.email === 'admin@gamestation.com') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } else {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">{t('callback.loading')}</p>
      </div>
    </div>
  )
}