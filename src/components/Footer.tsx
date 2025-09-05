'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Mail, Github, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  
  // Get current locale from pathname
  const getCurrentLocale = () => {
    const match = pathname.match(/^\/([a-z]{2})/);
    return match ? match[1] : 'en';
  };
  
  const currentLocale = getCurrentLocale();
  const basePath = currentLocale === 'en' ? '' : `/${currentLocale}`;
  
  const footerLinks = [
    {
      title: 'Games',
      links: [
        { href: `${basePath}/`, label: 'Home' },
        { href: `${basePath}/games`, label: 'All Games' },
        { href: `${basePath}/categories`, label: 'Categories' },
        { href: `${basePath}/search`, label: 'Search' },
      ]
    },
    {
      title: 'Support',
      links: [
        { href: `${basePath}/about`, label: 'About Us' },
        { href: `${basePath}/contact`, label: 'Contact' },
        { href: `${basePath}/privacy`, label: 'Privacy Policy' },
        { href: `${basePath}/terms`, label: 'Terms of Service' },
      ]
    },
    {
      title: 'Connect',
      links: [
        { href: 'mailto:support@gamestation.com', label: 'support@gamestation.com', icon: Mail },
        { href: 'https://github.com', label: 'GitHub', icon: Github },
        { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
        { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`${basePath}/`} className="text-xl font-bold text-indigo-400 flex items-center gap-2 mb-4">
              <Gamepad2 className="w-6 h-6" />
              Game Station
            </Link>
            <p className="text-gray-400 mb-4">
              Play the best HTML5 games in your browser. No downloads, no installations - just pure gaming fun!
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('http') || link.href.startsWith('mailto') ? (
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                        target={link.href.startsWith('mailto') ? '_self' : '_blank'}
                        rel={link.href.startsWith('mailto') ? '' : 'noopener noreferrer'}
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                      </a>
                    ) : (
                      <Link 
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Game Station. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href={`${basePath}/privacy`} className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href={`${basePath}/terms`} className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href={`${basePath}/cookies`} className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}