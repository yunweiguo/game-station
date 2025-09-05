'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Gamepad2, Search, User, LogOut, Trophy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  // Get current locale from pathname
  const getCurrentLocale = () => {
    const match = pathname.match(/^\/([a-z]{2})/);
    return match ? match[1] : 'en';
  };
  
  const currentLocale = getCurrentLocale();
  const basePath = currentLocale === 'en' ? '' : `/${currentLocale}`;
  
  const navItems = [
    { href: `${basePath}/`, label: 'Home', icon: Gamepad2 },
    { href: `${basePath}/games`, label: 'Games', icon: Gamepad2 },
    { href: `${basePath}/categories`, label: 'Categories', icon: Gamepad2 },
  ];

  const userNavItems = [
    { href: `${basePath}/profile`, label: 'Profile', icon: User },
    { href: `${basePath}/achievements`, label: 'Achievements', icon: Trophy },
  ];

  // Check if user is admin
  const isAdmin = session?.user?.role === 'admin';

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={`${basePath}/`} className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Game Station
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                             (item.href === `${basePath}/` && pathname === `/${currentLocale}`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={`${basePath}/search`}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === `${basePath}/search`
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
            
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    href={`${basePath}/admin`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === `${basePath}/admin`
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
                
                {userNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  );
                })}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href={`${basePath}/auth/signin`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    <User className="w-4 h-4" />
                    <span className="ml-2">Sign In</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}