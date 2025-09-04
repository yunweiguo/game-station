'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Search, User } from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Home', icon: Gamepad2 },
    { href: '/games', label: 'Games', icon: Gamepad2 },
    { href: '/categories', label: 'Categories', icon: Gamepad2 },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Game Station
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
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
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/search"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}