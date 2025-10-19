import { z } from 'zod';

// Page 1: Personal Information
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().min(1, "Middle name is required"),
  lastName: z.string().min(1, "Last name is required"),
  citizenship: z.string().min(1, "Citizenship is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine((val) => {
    const dob = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      return age - 1 >= 16;
    }
    return age >= 16;
  }, "You must be at least 16 years old."),
});

// Page 2: Contact Information
export const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  telegramWhatsAppNumber: z.string().min(1, "Phone number is required").regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g., +1234567890)"),
});

// Page 3: Education Program
export const educationProgramSchema = z.object({
  educationLevel: z.string().min(1, "Education level is required"),
  generalFieldOfStudy: z.string().min(1, "General field of study is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
});

// Page 4: Language Proficiency
export const languageEntrySchema = z.object({
  language: z.string().min(1, "Language is required"),
  level: z.string().min(1, "Proficiency level is required"),
});

export const languageProficiencySchema = z.object({
  languages: z.array(languageEntrySchema).min(1, "At least one language entry is required"),
  preparatoryCourse: z.boolean().default(false),
});

// Page 5: Documents
export const documentFileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  url: z.string().url("Invalid URL for file").min(1, "File URL is required"),
  size: z.number().max(5 * 1024 * 1024, "File size must not exceed 5 MB"), // 5 MB limit
  type: z.string().regex(/^(image\/(jpeg|png)|application\/pdf)$/, "Unsupported file format. Only JPEG, PNG, PDF are allowed."),
});

export const documentsBaseSchema = z.object({
  passport: z.array(documentFileSchema).min(1, "Passport (original) is required"),
  educationalDegree: z.array(documentFileSchema).min(1, "Educational degree (original) is required"),
});

// Combined schema for the entire form
export const multiPageFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...contactInfoSchema.shape,
  ...educationProgramSchema.shape,
  ...languageProficiencySchema.shape,
  ...documentsBaseSchema.shape, // Use the base schema's shape
}).refine((data) => {
  const totalSize = data.passport.reduce((sum, file) => sum + file.size, 0) +
                    data.educationalDegree.reduce((sum, file) => sum + file.size, 0);
  return totalSize <= 50 * 1024 * 1024; // 50 MB total limit
}, "Total file size may not exceed 50 MB.");

export const documentsSchema = documentsBaseSchema; // Keep documentsSchema for individual page validation

export type MultiPageFormData = z.infer<typeof multiPageFormSchema>;
