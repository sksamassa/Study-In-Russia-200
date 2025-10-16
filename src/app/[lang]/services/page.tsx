import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDictionary } from '@/i18n/get-dictionary';
import { Locale } from '@/i18n/i18n-config';
import { School, FileText, Bot, Plane, CheckCircle, DollarSign, Banknote, Bitcoin, Info } from 'lucide-react';


export default async function ServicesPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dictionary = await getDictionary(lang);
    const services = [
        {
            icon: School,
            title: dictionary.servicesPage.services.studyInvitation.title,
            description: dictionary.servicesPage.services.studyInvitation.description,
            details: dictionary.servicesPage.services.studyInvitation.details,
        },
        {
            icon: FileText,
            title: dictionary.servicesPage.services.visaSupport.title,
            description: dictionary.servicesPage.services.visaSupport.description,
            details: dictionary.servicesPage.services.visaSupport.details,
        },
        {
            icon: Bot,
            title: dictionary.servicesPage.services.aiDocumentAssistance.title,
            description: dictionary.servicesPage.services.aiDocumentAssistance.description,
            details: dictionary.servicesPage.services.aiDocumentAssistance.details,
        },
        {
            icon: Plane,
            title: dictionary.servicesPage.services.airportReception.title,
            description: dictionary.servicesPage.services.airportReception.description,
            details: dictionary.servicesPage.services.airportReception.details,
        }
    ];

    return (
        <div className="container px-4 md:px-8 py-12 md:py-20">
            <div className="text-center max-w-3xl mx-auto mb-12 shadow-">
                <h1 className="text-4xl md:text-5xl font-bold">{dictionary.servicesPage.title}</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    {dictionary.servicesPage.description}
                </p>
            </div>

            <div className="grid gap-8 mb-8">
                {services.map((service, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="grid md:grid-cols-2 items-center">
                            <div className="p-8 bg-primary/5 h-full flex flex-col justify-center items-center text-center">
                                <div className="bg-primary/10 rounded-full p-4 mb-4">
                                  <service.icon className="h-12 w-12 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">{service.title}</CardTitle>
                                <CardDescription className="mt-2 max-w-md mx-auto">{service.description}</CardDescription>
                            </div>
                            <div className="p-8">
                                <h4 className="font-semibold text-lg mb-4">{dictionary.servicesPage.whatsIncluded}:</h4>
                                <ul className="space-y-3">
                                    {service.details.map((detail, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground">{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="p-8 bg-accent/5 h-full flex flex-col justify-center items-center text-center">
                        <div className="bg-accent/10 rounded-full p-4 mb-4">
                            <DollarSign className="h-12 w-12 text-accent" />
                        </div>
                        <CardTitle className="text-2xl">{dictionary.servicesPage.fees.title}</CardTitle>
                        <CardDescription className="mt-2 text-2xl font-bold text-accent">USD $600.00</CardDescription>
                    </div>
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold text-lg mb-4">{dictionary.servicesPage.fees.paymentMethods}:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <Banknote className="h-5 w-5 text-primary mr-3" />
                                        <span className="text-muted-foreground">{dictionary.servicesPage.fees.bankTransfer}</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Bitcoin className="h-5 w-5 text-primary mr-3" />
                                        <span className="text-muted-foreground">{dictionary.servicesPage.fees.crypto}</span>
                                    </li>

                                </ul>
                            </div>
                        </div>
                         <div className="mt-6 flex items-start text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                            <Info className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <p>
                                {dictionary.servicesPage.fees.note}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    );
}
