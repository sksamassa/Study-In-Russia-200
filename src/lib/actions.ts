
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

// More robust file schema for server actions
const fileSchema = z
  .object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    // The arrayBuffer function is part of the File object's prototype, not a direct property for validation.
    // We only need to validate the properties we can access directly.
  })
  .refine((file) => file.size > 0, 'File is required and cannot be empty.')
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

async function sendTelegramMessage(message: string) {
    // In a real application, you would use a library like 'node-telegram-bot-api'
    // with a BOT_TOKEN to send a message to a specific chat ID.
    // const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    // await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
    console.log("--- Sending to Telegram (@studyinrussia200) ---");
    console.log(message);
    console.log("------------------------------------------");
}

async function sendEmail(subject: string, htmlBody: string) {
    // In a real application, you would use a library like 'nodemailer'
    // with credentials for an email service (e.g., Gmail, SendGrid).
    // const transporter = nodemailer.createTransport({ service: 'gmail', auth: { ... } });
    // await transporter.sendMail({ from: '...', to: 'studyinrussia200@gmail.com', subject, html: htmlBody });
    console.log("--- Sending Email to studyinrussia200@gmail.com ---");
    console.log(`Subject: ${subject}`);
    console.log(htmlBody);
    console.log("-------------------------------------------------");
}

function formatApplicationForNotification(applicationData: z.infer<typeof applicationSchema>, veracityResult: DocumentVeracityCheckOutput, extractionResult: any) {
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
${JSON.stringify(extractionResult, null, 2)}
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
    <pre>${JSON.stringify(extractionResult, null, 2)}</pre>
</body>
</html>
    `;

    return { text, html };
}

export async function handleApplicationSubmit(
  prevState: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {

  const passportFile = formData.get('passport') as File | null;
  const educationFiles = formData.getAll('education').filter(f => (f instanceof File && f.size > 0)) as File[];
  
  const validatedFields = applicationSchema.safeParse({
    firstName: formData.get('firstName'),
    middleName: formData.get('middleName'),
    lastName: formData.get('lastName'),
    citizenship: formData.get('citizenship'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    passport: passportFile,
    education: educationFiles,
  });
  
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Please correct the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { passport } = validatedFields.data;
  
  const university = 'Lomonosov Moscow State University';
  const requirements = universityRequirements[university as keyof typeof universityRequirements];

  try {
    const buffer = await passport.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${passport.type};base64,${base64}`;

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

    // --- Send Notifications ---
    const { text, html } = formatApplicationForNotification(
      validatedFields.data,
      veracityResult,
      extractionResult.extractedInformation
    );
    
    // In a real application, these would be awaited.
    // We run them without await here to avoid blocking the UI response.
    sendTelegramMessage(text);
    sendEmail(`New Application from ${validatedFields.data.firstName} ${validatedFields.data.lastName}`, html);
    // --------------------------

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
