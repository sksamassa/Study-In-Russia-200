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
  documentsSchema, // Import documentsSchema
  MultiPageFormData,
} from "@/lib/form-schemas";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { submitApplication } from "@/lib/actions";

// Page Components (to be created)
import Page1_PersonalInformation from "./form-pages/Page1_PersonalInformation";
import Page2_ContactInformation from "./form-pages/Page2_ContactInformation";
import Page3_EducationProgram from "./form-pages/Page3_EducationProgram";
import Page4_LanguageProficiency from "./form-pages/Page4_LanguageProficiency";
import Page5_Documents from "./form-pages/Page5_Documents"; // New import

const steps = [
  { id: "personalInfo", name: "Personal Information", schema: personalInfoSchema, component: Page1_PersonalInformation },
  { id: "contactInfo", name: "Contact Information", schema: contactInfoSchema, component: Page2_ContactInformation },
  { id: "educationProgram", name: "Education Program", schema: educationProgramSchema, component: Page3_EducationProgram },
  { id: "languageProficiency", name: "Language Proficiency", schema: languageProficiencySchema, component: Page4_LanguageProficiency },
  { id: "documents", name: "Documents", schema: documentsSchema, component: Page5_Documents }, // New step
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
      languages: [{ language: "", level: "" }], // Updated default
      preparatoryCourse: false,
      passport: [], // New default
      educationalDegree: [], // New default
    },
  });

  const { trigger, getValues, formState: { errors } } = methods;

  const handleNext = async () => {
    const currentStepSchema = steps[currentStep].schema;
    const isValid = await trigger(Object.keys(currentStepSchema.shape) as (keyof MultiPageFormData)[]);

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // This is the last step, handle submission
        await handleSubmit();
      }
    } else {
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const allFields = getValues();
      const result = await submitApplication(allFields);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Optionally reset form or navigate
        methods.reset();
        setCurrentStep(0);
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during submission.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
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
