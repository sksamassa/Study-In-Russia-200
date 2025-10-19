
'use client';

import { Button } from '@/components/ui/button';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/i18n-config';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Hero({ dictionary, lang }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['hero'], lang: Locale }) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover"
        key="hero-video"
      >
        <source src="/videos/St Basil Cathedral in Russia - Free Stock Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 z-10 w-full h-full bg-black/60"></div>
      <motion.div 
        className="z-20 text-center px-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight font-headline">
          {dictionary.title}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-200">
          {dictionary.subtitle}
        </p>
        <div className="mt-8 flex justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href={`/${lang}`}>{dictionary.cta}</Link>
            </Button>
        </div>
      </motion.div>
    </section>
  );
}
