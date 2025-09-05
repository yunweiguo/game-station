'use client'

import { ModerationPanel } from '@/components/admin/moderation/ModerationPanel'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'

export default function AdminModerationPage() {
  return (
    <AdminLayout>
      <ModerationPanel />
    </AdminLayout>
  )
}