
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../theme-toggle';
import { LanguageSwitcher } from '../language-switcher';
import type { getDictionary } from '@/i18n/get-dictionary';


export function Header({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['header'] }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const lang = pathname.split('/')[1];

  const navLinks = [
    { href: `/${lang}/services`, label: dictionary.services },
    { href: `/${lang}/blog`, label: dictionary.blog },
    { href: `/${lang}/contact`, label: dictionary.contact },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <span className="font-bold font-headline text-2xl">
                {dictionary.title}
              </span>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {dictionary.subtitle}
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
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <GraduationCap className="h-7 w-7 text-primary" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-6 text-lg font-medium md:flex">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            )})}
          </nav>
          <div className="flex items-center">
            <LanguageSwitcher />
            <ThemeToggle />
             <Button asChild className="ml-4">
                <Link href={`/${lang}/application`}>{dictionary.applyNow}</Link>
             </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4">
            <nav className="grid gap-4">
              {navLinks.map((link) => {
                 const isActive = pathname.startsWith(link.href);
                return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              )})}
              <Button asChild className="w-full">
                <Link href={`/${lang}/application`} onClick={() => setIsMenuOpen(false)}>{dictionary.applyNow}</Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
