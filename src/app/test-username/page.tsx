import { useSession } from 'next-auth/react';

export default function TestUsernamePage() {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Username Display Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Session Data:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Current Display:</h2>
          <div className="flex items-center space-x-2 p-4 border rounded">
            <span className="relative flex shrink-0 overflow-hidden rounded-full w-6 h-6">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                {session?.user?.username?.charAt(0) || session?.user?.email?.charAt(0)}
              </span>
            </span>
            <span className="hidden sm:inline">
              {session?.user?.username || 'Profile'}
            </span>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Individual Components:</h2>
          <div className="space-y-2">
            <div>
              <strong>Avatar only:</strong>
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-6 h-6 ml-2">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                  {session?.user?.username?.charAt(0) || session?.user?.email?.charAt(0)}
                </span>
              </span>
            </div>
            <div>
              <strong>Username only:</strong>
              <span className="ml-2">{session?.user?.username || 'Profile'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}