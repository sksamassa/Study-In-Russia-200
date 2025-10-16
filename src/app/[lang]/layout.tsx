
'use client';
import '../globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SmoothScroll } from '@/components/smooth-scroll';
import { Locale } from '@/i18n/i18n-config';
import type { getDictionary } from '@/i18n/get-dictionary';

export default function RootLayout({
  children,
  params,
  headerDictionary,
  footerDictionary,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
  headerDictionary: Awaited<ReturnType<typeof getDictionary>>['header'];
  footerDictionary: Awaited<ReturnType<typeof getDictionary>>['footer'];
}>) {
  const pathname = usePathname();
  return (
    <html lang={params.lang} suppressHydrationWarning>
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
              <Header lang={params.lang} dictionary={headerDictionary} />
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
              <Footer lang={params.lang} dictionary={footerDictionary} />
            </div>
            <Toaster />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
