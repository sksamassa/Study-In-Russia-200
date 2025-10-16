
'use client';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/i18n-config';
import Image from 'next/image';
import Link from 'next/link';

export function Hero({ dictionary, lang }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['hero'], lang: Locale }) {
  const heroImage = PlaceHolderImages.find(img => img.id === 'blog-4')!;
  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage.imageUrl}
          alt="Lomonosov Moscow State University"
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">
          {dictionary.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          {dictionary.subtitle}
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href={`/${lang}/application`}>{dictionary.cta}</Link>
        </Button>
      </div>
    </section>
  );
}
