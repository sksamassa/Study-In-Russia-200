
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

// This is the correct way to validate a File object in a Next.js Server Action
// using Zod. `z.instanceof(File)` does not work because the object's prototype
// is lost when it's passed from the client to the server.
const fileSchema = z
  .any()
  .refine((file): file is File => file instanceof File && file.size > 0, 'File is required and cannot be empty.')
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
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
    veracity: {
      isAuthentic: boolean;
      isReadable: boolean;
      meetsRequirements: boolean;
      errors: string | null;
    };
    extraction?: Record<string, string | number | boolean | null>;
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

// --- Notification Helpers (fire-and-forget) ---
async function sendTelegramMessage(message: string) {
  console.log('--- Sending to Telegram (@studyinrussia200) ---');
  console.log(message);
  console.log('------------------------------------------');
}

async function sendEmail(subject: string, htmlBody: string) {
  console.log('--- Sending Email to studyinrussia200@gmail.com ---');
  console.log(`Subject: ${subject}`);
  console.log(htmlBody);
  console.log('-------------------------------------------------');
}

type NotificationData = {
    firstName: string;
    middleName?: string;
    lastName: string;
    citizenship: string;
    email: string;
    phone: string;
    passport: string;
    education: string[];
}

function formatApplicationForNotification(
  applicationData: NotificationData,
  veracityResult: ApplicationState['data']['veracity'],
  extractionResult: Record<string, any> | undefined
) {

  const text = `
New University Application:

Personal Info:
- Name: ${applicationData.firstName} ${applicationData.middleName || ''} ${applicationData.lastName}
- Citizenship: ${applicationData.citizenship}
- Email: ${applicationData.email}
- Phone: ${applicationData.phone}

Documents:
- Passport: ${applicationData.passport}
- Education Docs: ${applicationData.education.join(', ')}

AI Verification:
- Authentic: ${veracityResult.isAuthentic}
- Readable: ${veracityResult.isReadable}
- Meets Requirements: ${veracityResult.meetsRequirements}
- Errors: ${veracityResult.errors || 'None'}

AI Extracted Info:
${extractionResult ? JSON.stringify(extractionResult, null, 2) : 'None'}
  `;

  const html = `
<html>
<body>
    <h1>New University Application</h1>
    <h2>Personal Information</h2>
    <ul>
        <li><strong>Name:</strong> ${applicationData.firstName} ${applicationData.middleName || ''} ${applicationData.lastName}</li>
        <li><strong>Citizenship:</strong> ${applicationData.citizenship}</li>
        <li><strong>Email:</strong> ${applicationData.email}</li>
        <li><strong>Phone:</strong> ${applicationData.phone}</li>
    </ul>
    <h2>Documents Submitted</h2>
    <ul>
        <li><strong>Passport:</strong> ${applicationData.passport}</li>
        <li><strong>Education Docs:</strong> ${applicationData.education.join(', ')}</li>
    </ul>
    <h2>AI Verification Results</h2>
    <ul>
        <li><strong>Authentic:</strong> ${veracityResult.isAuthentic ? 'Yes' : 'No'}</li>
        <li><strong>Readable:</strong> ${veracityResult.isReadable ? 'Yes' : 'No'}</li>
        <li><strong>Meets Requirements:</strong> ${veracityResult.meetsRequirements ? 'Yes' : 'No'}</li>
        <li><strong>Verification Errors:</strong> ${veracityResult.errors || 'None'}</li>
    </ul>
    <h2>AI Extracted Information</h2>
    <pre>${extractionResult ? JSON.stringify(extractionResult, null, 2) : 'None'}</pre>
</body>
</html>
  `;

  return { text, html };
}

// --- Safe serialization via explicit shape (no JSON.parse(JSON.stringify)) ---
function makeSafeVeracity(result: DocumentVeracityCheckOutput) {
  return {
    isAuthentic: Boolean(result.isAuthentic),
    isReadable: Boolean(result.isReadable),
    meetsRequirements: Boolean(result.meetsRequirements),
    errors: typeof result.errors === 'string' ? result.errors : null,
  };
}

function makeSafeExtraction(obj: any): Record<string, string | number | boolean | null> {
  if (!obj || typeof obj !== 'object') return {};
  const safe: Record<string, string | number | boolean | null> = {};
  for (const key in obj) {
    const val = obj[key];
    if (val == null) {
      safe[key] = null;
    } else if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      safe[key] = val;
    } else {
      safe[key] = String(val); // fallback to string
    }
  }
  return safe;
}

// --- Main Server Action ---
export async function handleApplicationSubmit(
  prevState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  try {
    const passportFile = formData.get('passport');
    const educationFiles = formData.getAll('education').filter(f => f instanceof File && f.size > 0);

    const parsed = applicationSchema.safeParse({
      firstName: (formData.get('firstName')?.toString() || '').trim(),
      middleName: (formData.get('middleName')?.toString() || '').trim() || undefined,
      lastName: (formData.get('lastName')?.toString() || '').trim(),
      citizenship: (formData.get('citizenship')?.toString() || '').trim(),
      email: (formData.get('email')?.toString() || '').trim(),
      phone: (formData.get('phone')?.toString() || '').trim(),
      passport: passportFile,
      education: educationFiles,
    });

    if (!parsed.success) {
      return {
        status: 'error',
        message: 'Please correct the errors below.',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { passport, education, ...otherData } = parsed.data;

    // Create a plain object for notifications before consuming the file buffers
    const notificationData: NotificationData = {
        ...otherData,
        passport: passport.name,
        education: education.map(f => f.name),
    };


    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await passport.arrayBuffer();
    } catch (err) {
      console.error('Failed to read passport file:', err);
      return {
        status: 'error',
        message: 'Could not read passport file. Please re-upload.',
      };
    }

    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:${passport.type};base64,${base64}`;

    let veracityResult: DocumentVeracityCheckOutput;
    try {
      veracityResult = await documentVeracityCheck({
        documentDataUri: dataUri,
        universityRequirements: universityRequirements['Lomonosov Moscow State University'],
      });
    } catch (err) {
      console.error('AI Veracity Check failed:', err);
      return {
        status: 'error',
        message: 'Document verification service is unavailable. Please try again later.',
      };
    }

    const safeVeracity = makeSafeVeracity(veracityResult);

    if (!safeVeracity.isAuthentic || !safeVeracity.isReadable || !safeVeracity.meetsRequirements) {
      return {
        status: 'error',
        message: `Document verification failed. ${safeVeracity.errors || 'Unknown issue.'}`,
        data: { veracity: safeVeracity },
      };
    }

    let extractionResult;
    try {
      extractionResult = await extractAdditionalInfo({
        documentDataUri: dataUri,
        documentDescription: `Passport for ${parsed.data.firstName} ${parsed.data.lastName}`,
      });
    } catch (err) {
      console.error('AI Extraction failed:', err);
      // Non-fatal — continue without extraction
      extractionResult = { extractedInformation: {} };
    }

    const safeExtraction = makeSafeExtraction(extractionResult.extractedInformation);

    const { text, html } = formatApplicationForNotification(
      notificationData,
      safeVeracity,
      safeExtraction
    );

    sendTelegramMessage(text);
    sendEmail(`New Application: ${parsed.data.firstName} ${parsed.data.lastName}`, html);

    const result: ApplicationState = {
      status: 'success',
      message: 'Application submitted and verified successfully!',
      data: {
        veracity: safeVeracity,
        extraction: Object.keys(safeExtraction).length > 0 ? safeExtraction : undefined,
      },
    };

    return result;
  } catch (error) {
    console.error('Unhandled error in handleApplicationSubmit:', error);
    return {
      status: 'error',
      message: 'An unexpected server error occurred. Please try again.',
    };
  }
}
