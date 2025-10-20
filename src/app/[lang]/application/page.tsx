import MultiPageApplicationForm from "@/components/multi-page-application-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function ApplicationPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <MultiPageApplicationForm dictionary={dictionary} />
    </section>
  );
}
