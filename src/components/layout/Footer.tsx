import Link from 'next/link';
import { GraduationCap, Mail, Phone, Send } from 'lucide-react';

const contactInfo = {
  social: [
    {
      icon: Send,
      value: '@studyinrussia200',
      href: 'https://t.me/studyinrussia200',
      label: 'Telegram',
    },
  ],
  whatsapp: [
    { value: '+7 (919) 126-77-67', href: 'https://wa.me/79191267767' },
    { value: '+7 (999) 126-77-67', href: 'https://wa.me/79991267767' },
  ],
  phone: [
    { value: '+7 (919) 126-77-67', href: 'tel:+79191267767' },
    { value: '+7 (999) 126-77-67', href: 'tel:+79991267767' },
  ],
  email: [
    {
      value: 'studyinrussia200@gmail.com',
      href: 'mailto:studyinrussia200@gmail.com',
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Social */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">
                Global Pathways Hub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your trusted partner in securing admission to top Russian
              universities.
            </p>
            <div className="flex space-x-4">
              {contactInfo.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: WhatsApp */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">
              WhatsApp
            </h3>
            <ul className="space-y-2">
              {contactInfo.whatsapp.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Telephone */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">
              Telephone
            </h3>
            <ul className="space-y-2 text-sm">
              {contactInfo.phone.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Email */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">Email</h3>
            <ul className="space-y-2 text-sm">
              {contactInfo.email.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Global Pathways Hub. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
