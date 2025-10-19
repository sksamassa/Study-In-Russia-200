import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/i18n-config';
import { Mail, Send } from 'lucide-react';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

const contactMethods = [
  {
    icon: Send,
    name: 'Telegram',
    value: '@studyinrussia200',
    href: 'https://t.me/studyinrussia200',
    ctaKey: 'telegramCta',
  },
  {
    icon: WhatsAppIcon,
    name: 'WhatsApp',
    value: '+7 (919) 126-77-67',
    href: 'https://wa.me/79191267767',
    ctaKey: 'whatsappCta',
  },
  {
    icon: Mail,
    name: 'Email',
    value: 'studyinrussia200@gmail.com',
    href: 'mailto:studyinrussia200@gmail.com',
    ctaKey: 'emailCta',
  },
];

export default async function ContactPage({ params }: { params: { lang: Locale } }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);
  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">{dictionary.contact.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {dictionary.contact.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-center">
        {contactMethods.map((method) => (
          <Card key={method.name} className="text-center flex flex-col">
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full w-fit">
                <method.icon className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="pt-4 text-2xl">{method.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center">
              <p className="text-muted-foreground text-lg">{method.value}</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild variant="outline" className="w-full">
                <a href={method.href} target="_blank" rel="noopener noreferrer">
                  {dictionary.contact.cta[method.ctaKey as keyof typeof dictionary.contact.cta]}
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
