
"use client";

import React, { useState } from "react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { countries } from "@/lib/countries";
import { DateOfBirthPicker } from "../ui/date-picker";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { getDictionary } from "@/i18n/get-dictionary";

type PageProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}

export default function Page1_PersonalInformation({ dictionary }: PageProps) {
  const { control, setValue } = useFormContext<MultiPageFormData>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const formDict = dictionary.applicationForm.personalInfo;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formDict.firstName}*</FormLabel>
            <FormControl>
              <Input placeholder={formDict.firstNamePlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="middleName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formDict.middleName}</FormLabel>
            <FormControl>
              <Input placeholder={formDict.middleNamePlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{formDict.lastName}*</FormLabel>
            <FormControl>
              <Input placeholder={formDict.lastNamePlaceholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="citizenship"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{formDict.citizenship}*</FormLabel>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? countries.find(
                          (country) => country === field.value
                        )
                      : "Select your country"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          value={country}
                          key={country}
                          onSelect={() => {
                            setValue("citizenship", country, { shouldValidate: true });
                            setPopoverOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              country === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {country}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{formDict.dateOfBirth}*</FormLabel>
            <FormControl>
              <DateOfBirthPicker
                date={field.value ? new Date(field.value) : undefined}
                onDateChange={(date) =>
                  field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)
                }
                placeholder="Select date of birth"
                minAge={16}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
