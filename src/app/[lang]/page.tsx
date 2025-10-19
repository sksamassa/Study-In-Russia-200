import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/i18n-config'
import HomePage from './home-page';

export default async function Home({ params }: { params: { lang: Locale } }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang)
  return <HomePage dictionary={dictionary} lang={lang} />
}
