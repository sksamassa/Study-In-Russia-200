
"use client";

import React, { useEffect, useMemo } from "react";
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
  const { control, watch, setValue } = useFormContext<MultiPageFormData>();
  const generalField = watch("generalFieldOfStudy");
  const specificField = watch("fieldOfStudy");

  const filteredFieldsOfStudy = useMemo(() => {
    if (!generalField) {
      return [];
    }
    const prefix = generalField.split('.')[0];
    return fieldsOfStudy.filter(field => field.startsWith(prefix + '.'));
  }, [generalField]);

  useEffect(() => {
    const currentSpecificFieldIsValid = filteredFieldsOfStudy.includes(specificField);
    if (generalField && !currentSpecificFieldIsValid && specificField) {
      setValue("fieldOfStudy", "", { shouldValidate: true });
    }
  }, [generalField, specificField, filteredFieldsOfStudy, setValue]);

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
            <Select onValueChange={field.onChange} value={field.value} disabled={!generalField}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select specific field of study" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredFieldsOfStudy.map((specificField) => (
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
