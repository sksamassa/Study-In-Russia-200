import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { School, FileText, CheckCircle, Plane, Bot, DollarSign, Banknote, Bitcoin, Info } from 'lucide-react';

const services = [
    {
        icon: School,
        title: 'Study Invitation Assistance',
        description: 'The first and most crucial step is securing an official Study Invitation Letter from a Russian university. We liaise with our partner institutions to ensure your application is prioritized and processed efficiently, dramatically increasing your chances of receiving this vital document.',
        details: [
            'Consultation on university and course selection.',
            'Application submission to your chosen university.',
            'Follow-up with university administration.',
            'Secure delivery of the original invitation letter.'
        ]
    },
    {
        icon: FileText,
        title: 'Student Visa Support',
        description: 'Navigating the Russian student visa process can be complex. Our experienced team provides step-by-step guidance, from filling out the application form to preparing for the consulate interview. We stay up-to-date with the latest regulations to ensure a smooth process.',
        details: [
            'Comprehensive checklist of required documents.',
            'Assistance with online application form completion.',
            'Guidance on scheduling consulate appointments.',
            'Preparation tips for the visa interview.'
        ]
    },
    {
        icon: Bot,
        title: 'AI-Powered Document Assistance',
        description: 'Ensure your documents meet the strict requirements of Russian universities and immigration authorities. Our platform uses Generative AI to verify your uploaded documents for authenticity, readability, and compliance. We also assist with professional translation and legalization services.',
        details: [
            'AI-driven verification of document quality and veracity.',
            'Extraction of key information for your application.',
            'Management of translation services (e.g., Russian, English).',
            'Guidance on Apostille and consular legalization processes.'
        ]
    },
    {
        icon: Plane,
        title: 'Airport Reception & Onboarding',
        description: 'We ensure your arrival in Russia is welcoming and stress-free. A representative from our agency will meet you at the airport, transfer you safely to your university dormitory or pre-arranged accommodation, and help you with the initial registration and settlement procedures.',
        details: [
            'Pre-arrival briefing and coordination.',
            'Personalized airport pickup service.',
            'Assistance with university registration and medical check-ups.',
            'Welcome kit including a local SIM card and city map.'
        ]
    }
];

export default function ServicesPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold">Our Services</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    We provide an end-to-end solution for international students, making your dream of studying in Russia a reality.
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
                                <h4 className="font-semibold text-lg mb-4">What's Included:</h4>
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
                        <CardTitle className="text-2xl">Fees and Additional Expenses</CardTitle>
                        <CardDescription className="mt-2 text-2xl font-bold text-accent">USD $600.00</CardDescription>
                    </div>
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold text-lg mb-4">Payment Methods:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <Banknote className="h-5 w-5 text-primary mr-3" />
                                        <span className="text-muted-foreground">Bank Transfer</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Bitcoin className="h-5 w-5 text-primary mr-3" />
                                        <span className="text-muted-foreground">Cryptocurrency Deposit</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                         <div className="mt-6 flex items-start text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                            <Info className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <p>
                                Please note: Your study invitation will be issued and sent upon receipt of payment.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    );
}
