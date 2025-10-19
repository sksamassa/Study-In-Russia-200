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

// This is a placeholder for a more complex file upload component
const FileUpload = ({
  onChange,
  value,
  label,
  description,
  tooltipText,
}: {
  onChange: (files: File[]) => void;
  value: File[];
  label: string;
  description: string;
  tooltipText: string;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
          Upload a file
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
        {(value || []).map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-md bg-muted/50 p-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-foreground">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleDeleteFile(index)}
            >
              <X className="h-4 w-4 text-destructive" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default function Page5_Documents() {
  const { control } = useFormContext<MultiPageFormData>();

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-secondary/50 p-4 space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Supported file formats:</span> .jpeg, .jpg, .png, .pdf
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">The size of each file should not exceed 5 MB</span>
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">All files together may not exceed 50 MB</span>
        </p>
      </div>

      <FormField
        control={control}
        name="passport"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUpload
                label="Passport (original)*"
                description="Scanned Copy of the Original Document"
                tooltipText="Please upload a clear, full-page color scan of your passport's bio-data page. The passport should be valid for at least 18 months from the date of your arrival in Russia."
                onChange={field.onChange}
                value={field.value}
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
                label="Educational degree (original)*"
                description="Scanned Copy of the Original Document(s)"
                tooltipText="Upload your high school diploma, bachelor's degree, or any relevant academic certificates."
                onChange={field.onChange}
                value={field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
