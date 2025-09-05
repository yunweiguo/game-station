'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const createAdmin = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      // 创建管理员账户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@gamestation.com',
        password: 'admin123456',
      })

      if (authError) {
        setError(`创建认证用户失败: ${authError.message}`)
        return
      }

      if (authData.user?.id) {
        // 创建用户档案
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: authData.user.id,
            username: 'admin',
            email: 'admin@gamestation.com',
            role: 'admin',
            avatar: null,
            status: 'active',
            email_verified: true,
          })
          .select()

        if (profileError) {
          setError(`创建用户档案失败: ${profileError.message}`)
          return
        }

        setMessage('✅ 管理员账户创建成功！')
      }
    } catch (err) {
      setError(`服务器错误: ${err instanceof Error ? err.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            设置管理员账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            点击下方按钮创建管理员账户
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={createAdmin}
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? '创建中...' : '创建管理员账户'}
          </button>

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="text-green-800">{message}</div>
              <div className="mt-2 text-sm text-green-700">
                <p><strong>邮箱:</strong> admin@gamestation.com</p>
                <p><strong>密码:</strong> admin123456</p>
                <p><strong>角色:</strong> admin</p>
              </div>
              <div className="mt-4 text-sm text-green-600">
                <p>📝 使用说明:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>访问 <code className="bg-green-100 px-1 rounded">/auth/signin</code></li>
                  <li>使用管理员账户登录</li>
                  <li>登录后访问 <code className="bg-green-100 px-1 rounded">/admin</code> 进入后台</li>
                </ol>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>⚠️ 请确保在 Supabase 中创建了 <code className="bg-gray-100 px-1 rounded">user_profiles</code> 表</p>
          <p className="mt-2">如果创建失败，请先在 Supabase Dashboard 中创建必要的表结构</p>
        </div>
      </div>
    </div>
  )
}