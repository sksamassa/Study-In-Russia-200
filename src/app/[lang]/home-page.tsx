
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
import { Step01Icon, Step02Icon, Step03Icon, Step04Icon } from '@/components/icons/steps';
import { CheckCircle } from 'lucide-react';


type HomePageProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>;
    lang: Locale;
}

export default function HomePage({ dictionary, lang }: HomePageProps) {
    const stickyScrollContent = [
        {
            title: dictionary.stickyScroll.steps.step1.title,
            description: (
                <ul className="space-y-2">
                    {dictionary.stickyScroll.steps.step1.steps.map((stepText, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{stepText}</span>
                        </li>
                    ))}
                </ul>
            ),
            icon: <Step01Icon className="w-10 h-10" />
        },
        {
            title: dictionary.stickyScroll.steps.step2.title,
            description: (
                <ul className="space-y-2">
                    {dictionary.stickyScroll.steps.step2.steps.map((stepText, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{stepText}</span>
                        </li>
                    ))}
                </ul>
            ),
            icon: <Step02Icon className="w-10 h-10" />
        },
        {
            title: dictionary.stickyScroll.steps.step3.title,
            description: (
                <ul className="space-y-2">
                    {dictionary.stickyScroll.steps.step3.steps.map((stepText, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{stepText}</span>
                        </li>
                    ))}
                </ul>
            ),
            icon: <Step03Icon className="w-10 h-10" />
        },
        {
            title: dictionary.stickyScroll.steps.step4.title,
            description: (
                <ul className="space-y-2">
                    {dictionary.stickyScroll.steps.step4.steps.map((stepText, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                            <span>{stepText}</span>
                        </li>
                    ))}
                </ul>
            ),
            icon: <Step04Icon className="w-10 h-10" />
        },
    ];

    return (
        <SmoothScroll>
            <Hero dictionary={dictionary.hero} lang={lang} />
            <ServicesSection dictionary={dictionary.services} />
            <StickyScroll content={stickyScrollContent} />
            <Metrics dictionary={dictionary.metrics} />
            <RussianCities dictionary={dictionary.cities} />
            <FAQ dictionary={dictionary.faq} />
        </SmoothScroll>
    )
}
