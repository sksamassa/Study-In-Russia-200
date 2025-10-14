import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { getDictionary } from '@/i18n/get-dictionary';


const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="#24A1DE"
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.62 6.75-2.03 9.49c-.15.7-.6.86-1.2.53l-2.98-2.2-1.45 1.4c-.17.16-.3.3-.58.3-.39 0-.52-.16-.6-.53l-.78-2.58-2.4-1.1c-.6-.27-.6-.68.12-.96l10.3-4.06c.6-.24 1.1.1 1.05.78z" />
    </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="#25D366"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.47 3.45 1.32 4.9L2 22l5.25-1.38c1.4.82 3.03 1.31 4.79 1.31h.01c5.46 0 9.91-4.45 9.91-9.92C21.95 6.45 17.5 2 12.04 2zM9.54 7.5c.21 0 .42.02.62.05.2.03.3.36.26.56l-.37 1.15c-.04.14.04.3.18.42l.85.73c.12.1.2.24.18.39l-.19.6s-.04.15 0 .22c.04.07.1.1.18.15.08.05.42.21.94.43.52.22 1.13.43 1.34.43.21 0 .4-.02.57-.2.17-.18.45-.56.45-.56s.2-.18.37-.1c.17.08.97.46 1.14.54.17.08.28.13.31.2.03.07.03.43-.12.82-.15.39-.93.9-1.35 1.05-.42.15-1.15.13-1.68-.05-1.32-.45-2.52-1.15-3.5-2.05-1.22-1.13-2.08-2.6-2.26-4.06-.02-.15-.02-.3 0-.43 0-.13.02-.31.02-.31s.02-.15.05-.22c.03-.07.07-.12.13-.16.06-.04.13-.05.2-.05h.6z" />
  </svg>
);

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="#EA4335"
    >
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
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

export function Footer({
  dictionary,
}: {
  dictionary: Awaited<ReturnType<typeof getDictionary>>['Footer'];
}) {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left  justify-items-center items-center">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">
                Study In Russia 200
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {dictionary.description}
            </p>
          </div>

          {/* Column 2: Contact Us */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">
              {dictionary.contactUs}
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
                    <item.icon className="h-6 w-6" />
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">
              {dictionary.quickLinks}
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
            &copy; {new Date().getFullYear()} Study In Russia 200. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
