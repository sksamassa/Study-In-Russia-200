
'use client';

import { Hero } from '@/components/home/hero';
import { ServicesSection } from '@/components/home/services-section';
import { StickyScroll } from '@/components/sticky-scroll';
import { Metrics } from '@/components/home/metrics';
import { RussianCities } from '@/components/russian-cities';
import { FAQ } from '@/components/home/faq';
import type { Locale } from '@/i18n/i18n-config';
import type { getDictionary } from '@/i18n/get-dictionary';
import { SmoothScroll } from '@/components/smooth-scroll';


type HomePageProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>;
    lang: Locale;
}

export default function HomePage({ dictionary, lang }: HomePageProps) {
    return (
        <SmoothScroll>
            <Hero dictionary={dictionary.hero} lang={lang} />
            <ServicesSection dictionary={dictionary.services} />
            <StickyScroll dictionary={dictionary.stickyScroll} />
            <Metrics dictionary={dictionary.metrics} />
            <RussianCities dictionary={dictionary.cities} />
            <FAQ dictionary={dictionary.faq} />
        </SmoothScroll>
    )
}
