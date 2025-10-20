import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n/i18n-config";

export default async function PrivacyPolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const { title, sections, lastUpdated } = dictionary.privacyPolicy;

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{lastUpdated}</p>
        
        {sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-xl font-semibold md:text-2xl">{section.title}</h2>
            {section.content.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
