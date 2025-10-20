
'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { getDictionary } from '@/i18n/get-dictionary';

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.62 6.75-2.03 9.49c-.15.7-.6.86-1.2.53l-2.98-2.2-1.45 1.4c-.17.16-.3.3-.58.3-.39 0-.52-.16-.6-.53l-.78-2.58-2.4-1.1c-.6-.27-.6-.68.12-.96l10.3-4.06c.6-.24 1.1.1 1.05.78z" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.78.47 3.45 1.32 4.9L2 22l5.25-1.38c1.4.82 3.03 1.31 4.79 1.31h.01c5.46 0 9.91-4.45 9.91-9.92C21.95 6.45 17.5 2 12.04 2zM9.54 7.5c.21 0 .42.02.62.05.2.03.3.36.26.56l-.37 1.15c-.04.14.04.3.18.42l.85.73c.12.1.2.24.18.39l-.19.6s-.04.15 0 .22c.04.07.1.1.18.15.08.05.42.21.94.43.52.22 1.13.43 1.34.43.21 0 .4-.02.57-.2.17-.18.45-.56.45-.56s.2-.18.37-.1c.17.08.97.46 1.14.54.17.08.28.13.31.2.03.07.03.43-.12.82-.15.39-.93.9-1.35 1.05-.42.15-1.15.13-1.68-.05-1.32-.45-2.52-1.15-3.5-2.05-1.22-1.13-2.08-2.6-2.26-4.06-.02-.15-.02-.3 0-.43 0-.13.02-.31.02-.31s.02-.15.05-.22c.03-.07.07-.12.13-.16.06-.04.13-.05.2-.05h.6z" />
  </svg>
);


const contactMethods = [
    {
      icon: TelegramIcon,
      name: 'Telegram',
      href: 'https://t.me/studyinrussia200',
      color: 'text-sky-500',
      hoverColor: 'hover:bg-sky-500/10'
    },
    {
      icon: WhatsAppIcon,
      name: 'WhatsApp',
      href: 'https://wa.me/79191267767',
      color: 'text-green-500',
      hoverColor: 'hover:bg-green-500/10'
    },
];

export function FreeConsultationButton({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['footer'] }) {
  const [isOpen, setIsOpen] = useState(false);
  const circularText = `${dictionary.freeConsultation} ${dictionary.freeConsultation}`;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
            <button className="group relative w-24 h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 shadow-2xl">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] group-hover:animate-[spin_4s_linear_infinite]">
                    <defs>
                        <path id="circle" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
                    </defs>
                    <text dy="6" fill="hsl(var(--primary-foreground))" className="text-[10px] md:text-[10.5px] font-semibold uppercase tracking-wider">
                        <textPath xlinkHref="#circle">
                            {circularText}
                        </textPath>
                    </text>
                </svg>
                <MessageSquare className="w-7 h-7 md:w-8 md:h-8" />
            </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2 mb-2" align="end">
        <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-center text-muted-foreground p-2">{dictionary.freeConsultationTitle}</p>
            {contactMethods.map((method) => (
                <a
                    key={method.name}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "flex items-center gap-3 p-2 rounded-md text-sm transition-colors",
                        method.hoverColor
                    )}
                >
                    <method.icon className={cn("w-6 h-6", method.color)} />
                    <span>{method.name}</span>
                </a>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
