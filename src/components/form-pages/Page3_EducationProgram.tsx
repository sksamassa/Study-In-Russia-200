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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { educationLevels, generalFieldsOfStudy, fieldsOfStudy } from "@/lib/education-data";

export default function Page3_EducationProgram() {
  const { control } = useFormContext<MultiPageFormData>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="educationLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education Level*</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="generalFieldOfStudy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>General Field of Study*</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select general field of study" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {generalFieldsOfStudy.map((fieldOfStudy) => (
                  <SelectItem key={fieldOfStudy} value={fieldOfStudy}>
                    {fieldOfStudy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="fieldOfStudy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Field of Study*</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select specific field of study" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fieldsOfStudy.map((specificField) => (
                  <SelectItem key={specificField} value={specificField}>
                    {specificField}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
