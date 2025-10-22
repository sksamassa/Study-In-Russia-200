
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

import {
  multiPageFormSchema,
  personalInfoSchema,
  contactInfoSchema,
  educationProgramSchema,
  languageProficiencySchema,
  documentsSchema,
  finalStepSchema,
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
import { getDictionary } from "@/i18n/get-dictionary";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { usePathname } from "next/navigation";

const LOCAL_STORAGE_KEY = "multi-page-form-data";

type MultiPageApplicationFormProps = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
};

export default function MultiPageApplicationForm({
  dictionary,
}: MultiPageApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [highestCompletedStep, setHighestCompletedStep] = useState(0);
  const { toast } = useToast();
  const lang = usePathname().split("/")[1] || "en";
  const recaptchaRef = React.createRef<ReCAPTCHA>();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const steps = [
    {
      id: "personalInfo",
      name: dictionary.applicationForm.personalInfo.title,
      schema: personalInfoSchema,
      component: Page1_PersonalInformation,
    },
    {
      id: "contactInfo",
      name: dictionary.applicationForm.contactInfo.title,
      schema: contactInfoSchema,
      component: Page2_ContactInformation,
    },
    {
      id: "educationProgram",
      name: dictionary.applicationForm.educationProgram.title,
      schema: educationProgramSchema,
      component: Page3_EducationProgram,
    },
    {
      id: "languageProficiency",
      name: dictionary.applicationForm.languageProficiency.title,
      schema: languageProficiencySchema,
      component: Page4_LanguageProficiency,
    },
    {
      id: "documents",
      name: dictionary.applicationForm.documents.title,
      schema: documentsSchema,
      component: Page5_Documents,
    },
    {
      id: "finalStep",
      name: dictionary.applicationForm.finalStep.title,
      schema: finalStepSchema,
      component: () => <></>,
    },
  ];

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
      privacyPolicyConsent: false,
      recaptcha: "",
    },
    mode: "onChange",
  });

  const { trigger, handleSubmit: handleHookFormSubmit, watch, reset, formState } = methods;
  const watchedData = watch();
  const isSubmitDisabled = !formState.isValid || isLoading;

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const { step, formData, highestStep } = JSON.parse(savedState);
        const restoredData = {
          ...formData,
          passport: [],
          educationalDegree: [],
          privacyPolicyConsent: false,
        };
        reset(restoredData);
        if (typeof step === "number") {
          setCurrentStep(step);
        }
        if (typeof highestStep === 'number') {
            setHighestCompletedStep(highestStep);
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
        highestStep: highestCompletedStep
      };
      delete (stateToSave.formData as Partial<MultiPageFormData>).passport;
      delete (stateToSave.formData as Partial<MultiPageFormData>)
        .educationalDegree;
      delete (stateToSave.formData as Partial<MultiPageFormData>)
        .privacyPolicyConsent;
      delete (stateToSave.formData as Partial<MultiPageFormData>).recaptcha;

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save form state to localStorage", error);
    }
  }, [watchedData, currentStep, highestCompletedStep]);

  const processForm = async (data: MultiPageFormData) => {
    toast({
      title: dictionary.applicationForm.results.success.title,
      description: dictionary.applicationForm.results.success.description,
    });

    const result = await submitApplication(data);

    if (!result.success) {
      console.error("Background submission failed:", result.message);
      toast({
        title: dictionary.applicationForm.results.error.title,
        description:
          result.message ||
          dictionary.applicationForm.results.error.unexpected,
        variant: "destructive",
      });
    } else {
      toast({
        title: dictionary.applicationForm.results.success.title,
        description: "Your application has been successfully submitted.",
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      methods.reset();
      setCurrentStep(0);
      setHighestCompletedStep(0);
    }
  };

  const onSubmit = async (data: MultiPageFormData) => {
    setIsLoading(true);
    try {
      await processForm(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    const currentStepSchema = steps[currentStep].schema;
    const fieldsToValidate = Object.keys(
      currentStepSchema.shape
    ) as (keyof MultiPageFormData)[];
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setHighestCompletedStep(prev => Math.max(prev, currentStep + 1));
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

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex > highestCompletedStep) return;

    if (stepIndex > currentStep) {
        const currentStepSchema = steps[currentStep].schema;
        const fieldsToValidate = Object.keys(currentStepSchema.shape) as (keyof MultiPageFormData)[];
        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setCurrentStep(stepIndex);
        } else {
            toast({
                title: "Missing Information",
                description: "Please fill out all required fields before proceeding.",
                variant: "destructive",
            });
        }
    } else {
        setCurrentStep(stepIndex);
    }
  };

  const CurrentPageComponent = steps[currentStep].component;

  return (
    <div className="bg-card shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
      <div className="mb-12 px-4 md:px-8">
        <StepProgress 
            steps={steps} 
            currentStep={currentStep + 1}
            onStepClick={handleStepClick}
            highestCompletedStep={highestCompletedStep}
        />
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleHookFormSubmit(onSubmit)}
          className="space-y-6 max-w-2xl mx-auto"
        >
          {currentStep < steps.length - 1 ? (
            <CurrentPageComponent dictionary={dictionary} />
          ) : (
            <div className="space-y-6">
              <FormField
                control={methods.control}
                    name="privacyPolicyConsent"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        {dictionary.applicationForm.finalStep.consentText}
                        <Link
                          href={`/${lang}/privacy-policy`}
                          className="underline text-primary hover:text-primary/80"
                          target="_blank"
                        >
                          {
                            dictionary.applicationForm.finalStep
                              .privacyPolicyLink
                          }
                        </Link>
                        .
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <h4 className="text-lg font-semibold mb-0">
                Protection from automated form filling
              </h4>
              {siteKey ? (
                <FormField
                  control={methods.control}
                  name="recaptcha"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={siteKey}
                          onChange={(value) => field.onChange(value || "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <p className="text-sm text-destructive">
                  reCAPTCHA is not configured. Please set
                  NEXT_PUBLIC_RECAPTCHA_SITE_KEY.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isLoading}
              variant="outline"
            >
              {dictionary.applicationForm.previous}
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button type="submit" disabled={isSubmitDisabled}>
                {isLoading
                  ? dictionary.applicationForm.submitting
                  : dictionary.applicationForm.submit}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} disabled={isLoading}>
                {dictionary.applicationForm.next}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
