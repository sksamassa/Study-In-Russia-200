"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  multiPageFormSchema,
  personalInfoSchema,
  contactInfoSchema,
  educationProgramSchema,
  languageProficiencySchema,
  documentsSchema,
  MultiPageFormData,
} from "@/lib/form-schemas";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { submitApplication } from "@/lib/actions";

// Page Components
import Page1_PersonalInformation from "./form-pages/Page1_PersonalInformation";
import Page2_ContactInformation from "./form-pages/Page2_ContactInformation";
import Page3_EducationProgram from "./form-pages/Page3_EducationProgram";
import Page4_LanguageProficiency from "./form-pages/Page4_LanguageProficiency";
import Page5_Documents from "./form-pages/Page5_Documents";

const steps = [
  { id: "personalInfo", name: "Personal Information", schema: personalInfoSchema, component: Page1_PersonalInformation },
  { id: "contactInfo", name: "Contact Information", schema: contactInfoSchema, component: Page2_ContactInformation },
  { id: "educationProgram", name: "Education Program", schema: educationProgramSchema, component: Page3_EducationProgram },
  { id: "languageProficiency", name: "Language Proficiency", schema: languageProficiencySchema, component: Page4_LanguageProficiency },
  { id: "documents", name: "Documents", schema: documentsSchema, component: Page5_Documents },
];

export default function MultiPageApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const methods = useForm<MultiPageFormData>({
    resolver: zodResolver(multiPageFormSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      citizenship: "",
      dateOfBirth: "",
      email: "",
      telegramWhatsAppNumber: "",
      educationLevel: "",
      generalFieldOfStudy: "",
      fieldOfStudy: "",
      languages: [{ language: "", level: "" }],
      preparatoryCourse: false,
      passport: [],
      educationalDegree: [],
    },
  });

  const { trigger, handleSubmit: handleHookFormSubmit } = methods;

  const processAndNotify = async (formData: FormData) => {
    try {
        const result = await submitApplication(formData);
        if (!result.success) {
            console.error("Background submission failed:", result.message);
            // Here you could implement a more robust error handling,
            // like notifying your team or logging the error to a service.
        }
    } catch (error) {
        console.error("Error in background processing:", error);
    }
  };

  const onSubmit = async (data: MultiPageFormData) => {
    setIsLoading(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'passport' || key === 'educationalDegree') {
        value.forEach((file: File) => {
          formData.append(key, file);
        });
      } else if (key === 'languages') {
        formData.append(key, JSON.stringify(value));
      }
      else {
        formData.append(key, String(value));
      }
    });

    // Immediately give feedback to the user
    toast({
      title: "Application Received",
      description: "We've received your application and will start processing it. You'll get a final confirmation soon.",
    });

    // Reset form and UI state
    methods.reset();
    setCurrentStep(0);
    setIsLoading(false);

    // Perform the long-running task in the background
    processAndNotify(formData);
  };

  const handleNext = async () => {
    const currentStepSchema = steps[currentStep].schema;
    const fieldsToValidate = Object.keys(currentStepSchema.shape) as (keyof MultiPageFormData)[];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleHookFormSubmit(onSubmit)();
      }
    } else {
        console.log(methods.formState.errors)
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the current step.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };


  const CurrentPageComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Student Application Form</h1>

      <Progress value={progress} className="w-full mb-8" />

      <div className="mb-8 text-center">
        <p className="text-lg font-medium">Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleHookFormSubmit(onSubmit)} className="space-y-6">
          <CurrentPageComponent />

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isLoading}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
            >
              {currentStep === steps.length - 1 ? (isLoading ? "Submitting..." : "Submit") : "Next"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
