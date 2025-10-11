import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <path d="M15 10l-4 4 6 6 4-16-18 7 4 2 2 6 3-4z"></path>
    </svg>
);

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

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);


const contactMethods = [
  {
    icon: TelegramIcon,
    value: '@studyinrussia200',
    href: 'https://t.me/studyinrussia200',
  },
  {
    icon: WhatsAppIcon,
    value: '+79191267767',
    href: 'https://wa.me/79191267767',
  },
  {
    icon: MailIcon,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
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
