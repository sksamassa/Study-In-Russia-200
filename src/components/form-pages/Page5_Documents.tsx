"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { MultiPageFormData } from "@/lib/form-schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// This is a placeholder for a more complex file upload component
const FileUpload = ({ onChange, value, label, description, tooltipText }: {
  onChange: (files: { name: string; url: string; size: number; type: string; }[]) => void;
  value: { name: string; url: string; size: number; type: string; }[]; // Array of file objects from schema
  label: string;
  description: string;
  tooltipText: string;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // For now, just simulate file objects with name, size, type, url
      const newFiles = Array.from(event.target.files).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file), // Placeholder URL
        size: file.size,
        type: file.type,
      }));
      onChange([...value, ...newFiles]);
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = value.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  return (
    <div className="space-y-2">
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
      <Input type="file" multiple onChange={handleFileChange} />
      <div className="space-y-1">
        {value.map((file, index) => (
          <div key={index} className="flex items-center justify-between rounded-md bg-muted p-2 text-sm">
            <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => handleDeleteFile(index)}>
              <MinusCircle className="h-4 w-4 text-red-500" />
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
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold">Supported file formats:</span> .jpeg, .jpg, .png, .pdf
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold">The size of each file should not exceed 5 MB</span>
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold">All files together may not exceed 50 MB</span>
      </p>

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
