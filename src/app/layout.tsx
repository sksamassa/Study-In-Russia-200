
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale, i18n } from '@/i18n/i18n-config';
import RootLayoutComponent from './[lang]/layout';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
    const dictionary = await getDictionary(params.lang);
    return (
        <RootLayoutComponent params={params} headerDictionary={dictionary.header} footerDictionary={dictionary.footer}>
            {children}
        </RootLayoutComponent>
    )
}
