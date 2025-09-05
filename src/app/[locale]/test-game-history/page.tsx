'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestGameHistoryPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testGameHistoryAPI = async () => {
    setLoading(true);
    try {
      // 测试GET请求
      const getResponse = await fetch('/api/user/game-history');
      const getResult = await getResponse.json();
      
      // 测试POST请求 - 使用真实的游戏ID
      const postResponse = await fetch('/api/user/game-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gameId: 'f72ae0ad-cf31-4119-a274-b1dd25738a8d', // Puzzle Master
          playDuration: 60 
        }),
      });
      const postResult = await postResponse.json();
      
      setTestResult(JSON.stringify({
        session: session ? `Logged in as ${session.user.email}` : 'Not logged in',
        getUserId: session?.user?.id,
        getStatus: getResponse.status,
        getResult,
        postStatus: postResponse.status,
        postResult,
        timestamp: new Date().toISOString()
      }, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>游戏历史记录API测试</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p><strong>登录状态:</strong> {status === 'loading' ? 'Loading...' : status === 'authenticated' ? `已登录 (${session.user.email})` : '未登录'}</p>
              <p><strong>用户ID:</strong> {session?.user?.id || 'N/A'}</p>
            </div>
            
            <Button 
              onClick={testGameHistoryAPI} 
              disabled={loading || status !== 'authenticated'}
            >
              {loading ? '测试中...' : '测试游戏历史API'}
            </Button>
            
            {testResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">测试结果:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {testResult}
                </pre>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">可能的解决方案:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>如果看到表不存在的错误，需要在Supabase中执行 user-game-history.sql 文件</li>
                <li>如果看到RLS策略错误，确保已正确设置行级安全策略</li>
                <li>如果看到认证错误，确保用户已正确登录</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}