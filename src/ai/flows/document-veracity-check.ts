'use server';

/**
 * @fileOverview A document veracity check AI agent.
 *
 * - documentVeracityCheck - A function that handles the document veracity check process.
 * - DocumentVeracityCheckInput - The input type for the documentVeracityCheck function.
 * - DocumentVeracityCheckOutput - The return type for the documentVeracityCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DocumentVeracityCheckInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      'A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
  universityRequirements: z
    .string()
    .describe(
      'The requirements for documents from the university to which the student is applying.'
    ),
});
export type DocumentVeracityCheckInput = z.infer<typeof DocumentVeracityCheckInputSchema>;

const DocumentVeracityCheckOutputSchema = z.object({
  isAuthentic: z.boolean().describe('Whether or not the document is authentic.'),
  isReadable: z.boolean().describe('Whether or not the document is readable.'),
  meetsRequirements: z
    .boolean()
    .describe('Whether or not the document meets university requirements.'),
  errors: z.string().describe('A description of any errors found in the document.'),
});
export type DocumentVeracityCheckOutput = z.infer<typeof DocumentVeracityCheckOutputSchema>;

export async function documentVeracityCheck(
  input: DocumentVeracityCheckInput
): Promise<DocumentVeracityCheckOutput> {
  return documentVeracityCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentVeracityCheckPrompt',
  input: {schema: DocumentVeracityCheckInputSchema},
  output: {schema: DocumentVeracityCheckOutputSchema},
  prompt: `You are an expert document verification agent.

You will use this information to verify the authenticity, readability, and requirements of the document.

University Requirements: {{{universityRequirements}}}
Document: {{media url=documentDataUri}}

Based on the document, set the isAuthentic, isReadable, and meetsRequirements output fields appropriately.  The "errors" field should be a detailed explanation of any issues, including if the document does not meet requirements.
`,
});

const documentVeracityCheckFlow = ai.defineFlow(
  {
    name: 'documentVeracityCheckFlow',
    inputSchema: DocumentVeracityCheckInputSchema,
    outputSchema: DocumentVeracityCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
