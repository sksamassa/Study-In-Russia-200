"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { MultiPageFormData } from "@/lib/form-schemas";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { countryCodes } from "@/lib/country-codes";
import { getDictionary } from "@/i18n/get-dictionary";

type PageProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

export default function Page2_ContactInformation({ dictionary }: PageProps) {
  const { control, watch, setValue, getValues } = useFormContext<MultiPageFormData>();
  const citizenship = watch("citizenship");
  const formDict = dictionary.applicationForm.contactInfo;

  useEffect(() => {
    if (citizenship) {
      const countryCode = countryCodes[citizenship];
      if (countryCode) {
        const currentPhoneNumber = getValues("telegramWhatsAppNumber");
        if (!currentPhoneNumber || !currentPhoneNumber.startsWith(countryCode)) {
          setValue("telegramWhatsAppNumber", countryCode, { shouldValidate: true });
        }
      }
    }
  }, [citizenship, setValue, getValues]);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formDict.email}*</FormLabel>
            <FormControl>
              <Input placeholder={formDict.emailPlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="telegramWhatsAppNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formDict.telegramWhatsAppNumber}*</FormLabel>
            <FormControl>
              <Input placeholder={formDict.telegramWhatsAppNumberPlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
