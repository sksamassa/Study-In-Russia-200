import Link from 'next/link';
import { GraduationCap, Mail, Phone, Send } from 'lucide-react';

const contactMethods = [
  {
    icon: Send,
    value: '@studyinrussia200',
    href: 'https://t.me/studyinrussia200',
  },
  {
    icon: Phone,
    value: '+79191267767',
    href: 'tel:+79191267767',
  },
  {
    icon: Mail,
    value: 'studyinrussia200@gmail.com',
    href: 'mailto:studyinrussia200@gmail.com',
  },
];

const quickLinks = [
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Logo & Description */}
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
          </div>

          {/* Column 2: Contact Us */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="space-y-2">
              {contactMethods.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
                {quickLinks.map(link => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-muted-foreground hover:text-primary">
                            {link.label}
                        </Link>
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
