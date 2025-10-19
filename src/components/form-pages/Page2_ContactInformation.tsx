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

export default function Page2_ContactInformation() {
  const { control, watch, setValue, getValues } = useFormContext<MultiPageFormData>();
  const citizenship = watch("citizenship");

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
            <FormLabel>Email*</FormLabel>
            <FormControl>
              <Input placeholder="john.doe@example.com" {...field} />
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
            <FormLabel>Telegram/WhatsApp Number*</FormLabel>
            <FormControl>
              <Input placeholder="+1234567890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
