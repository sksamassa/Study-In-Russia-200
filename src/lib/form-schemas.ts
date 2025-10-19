import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

// Base file schema for individual file validation
const fileSchema = z.instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `File size must not exceed 5 MB.`)
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    "Unsupported file format. Only JPEG, PNG, PDF are allowed."
  );

// Page 1: Personal Information
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().min(1, "Middle name is required"),
  lastName: z.string().min(1, "Last name is required"),
  citizenship: z.string().min(1, "Citizenship is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine((val) => {
    const dob = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 16;
  }, "You must be at least 16 years old."),
});

// Page 2: Contact Information
export const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  telegramWhatsAppNumber: z.string().min(1, "Phone number is required").regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, "Invalid phone number format (e.g., +1234567890)"),
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
export const documentsSchema = z.object({
  passport: z.array(fileSchema).min(1, "Passport (original) is required"),
  educationalDegree: z.array(fileSchema).min(1, "Educational degree (original) is required"),
});


// Combined schema for the entire form
export const multiPageFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...contactInfoSchema.shape,
  ...educationProgramSchema.shape,
  ...languageProficiencySchema.shape,
  ...documentsSchema.shape,
}).refine((data) => {
  const totalSize = 
    data.passport.reduce((sum, file) => sum + file.size, 0) +
    data.educationalDegree.reduce((sum, file) => sum + file.size, 0);
  return totalSize <= MAX_TOTAL_SIZE;
}, `Total file size may not exceed ${MAX_TOTAL_SIZE / 1024 / 1024} MB.`);


export type MultiPageFormData = z.infer<typeof multiPageFormSchema>;
