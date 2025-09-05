'use client'

import { GamesManagement } from '@/components/admin/games/GamesManagement'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'

export default function AdminGamesPage() {
  return (
    <AdminLayout>
      <GamesManagement />
    </AdminLayout>
  )
}