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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Info } from "lucide-react";
import { languages, proficiencyLevels } from "@/lib/languages";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getDictionary } from "@/i18n/get-dictionary";

type PageProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

export default function Page4_LanguageProficiency({ dictionary }: PageProps) {
  const { control } = useFormContext<MultiPageFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });
  const formDict = dictionary.applicationForm.languageProficiency;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FormLabel>{formDict.languageProficiency}</FormLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select your language and proficiency level. You can add multiple languages.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-end">
          <FormField
            control={control}
            name={`languages.${index}.language`}
            render={({ field: languageField }) => (
              <FormItem className="flex-1">
                <FormLabel className={index === 0 ? "block" : "sr-only"}>Language</FormLabel>
                <Select onValueChange={languageField.onChange} defaultValue={languageField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={formDict.languagePlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
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
            name={`languages.${index}.level`}
            render={({ field: levelField }) => (
              <FormItem className="flex-1">
                <FormLabel className={index === 0 ? "block" : "sr-only"}>Level</FormLabel>
                <Select onValueChange={levelField.onChange} defaultValue={levelField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={formDict.levelPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
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
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
            className={fields.length === 1 ? "opacity-50 cursor-not-allowed" : ""}
          >
            <MinusCircle className="h-4 w-4 text-red-500" />
            <span className="sr-only">{formDict.deleteLanguage}</span>
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ language: "", level: "" })}
        className="mt-4"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> {formDict.addLanguage}
      </Button>

      <FormField
        control={control}
        name="preparatoryCourse"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                {formDict.preparatoryCourse}
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
