import Link from 'next/link';
import { GraduationCap, Mail, Phone, Send } from 'lucide-react';

const contactInfo = [
  { icon: Send, value: '@studyinrussia200', href: 'https://t.me/studyinrussia200', label: 'Telegram' },
  { icon: Phone, value: '+79191267767', href: 'https://wa.me/79191267767', label: 'WhatsApp' },
  { icon: Mail, value: 'studyinrussia200@gmail.com', href: 'mailto:studyinrussia200@gmail.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">
                Global Pathways Hub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in securing admission to top Russian universities.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">Contact Us</h3>
            <ul className="space-y-2">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
                <li><Link href="/services" className="text-muted-foreground hover:text-primary">Services</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary">Student Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Global Pathways Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
