"use client"

import type React from "react"

import { useActionState, useEffect, useState, useRef } from "react"
import { useFormStatus } from "react-dom"
import { handleApplicationSubmit, type ApplicationState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountryDropdown } from "./ui/country-dropdown"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Loader2, AlertCircle, Upload, FileIcon, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import type { Country } from "./ui/country-dropdown"
import { getDictionary } from "@/i18n/get-dictionary"

const initialState: ApplicationState = {
  status: "idle",
  message: null,
}

function SubmitButton({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['applicationForm'] }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {dictionary.submitting}
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" /> {dictionary.submit}
        </>
      )}
    </Button>
  )
}

function ResultCard({
  title,
  icon: Icon,
  success,
  children,
}: { title: string; icon: React.ElementType; success: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("p-4 rounded-lg border", success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
      <div className="flex items-center gap-3">
        <Icon className={cn("h-5 w-5", success ? "text-green-600" : "text-red-600")} />
        <h3 className={cn("font-semibold", success ? "text-green-800" : "text-red-800")}>{title}</h3>
      </div>
      <div className="mt-2 pl-8 text-sm text-muted-foreground">{children}</div>
    </div>
  )
}

function FileUploadField({
  name,
  label,
  description,
  tooltip,
  error,
  multiple = false,
  dictionary
}: {
  name: string
  label: string
  description: string
  tooltip: string
  error?: string
  multiple?: boolean,
  dictionary: Awaited<ReturnType<typeof getDictionary>>['applicationForm']['fileUpload']
}) {
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const id = `file-upload-${name}`

  useEffect(() => {
    if (inputRef.current) {
      const dataTransfer = new DataTransfer()
      files.forEach((file) => dataTransfer.items.add(file))
      inputRef.current.files = dataTransfer.files
    }
  }, [files])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (multiple) {
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
      } else {
        setFiles(Array.from(e.target.files))
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
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
            <Upload className="h-4 w-4" /> {dictionary.upload}
          </label>
        </Button>
        <input
          ref={inputRef}
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

export function ApplicationForm({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>>['applicationForm'] }) {
  const [state, formAction] = useActionState(handleApplicationSubmit, initialState)
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(undefined)
  const [phoneValue, setPhoneValue] = useState("")
  const { toast } = useToast()

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country)
    if (country.countryCallingCodes && country.countryCallingCodes.length > 0) {
      setPhoneValue(country.countryCallingCodes[0])
    }
  }

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast({
        title: dictionary.results.success.title,
        description: state.message,
      })
    }
  }, [state, toast, dictionary])

  if (state.status === "success" && state.data) {
    const resultsDict = dictionary.results.success;
    return (
      <div className="space-y-6">
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4 !text-green-600" />
          <AlertTitle>{resultsDict.title}</AlertTitle>
          <AlertDescription>
            {resultsDict.description}
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>{resultsDict.verificationResults}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResultCard title={resultsDict.authenticityCheck} icon={CheckCircle} success={state.data.veracity.isAuthentic}>
              {resultsDict.appearsAuthentic}
            </ResultCard>
            <ResultCard title={resultsDict.readabilityCheck} icon={CheckCircle} success={state.data.veracity.isReadable}>
              {resultsDict.isClear}
            </ResultCard>
            <ResultCard title={resultsDict.requirementsMet} icon={CheckCircle} success={state.data.veracity.meetsRequirements}>
              {resultsDict.meetsRequirements}
            </ResultCard>
          </CardContent>
        </Card>

        {state.data.extraction && (
          <Card>
            <CardHeader>
              <CardTitle>{resultsDict.extractedInformation}</CardTitle>
              <CardDescription>
                {resultsDict.extractedInformationDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-secondary rounded-md overflow-x-auto text-sm">
                {JSON.stringify(state.data.extraction, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Button onClick={() => window.location.reload()} variant="outline">
          {resultsDict.newApplication}
        </Button>
      </div>
    )
  }

  if (state.status === "error" && state.data) {
    const resultsDict = dictionary.results.error;
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{resultsDict.title}</AlertTitle>
          <AlertDescription>
            {state.message || resultsDict.description}
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>{resultsDict.verificationIssues}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ResultCard
              title={resultsDict.authenticityCheck}
              icon={state.data.veracity.isAuthentic ? CheckCircle : XCircle}
              success={state.data.veracity.isAuthentic}
            >
              {state.data.veracity.isAuthentic
                ? resultsDict.appearsAuthentic
                : resultsDict.authenticityFailed}
            </ResultCard>
            <ResultCard
              title={resultsDict.readabilityCheck}
              icon={state.data.veracity.isReadable ? CheckCircle : XCircle}
              success={state.data.veracity.isReadable}
            >
              {state.data.veracity.isReadable
                ? resultsDict.isClear
                : resultsDict.readabilityFailed}
            </ResultCard>
            <ResultCard
              title={resultsDict.requirementsMet}
              icon={state.data.veracity.meetsRequirements ? CheckCircle : XCircle}
              success={state.data.veracity.meetsRequirements}
            >
              {state.data.veracity.meetsRequirements
                ? resultsDict.meetsRequirements
                : resultsDict.requirementsFailed}
            </ResultCard>
            {!state.data.veracity.meetsRequirements && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{resultsDict.reason}:</AlertTitle>
                <AlertDescription>{state.data.veracity.errors}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        <Button onClick={() => window.location.reload()} variant="outline">
          {resultsDict.tryAgain}
        </Button>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && !state.data && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{dictionary.results.error.title}</AlertTitle>
          <AlertDescription>
            {state.message || dictionary.results.error.unexpected}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{dictionary.personalInfo.title}</h3>
        <div className="space-y-2">
          <Label htmlFor="firstName">{dictionary.personalInfo.firstName}*</Label>
          <Input id="firstName" name="firstName" placeholder={dictionary.personalInfo.firstNamePlaceholder} required />
          {state.errors?.firstName && <p className="text-sm text-destructive">{state.errors.firstName[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">{dictionary.personalInfo.middleName}</Label>
          <Input id="middleName" name="middleName" placeholder={dictionary.personalInfo.middleNamePlaceholder} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{dictionary.personalInfo.lastName}*</Label>
          <Input id="lastName" name="lastName" placeholder={dictionary.personalInfo.lastNamePlaceholder} required />
          {state.errors?.lastName && <p className="text-sm text-destructive">{state.errors.lastName[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="citizenship">{dictionary.personalInfo.citizenship}*</Label>
          <CountryDropdown value={selectedCountry} onChange={handleCountryChange} />
          <input type="hidden" name="citizenship" value={selectedCountry?.name ?? ""} />
          {state.errors?.citizenship && <p className="text-sm text-destructive">{state.errors.citizenship[0]}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{dictionary.contactInfo.title}</h3>
        <div className="space-y-2">
          <Label htmlFor="email">{dictionary.contactInfo.email}*</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{dictionary.contactInfo.phone}*</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+1234567890"
            required
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
          />
          {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">{dictionary.documents.title}</h3>
        <FileUploadField
          name="passport"
          label={dictionary.documents.passportLabel}
          description={dictionary.documents.passportDescription}
          tooltip={dictionary.documents.passportTooltip}
          error={state.errors?.passport?.[0]}
          dictionary={dictionary.fileUpload}
        />
        <div className="mt-2 flex items-start text-xs text-muted-foreground bg-secondary/50 p-2 rounded-lg">
          <Info className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
          <p>{dictionary.documents.paymentNote}</p>
        </div>

        <FileUploadField
          name="education"
          label={dictionary.documents.educationLabel}
          description={dictionary.documents.educationDescription}
          tooltip={dictionary.documents.educationTooltip}
          error={state.errors?.education?.[0]}
          multiple
          dictionary={dictionary.fileUpload}
        />
      </div>

      <SubmitButton dictionary={dictionary} />
    </form>
  )
}
