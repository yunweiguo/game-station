'use client'

import { UserManagement } from '@/components/admin/users/UserManagement'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  )
}