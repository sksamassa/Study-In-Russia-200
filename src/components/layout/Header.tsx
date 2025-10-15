'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../theme-toggle';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <span className="font-bold font-headline text-2xl">
                Study In Russia 200
              </span>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                Your Gateway to Russian Higher Education
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center md:hidden">
          <button
            className="mr-2 rounded-md p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="sr-only">Toggle menu</span>
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-7 w-7 text-primary" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-6 text-lg font-medium md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center">
            <ThemeToggle />
            
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4">
            <nav className="grid gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === link.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
