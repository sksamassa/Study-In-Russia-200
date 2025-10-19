
"use client";

import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { submitApplication } from "@/lib/actions";

// Page Components
import Page1_PersonalInformation from "./form-pages/Page1_PersonalInformation";
import Page2_ContactInformation from "./form-pages/Page2_ContactInformation";
import Page3_EducationProgram from "./form-pages/Page3_EducationProgram";
import Page4_LanguageProficiency from "./form-pages/Page4_LanguageProficiency";
import Page5_Documents from "./form-pages/Page5_Documents";
import { StepProgress } from "./ui/step-progress";

const steps = [
  { id: "personalInfo", name: "Personal Information", schema: personalInfoSchema, component: Page1_PersonalInformation },
  { id: "contactInfo", name: "Contact Information", schema: contactInfoSchema, component: Page2_ContactInformation },
  { id: "educationProgram", name: "Education Program", schema: educationProgramSchema, component: Page3_EducationProgram },
  { id: "languageProficiency", name: "Language Proficiency", schema: languageProficiencySchema, component: Page4_LanguageProficiency },
  { id: "documents", name: "Documents", schema: documentsSchema, component: Page5_Documents },
];

const LOCAL_STORAGE_KEY = 'multi-page-form-data';


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

  const { trigger, handleSubmit: handleHookFormSubmit, watch, reset } = methods;
  const watchedData = watch();

  useEffect(() => {
    try {
        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedState) {
            const { step, formData } = JSON.parse(savedState);
            // We don't restore files, but we restore the rest of the form data
            const restoredData = {
                ...formData,
                passport: [],
                educationalDegree: [],
            };
            reset(restoredData);
            if (typeof step === 'number') {
                setCurrentStep(step);
            }
        }
    } catch (error) {
        console.error("Failed to load form state from localStorage", error);
    }
  }, [reset]);

  useEffect(() => {
    try {
        const stateToSave = {
            step: currentStep,
            formData: watchedData,
        };
        // We don't save files to localStorage
        delete stateToSave.formData.passport;
        delete stateToSave.formData.educationalDegree;

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
        console.error("Failed to save form state to localStorage", error);
    }
  }, [watchedData, currentStep]);

  const processForm = (data: MultiPageFormData) => {
    toast({
      title: "Application Received",
      description: "We've received your application and will start processing it. You'll get a final confirmation soon.",
    });
    
    submitApplication(data).then(result => {
      if (!result.success) {
        console.error("Background submission failed:", result.message);
        toast({
          title: "Submission Error",
          description: "There was a problem with your application. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Application Submitted!",
          description: "Your application has been successfully submitted.",
        });
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }).catch(error => {
      console.error("Error in background processing:", error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    });
  };

  const onSubmit = (data: MultiPageFormData) => {
    setIsLoading(true);
    processForm(data);
    methods.reset();
    setCurrentStep(0);
    setIsLoading(false);
  };

  const handleNext = async () => {
    const currentStepSchema = steps[currentStep].schema;
    const fieldsToValidate = Object.keys(currentStepSchema.shape) as (keyof MultiPageFormData)[];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleHookFormSubmit(onSubmit)();
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields on the page.",
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

  return (
    <div className="bg-card shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
      <div className="mb-12 px-4 md:px-8">
        <StepProgress steps={steps} currentStep={currentStep + 1} />
      </div>

      <FormProvider {...methods}>
        <form className="space-y-6 max-w-2xl mx-auto">
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
