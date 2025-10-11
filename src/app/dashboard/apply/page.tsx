import { ApplicationForm } from '@/components/application-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ApplyPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Submit New Application</h1>
        <p className="text-muted-foreground">
          Fill out the form below and upload your primary document to begin the
          verification process.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Student & University Information</CardTitle>
          <CardDescription>
            Ensure all information is accurate and matches your official
            documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
