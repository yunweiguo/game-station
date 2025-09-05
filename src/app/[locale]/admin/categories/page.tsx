'use client'

import { CategoriesManagement } from '@/components/admin/categories/CategoriesManagement'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'

export default function AdminCategoriesPage() {
  return (
    <AdminLayout>
      <CategoriesManagement />
    </AdminLayout>
  )
}