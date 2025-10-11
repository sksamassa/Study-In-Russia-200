import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, Send } from 'lucide-react';

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
    cta: 'Message Us',
  },
  {
    icon: WhatsAppIcon,
    name: 'WhatsApp',
    value: '+7 (919) 126-77-67',
    href: 'https://wa.me/79191267767',
    cta: 'Chat with Us',
  },
  {
    icon: Mail,
    name: 'Email',
    value: 'studyinrussia200@gmail.com',
    href: 'mailto:studyinrussia200@gmail.com',
    cta: 'Send an Email',
  },
];

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Get in Touch</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Have questions? We&apos;re here to help. Reach out to us through any of our channels, or send us a message using the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
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
                  {method.cta}
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

       <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Send Us a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="e.g., Question about visa support" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea id="message" rows={6} placeholder="Please describe your inquiry in detail..." />
            </div>
            <div className="text-center">
              <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Send Message</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
