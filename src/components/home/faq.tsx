
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getDictionary } from '@/i18n/get-dictionary';

export function FAQ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['faq'] }) {
  const categories = Object.values(dictionary.categories);
  return (
    <section className="py-16 lg:py-24">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{dictionary.title}</h2>
        </div>
        <div className="space-y-8">
            {categories.map((category) => (
                <div key={category.title}>
                    <h3 className="text-2xl font-semibold mb-4">{category.title}</h3>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                        {category.questions.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="bg-secondary/50 rounded-lg px-4">
                                <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
