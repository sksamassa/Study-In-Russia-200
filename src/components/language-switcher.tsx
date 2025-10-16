'use client';

import { ChevronDown, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';
import { CircleFlag } from 'react-circle-flags';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { i18n, type Locale } from '@/i18n/i18n-config';
import { cn } from '@/lib/utils';

type Language = {
  code: Locale;
  name: string;
  countryCode: string;
};

const languages: Language[] = [
    { code: 'en', name: 'English', countryCode: 'gb' },
    { code: 'fr', name: 'Français', countryCode: 'fr' },
    { code: 'ar', name: 'العربية', countryCode: 'sa' },
    { code: 'es', name: 'Español', countryCode: 'es' },
    { code: 'pt', name: 'Português', countryCode: 'pt' },
    { code: 'zh', name: '中文', countryCode: 'cn' },
    { code: 'tr', name: 'Türkçe', countryCode: 'tr' },
    { code: 'hi', name: 'हिन्दी', countryCode: 'in' },
    { code: 'af', name: 'Afrikaans', countryCode: 'za' },
];

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages.find(l => l.code === i18n.defaultLocale)!);

  useEffect(() => {
    const currentLocale = pathname.split('/')[1] as Locale;
    const lang = languages.find(l => l.code === currentLocale) || languages.find(l => l.code === i18n.defaultLocale)!;
    setCurrentLanguage(lang);
  }, [pathname]);

  const onSelectLocale = (locale: Locale) => {
    const newPathname = pathname.replace(
      /^\/[a-z]{2}(-[A-Z]{2})?/,
      `/${locale}`
    );
    startTransition(() => {
      router.replace(newPathname);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" disabled={isPending} className="flex items-center gap-2">
          <CircleFlag countryCode={currentLanguage.countryCode} className="w-5 h-5" />
          <span className="hidden md:inline">{currentLanguage.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onSelectLocale(lang.code)}
            className={cn("flex items-center gap-2", {
                'font-bold': lang.code === currentLanguage.code,
            })}
          >
            <CircleFlag countryCode={lang.countryCode} className="w-5 h-5" />
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
