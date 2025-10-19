import MultiPageApplicationForm from "@/components/multi-page-application-form";
import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function ApplicationPage({
  params,
}: {
  params: { lang: Locale };
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          {dictionary.application.title}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {dictionary.application.description}
        </p>
      </div>
      <MultiPageApplicationForm />
    </section>
  );
}
