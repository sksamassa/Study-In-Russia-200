
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { handleApplicationSubmit, ApplicationState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CountryDropdownSingle } from '../components/country-dropdown-single';
import { CountryDropdown } from './ui/country-dropdown';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Upload,
  File as FileIcon,
  Info,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const initialState: ApplicationState = {
  status: 'idle',
  message: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying & Submitting...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" /> Submit Application
        </>
      )}
    </Button>
  );
}

function ResultCard({ title, icon: Icon, success, children }: { title: string; icon: React.ElementType, success: boolean; children: React.ReactNode }) {
    return (
        <div className={cn("p-4 rounded-lg border", success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')}>
            <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5", success ? 'text-green-600' : 'text-red-600')} />
                <h3 className={cn("font-semibold", success ? 'text-green-800' : 'text-red-800')}>{title}</h3>
            </div>
            <div className="mt-2 pl-8 text-sm text-muted-foreground">
                {children}
            </div>
        </div>
    )
}

function FileUploadField({
    name,
    label,
    description,
    tooltip,
    error,
    multiple = false
} : {
    name: string,
    label: string,
    description: string,
    tooltip: string,
    error?: string,
    multiple?: boolean
}) {
  const [files, setFiles] = useState<File[]>([]);
  const id = `file-upload-${name}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        if (multiple) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        } else {
            setFiles(Array.from(e.target.files));
        }
      }
  }

  const handleRemoveFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
  }

  return (
      <div className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
              <div>
                  <h4 className="font-medium flex items-center gap-2">
                      {label}
                      <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>{tooltip}</p>
                              </TooltipContent>
                          </Tooltip>
                      </TooltipProvider>
                  </h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                  <label htmlFor={id} className="cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Upload a file
                  </label>
              </Button>
              <input 
                id={id} 
                name={name} 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                multiple={multiple} 
                accept=".pdf,.jpg,.jpeg,.png"
              />
          </div>

          {files.length > 0 && (
              <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md">
                          <div className="flex items-center gap-2 text-sm">
                            <FileIcon className="h-4 w-4 text-primary" />
                            <span className="font-medium">{file.name}</span>
                            <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(index)}>
                              <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                      </div>
                  ))}
              </div>
          )}
          
           {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
  )
}

export function ApplicationForm() {
  const [state, formAction] = useFormState(handleApplicationSubmit, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
      });
    }
  }, [state, toast]);

  if (state.status === 'success' && state.data) {
    return (
      <div className="space-y-6">
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 !text-green-600" />
            <AlertTitle>Verification and Extraction Successful!</AlertTitle>
            <AlertDescription>
                Your document has passed all checks and the relevant information has been extracted.
            </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle>Verification Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ResultCard title="Authenticity Check" icon={CheckCircle} success={state.data.veracity.isAuthentic}>The document appears authentic.</ResultCard>
                <ResultCard title="Readability Check" icon={CheckCircle} success={state.data.veracity.isReadable}>The document is clear and readable.</ResultCard>
                <ResultCard title="Requirements Met" icon={CheckCircle} success={state.data.veracity.meetsRequirements}>The document meets university requirements.</ResultCard>
            </CardContent>
        </Card>
        
        {state.data.extraction && (
          <Card>
            <CardHeader>
              <CardTitle>Extracted Information</CardTitle>
              <CardDescription>
                Our AI has extracted the following information from your document. Please review it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-secondary rounded-md overflow-x-auto text-sm">
                {JSON.stringify(state.data.extraction, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Button onClick={() => window.location.reload()} variant="outline">Start New Application</Button>
      </div>
    );
  }
  
    if (state.status === 'error' && state.data) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Document Verification Failed</AlertTitle>
            <AlertDescription>
                {state.message || "Your document could not be verified. Please review the issues below."}
            </AlertDescription>
        </Alert>
        <Card>
            <CardHeader>
                <CardTitle>Verification Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ResultCard title="Authenticity Check" icon={state.data.veracity.isAuthentic ? CheckCircle : XCircle} success={state.data.veracity.isAuthentic}>
                    {state.data.veracity.isAuthentic ? "The document appears authentic." : "Authenticity could not be confirmed."}
                </ResultCard>
                <ResultCard title="Readability Check" icon={state.data.veracity.isReadable ? CheckCircle : XCircle} success={state.data.veracity.isReadable}>
                    {state.data.veracity.isReadable ? "The document is clear and readable." : "The document is blurry or unreadable."}
                </ResultCard>
                <ResultCard title="Requirements Met" icon={state.data.veracity.meetsRequirements ? CheckCircle : XCircle} success={state.data.veracity.meetsRequirements}>
                    {state.data.veracity.meetsRequirements ? "The document meets university requirements." : "The document does not meet university requirements."}
                </ResultCard>
                 {!state.data.veracity.meetsRequirements && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Reason:</AlertTitle>
                        <AlertDescription>{state.data.veracity.errors}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.status === 'error' && !state.data && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {state.message ||
              'An unexpected error occurred. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
        <div className="space-y-2">
            <Label htmlFor="firstName">First Name*</Label>
            <Input id="firstName" name="firstName" placeholder="Your first name" required />
            {state.errors?.firstName && <p className="text-sm text-destructive">{state.errors.firstName[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name</Label>
            <Input id="middleName" name="middleName" placeholder="Optional" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="lastName">Last Name*</Label>
            <Input id="lastName" name="lastName" placeholder="Your last name" required />
            {state.errors?.lastName && <p className="text-sm text-destructive">{state.errors.lastName[0]}</p>}
        </div>
        <div className="space-y-2">
            {/* <Label htmlFor="citizenship">Citizenship*</Label> */}
            <CountryDropdown />
            <Input id="citizenship" name="citizenship" placeholder="Your country of citizenship" required />
            {state.errors?.citizenship && <p className="text-sm text-destructive">{state.errors.citizenship[0]}</p>}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
        <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="phone">Telegram/WhatsApp Number*</Label>
            <Input id="phone" name="phone" placeholder="+1234567890" required />
            {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Documents</h3>
        <FileUploadField 
            name="passport"
            label="Passport (original)*"
            description="Scanned Copy of the Original Document"
            tooltip="Please upload a clear, full-page color scan of your passport's bio-data page."
            error={state.errors?.passport?.[0]}
        />
         <div className="mt-2 flex items-start text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
            <Info className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <p>Please note: Your study invitation will be issued and sent upon receipt of payment.</p>
        </div>

        <FileUploadField 
            name="education"
            label="Educational degree (original)*"
            description="Scanned Copy of the Original Document(s)"
            tooltip="Upload your high school diploma, bachelor's degree, or any relevant academic certificates."
            error={state.errors?.education?.[0]}
            multiple
        />
      </div>

      <SubmitButton />
    </form>
  );
}
