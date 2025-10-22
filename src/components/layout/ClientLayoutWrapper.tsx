'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { FreeConsultationButton } from '@/components/free-consultation-button';
import { SmoothScroll } from '@/components/smooth-scroll';
import type { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/i18n-config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export default function ClientLayoutWrapper({
  children,
  dictionary,
  lang,
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
  lang: Locale;
}) {
  const pathname = usePathname();
  return (
    <SmoothScroll> {/* Re-added SmoothScroll */}
      <div className="flex min-h-screen flex-col">
        <Header dictionary={dictionary.header} />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname} // Use pathname as key for AnimatePresence for page transitions
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer dictionary={dictionary.footer} />
      </div>
      <Toaster />
      <FreeConsultationButton dictionary={dictionary.footer} />
    </SmoothScroll>
  );
}
