
"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { MultiPageFormData } from "@/lib/form-schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Info, Plus, X, File as FileIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/i18n/get-dictionary";
import { useFormField } from "../ui/form";

type PageProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

// This is a placeholder for a more complex file upload component
const FileUpload = ({
  onChange,
  value,
  label,
  description,
  tooltipText,
  dictionary,
  name
}: {
  onChange: (files: File[]) => void;
  value: File[];
  label: string;
  description: string;
  tooltipText: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  name: keyof MultiPageFormData;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { getFieldState, formState } = useFormContext<MultiPageFormData>();
  const { error } = getFieldState(name, formState);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      onChange([...(value || []), ...newFiles]);
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = (value || []).filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const getFileError = (index: number) => {
    if (Array.isArray(error)) {
        const fileError = error[index];
        if (fileError && typeof fileError === 'object' && 'message' in fileError) {
            return fileError.message as string;
        }
    }
    return null;
  }

  return (
    <div className="space-y-4 border-b pb-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FormLabel>{label}</FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUploadClick}
        >
          <Plus className="mr-2 h-4 w-4" />
          {dictionary.applicationForm.documents.uploadFile}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".jpg, .jpeg, .png, .pdf"
        />
      </div>

      <div className="space-y-2">
        {(value || []).map((file, index) => {
           const fileError = getFileError(index);
           return (
            <div key={index}>
              <div
                className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium text-foreground truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => handleDeleteFile(index)}
                >
                  <X className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
              {fileError && <p className="text-sm font-medium text-destructive mt-1">{fileError}</p>}
            </div>
           )
        })}
        {typeof error?.message === 'string' && <p className="text-sm font-medium text-destructive">{error.message}</p>}
      </div>
    </div>
  );
};


export default function Page5_Documents({ dictionary }: PageProps) {
  const { control } = useFormContext<MultiPageFormData>();
  const formDict = dictionary.applicationForm.documents;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-secondary/50 p-4 space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{formDict.supportedFormats}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{formDict.maxFileSize}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{formDict.maxTotalSize}</span>
        </p>
      </div>

      <FormField
        control={control}
        name="passport"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUpload
                name="passport"
                label={formDict.passportLabel}
                description={formDict.passportDescription}
                tooltipText={formDict.passportTooltip}
                onChange={field.onChange}
                value={field.value}
                dictionary={dictionary}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="educationalDegree"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUpload
                name="educationalDegree"
                label={formDict.educationalDegreeLabel}
                description={formDict.educationalDegreeDescription}
                tooltipText={formDict.educationalDegreeTooltip}
                onChange={field.onChange}
                value={field.value}
                dictionary={dictionary}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
