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

const applicationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  university: z.enum(universities, {
    errorMap: () => ({ message: 'Please select a university' }),
  }),
  document: z
    .instanceof(File, { message: 'Document is required' })
    .refine((file) => file.size > 0, 'Document cannot be empty'),
});

export interface ApplicationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string | null;
  data?: {
    veracity: DocumentVeracityCheckOutput;
    extraction?: Record<string, any>;
  } | null;
  errors?: {
    fullName?: string[];
    email?: string[];
    university?: string[];
    document?: string[];
  } | null;
}

export async function handleApplicationSubmit(
  prevState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  const validatedFields = applicationSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    university: formData.get('university'),
    document: formData.get('document'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Please correct the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { document, university } = validatedFields.data;

  try {
    const buffer = await document.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${document.type};base64,${base64}`;

    const requirements =
      universityRequirements[
        university as keyof typeof universityRequirements
      ];

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
      documentDescription: 'Student academic transcript for university application.',
    });

    // In a real application, you would save this data to your database
    console.log('Extracted Information:', extractionResult.extractedInformation);

    return {
      status: 'success',
      message: 'Application processed successfully!',
      data: {
        veracity: veracityResult,
        extraction: extractionResult.extractedInformation,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message: 'An unexpected error occurred while processing the document.',
    };
  }
}
