import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FilePlus, Files, School } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Student!</h1>
        <p className="text-muted-foreground">
          Here&apos;s a quick overview of your journey with us.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Applications
            </CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              (Lomonosov Moscow State University)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Application Status
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">In Review</div>
            <p className="text-xs text-muted-foreground">
              Your documents are being reviewed by the university.
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Start a New Application
            </CardTitle>
            <CardDescription className="text-xs">
              Ready to apply to another university?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/apply">
                <FilePlus className="mr-2 h-4 w-4" />
                New Application
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Here are your recommended next actions to ensure your application
            progresses smoothly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-3 animate-pulse"></span>
                Prepare for potential online interview with the university admissions committee.
            </li>
             <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-gray-400 mr-3"></span>
                Await visa invitation letter (est. 2-4 weeks).
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
