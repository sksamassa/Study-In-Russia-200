import { getDictionary } from '@/i18n/get-dictionary';
import { Locale, i18n } from '@/i18n/i18n-config';
import RootLayout from './[lang]/layout';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function RootRouteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
    return (
        <RootLayout params={params}>
            {children}
        </RootLayout>
    )
}
