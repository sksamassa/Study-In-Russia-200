
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDictionary } from '@/i18n/get-dictionary';

export function FAQ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['faq'] }) {
  const categoryKeys = Object.keys(dictionary.categories);
  const faqData = categoryKeys.map(key => ({
      value: key,
      title: dictionary.categories[key as keyof typeof dictionary.categories].title,
      questions: dictionary.categories[key as keyof typeof dictionary.categories].questions
  }));

  return (
    <section id="faq" className="py-16 lg:py-24 bg-background">
      <div className="container">
        <Tabs defaultValue={faqData[0]?.value} className="h-full grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          <div className="col-span-1 bg-gradient-to-br from-primary to-blue-800 text-primary-foreground p-8 z-0 h-full rounded-l-lg">
              <h2 className="text-3xl font-bold mb-6">{dictionary.title}</h2>
              <TabsList className="flex flex-col h-auto bg-transparent items-start p-0">
              {faqData.map((category) => (
                  <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="w-full text-left justify-start p-4 rounded-md text-base data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=inactive]:hover:bg-primary-foreground/10 data-[state=inactive]:text-primary-foreground/80"
                  >
                  {category.title}
                  </TabsTrigger>
              ))}
              </TabsList>
          </div>

          <div className="col-span-2 bg-card p-8 rounded-r-lg relative md:-ml-10 z-10 h-full shadow-lg">
               <div className="pl-0 md:pl-6 h-full">
              {faqData.map((category) => (
                  <TabsContent key={category.value} value={category.value} className="h-full mt-0">
                      <h3 className="text-2xl font-bold mb-4">{category.title}</h3>
                      <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((item, index) => (
                              <AccordionItem key={index} value={`item-${index}`} className="border-b">
                              <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                  {item.answer}
                              </AccordionContent>
                              </AccordionItem>
                          ))}
                      </Accordion>
                  </TabsContent>
              ))}
              </div>
          </div>
        </Tabs>
      </div>
    </section>
  );
}
