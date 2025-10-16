
import { ApplicationForm } from '@/components/application-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/i18n-config';


export const metadata = {
    title: 'Application - Study In Russia 200',
    description: 'Submit your application to study in Russia. Our AI-powered system will help verify your documents.',
};

export const maxDuration = 120;

export default async function ApplicationPage({ params }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(params.lang);
    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl md:text-4xl">{dictionary.application.title}</CardTitle>
                        <CardDescription className="text-lg">
                            {dictionary.application.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="p-1 pr-4">
                            <ApplicationForm dictionary={dictionary.applicationForm}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
