
'use client';

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import type { getDictionary } from '@/i18n/get-dictionary';
import { usePathname } from 'next/navigation';
import { FaTelegram, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { cn } from '@/lib/utils';


const contactMethods = [
  {
    icon: FaTelegram,
    value: '@studyinrussia200',
    href: 'https://t.me/studyinrussia200',
    hoverBg: 'group-hover:bg-[#0088cc]', // Telegram blue background
  },
  {
    icon: FaWhatsapp,
    value: '+79191267767',
    href: 'https://wa.me/79191267767',
    hoverBg: 'group-hover:bg-[#25D366]', // WhatsApp green background
  },
  {
    icon: SiGmail,
    value: 'studyinrussia200@gmail.com',
    href: 'mailto:studyinrussia200@gmail.com',
    hoverBg: 'group-hover:bg-[#EA4335]', // Gmail red background
  },
];


export function Footer({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['footer'] }) {
    const pathname = usePathname();
    const lang = pathname.split('/')[1];

    const quickLinks = [
        { href: `/${lang}/services`, label: dictionary.links.services },
        { href: `/${lang}/blog`, label: dictionary.links.blog },
        { href: `/${lang}/contact`, label: dictionary.links.contact },
    ];
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left justify-items-center items-center">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link href={`/${lang}`} className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">
                {dictionary.title}
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
                    className="flex items-center justify-center md:justify-start gap-3 text-lg transition-colors group text-muted-foreground hover:text-primary"
                  >
                    <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center transition-colors duration-300 ease-in-out", item.hoverBg)}>
                      <item.icon className="h-5 w-5 transition-colors duration-300 ease-in-out group-hover:text-white" />
                    </div>
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
            <ul className="space-y-2 text-lg">
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
            &copy; {new Date().getFullYear()} {dictionary.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
