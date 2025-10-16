
'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDictionary } from '@/i18n/get-dictionary';
import { Bot, FileText, Plane, School } from 'lucide-react';

export function ServicesSection({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['services'] }) {
    const services = [
        {
            icon: School,
            title: dictionary.cards.studyInvitationTitle,
            description: dictionary.cards.studyInvitationDescription,
        },
        {
            icon: FileText,
            title: dictionary.cards.visaSupportTitle,
            description: dictionary.cards.visaSupportDescription,
        },
        {
            icon: Bot,
            title: dictionary.cards.documentAssistanceTitle,
            description: dictionary.cards.documentAssistanceDescription,
        },
        {
            icon: Plane,
            title: dictionary.cards.airportReceptionTitle,
            description: dictionary.cards.airportReceptionDescription,
        },
    ];

  return (
    <section className="py-16 lg:py-24 bg-secondary">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">{dictionary.title}</h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            {dictionary.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription className="pt-2">{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
