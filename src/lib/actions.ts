
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

// Schema for plain file metadata (not File instances)
const fileSchema = z
  .object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
  })
  .refine((file) => file.size > 0, 'File is required and cannot be empty.')
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
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

function formatApplicationForNotification(
  applicationData: z.infer<typeof applicationSchema>,
  veracityResult: ApplicationState['data']['veracity'],
  extractionResult: Record<string, any> | undefined
) {
  const data = {
    ...applicationData,
    passport: applicationData.passport.name,
    education: applicationData.education.map(f => f.name),
  };

  const text = `
New University Application:

Personal Info:
- Name: ${data.firstName} ${data.middleName || ''} ${data.lastName}
- Citizenship: ${data.citizenship}
- Email: ${data.email}
- Phone: ${data.phone}

Documents:
- Passport: ${data.passport}
- Education Docs: ${data.education.join(', ')}

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
        <li><strong>Name:</strong> ${data.firstName} ${data.middleName || ''} ${data.lastName}</li>
        <li><strong>Citizenship:</strong> ${data.citizenship}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
    </ul>
    <h2>Documents Submitted</h2>
    <ul>
        <li><strong>Passport:</strong> ${data.passport}</li>
        <li><strong>Education Docs:</strong> ${data.education.join(', ')}</li>
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
    // --- Step 1: Extract and validate files ---
    const rawPassport = formData.get('passport');
    const rawEducation = formData.getAll('education');

    const passportFile = rawPassport instanceof File && rawPassport.size > 0 ? rawPassport : null;
    const educationFiles = rawEducation
      .filter(f => f instanceof File && f.size > 0)
      .map(f => f as File);

    // Convert to plain objects for Zod
    const passportData = passportFile
      ? { name: passportFile.name, size: passportFile.size, type: passportFile.type }
      : undefined;

    const educationData = educationFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));

    // --- Step 2: Validate form data ---
    const parsed = applicationSchema.safeParse({
      firstName: (formData.get('firstName')?.toString() || '').trim(),
      middleName: (formData.get('middleName')?.toString() || '').trim() || undefined,
      lastName: (formData.get('lastName')?.toString() || '').trim(),
      citizenship: (formData.get('citizenship')?.toString() || '').trim(),
      email: (formData.get('email')?.toString() || '').trim(),
      phone: (formData.get('phone')?.toString() || '').trim(),
      passport: passportData,
      education: educationData,
    });

    if (!parsed.success) {
      return {
        status: 'error',
        message: 'Please correct the errors below.',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    if (!passportFile) {
      return {
        status: 'error',
        message: 'Passport file is missing.',
      };
    }

    // --- Step 3: Read passport file ---
    let arrayBuffer: ArrayBuffer;
    try {
      arrayBuffer = await passportFile.arrayBuffer();
    } catch (err) {
      console.error('Failed to read passport file:', err);
      return {
        status: 'error',
        message: 'Could not read passport file. Please re-upload.',
      };
    }

    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUri = `data:${passportFile.type};base64,${base64}`;

    // --- Step 4: AI Veracity Check ---
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

    // --- Step 5: AI Info Extraction ---
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

    // --- Step 6: Send notifications (fire-and-forget) ---
    const { text, html } = formatApplicationForNotification(
      parsed.data,
      safeVeracity,
      safeExtraction
    );

    sendTelegramMessage(text);
    sendEmail(`New Application: ${parsed.data.firstName} ${parsed.data.lastName}`, html);

    // --- Step 7: Return SUCCESS with guaranteed-serializable data ---
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
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}
