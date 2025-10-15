
'use server';

import {
  documentVeracityCheck,
  type DocumentVeracityCheckOutput,
} from '@/ai/flows/document-veracity-check';
import { extractAdditionalInfo } from '@/ai/flows/additional-info-extraction';
import { z } from 'zod';
import {
  universities,
  universityRequirements,
} from '@/lib/university-data';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const fileSchema = z
  .instanceof(File, { message: 'File is required.' })
  .refine((file) => file.size > 0, 'File cannot be empty.')
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size must be less than 5MB.`
  )
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    'Invalid file type. Only JPG, PNG, and PDF are allowed.'
  );

const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  passport: fileSchema,
  education: z.array(fileSchema).min(1, 'At least one educational document is required.'),
});

export interface ApplicationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string | null;
  data?: {
    veracity: DocumentVeracityCheckOutput;
    extraction?: Record<string, any>;
  } | null;
  errors?: {
    firstName?: string[];
    middleName?: string[];
    lastName?: string[];
    citizenship?: string[];
    email?: string[];
    phone?: string[];
    passport?: string[];
    education?: string[];
  } | null;
}

export async function handleApplicationSubmit(
  prevState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  const educationFiles = formData.getAll('education');
  
  const validatedFields = applicationSchema.safeParse({
    firstName: formData.get('firstName'),
    middleName: formData.get('middleName'),
    lastName: formData.get('lastName'),
    citizenship: formData.get('citizenship'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    passport: formData.get('passport'),
    education: Array.isArray(educationFiles) ? educationFiles : [educationFiles],
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Please correct the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  // For demonstration, we'll verify the passport.
  // In a real app, you might verify multiple documents or choose the most important one.
  const { passport, email } = validatedFields.data;
  
  // For now, we are not using a specific university's requirements, but this could be added back.
  const university = 'Lomonosov Moscow State University';
  const requirements = universityRequirements[university as keyof typeof universityRequirements];

  try {
    const buffer = await passport.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${passport.type};base64,${base64}`;

    // The AI flows are called here.
    // In a real app you might want to run these in parallel
    const veracityResult = await documentVeracityCheck({
      documentDataUri: dataUri,
      universityRequirements: requirements,
    });

    if (
      !veracityResult.isAuthentic ||
      !veracityResult.isReadable ||
      !veracityResult.meetsRequirements
    ) {
      return {
        status: 'error',
        message: `Document verification failed. ${veracityResult.errors}`,
        data: { veracity: veracityResult },
      };
    }

    const extractionResult = await extractAdditionalInfo({
      documentDataUri: dataUri,
      documentDescription: `Passport for ${validatedFields.data.firstName} ${validatedFields.data.lastName}`,
    });

    // In a real application, you would send this data to your backend,
    // email, and Telegram.
    console.log('Application Data to be sent:');
    console.log({
        ...validatedFields.data,
        passport: validatedFields.data.passport.name,
        education: validatedFields.data.education.map(f => f.name),
        veracityResult,
        extractionResult
    });


    // Simulate sending email and telegram message
    console.log(`Sending application details to studyinrussia200@gmail.com and @studyinrussia200 on Telegram.`);


    return {
      status: 'success',
      message: 'Application submitted and verified successfully!',
      data: {
        veracity: veracityResult,
        extraction: extractionResult.extractedInformation,
      },
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      status: 'error',
      message: `An error occurred during AI processing: ${errorMessage}`,
    };
  }
}
