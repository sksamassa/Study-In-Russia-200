import { ApplicationForm } from '@/components/application-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
    title: 'Application - Study In Russia 200',
    description: 'Submit your application to study in Russia. Our AI-powered system will help verify your documents.',
};

export default function ApplicationPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl md:text-4xl">University Application</CardTitle>
                        <CardDescription className="text-lg">
                            Fill out the form below to start your application. Our team will verify your documents using AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="p-1 pr-4">
                            <ApplicationForm />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
