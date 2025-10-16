'use client';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SmoothScroll } from '@/components/smooth-scroll';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale, i18n } from '@/i18n/i18n-config';
import { useEffect, useState } from 'react';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const pathname = usePathname();
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  useEffect(() => {
    const lang = (pathname.split('/')[1] || i18n.defaultLocale) as Locale;
    getDictionary(lang).then(setDictionary);
  }, [pathname]);

  return (
    <html lang={params?.lang ?? 'en'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScroll>
            <div className="flex min-h-screen flex-col">
              {dictionary && <Header dictionary={dictionary.header} />}
                <AnimatePresence mode="wait">
                  <motion.main
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                  >
                    {children}
                  </motion.main>
                </AnimatePresence>
              {dictionary && <Footer dictionary={dictionary.footer} />}
            </div>
            <Toaster />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}