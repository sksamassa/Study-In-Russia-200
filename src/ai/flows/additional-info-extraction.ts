'use server';

/**
 * @fileOverview A flow to extract additional information from student documents using AI and store it in the database.
 *
 * - extractAdditionalInfo - A function that handles the information extraction process.
 * - AdditionalInfoExtractionInput - The input type for the extractAdditionalInfo function.
 * - AdditionalInfoExtractionOutput - The return type for the extractAdditionalInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdditionalInfoExtractionInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A student document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentDescription: z.string().describe('The description of the document.'),
});
export type AdditionalInfoExtractionInput = z.infer<typeof AdditionalInfoExtractionInputSchema>;

const AdditionalInfoExtractionOutputSchema = z.object({
  extractedInformation: z.record(z.string(), z.any()).describe('The extracted information from the document.'),
});
export type AdditionalInfoExtractionOutput = z.infer<typeof AdditionalInfoExtractionOutputSchema>;

export async function extractAdditionalInfo(input: AdditionalInfoExtractionInput): Promise<AdditionalInfoExtractionOutput> {
  return additionalInfoExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'additionalInfoExtractionPrompt',
  input: {schema: AdditionalInfoExtractionInputSchema},
  output: {schema: AdditionalInfoExtractionOutputSchema},
  prompt: `You are an expert data extraction specialist. Your task is to extract additional information from the provided student document.

  Description: {{{documentDescription}}}
  Document: {{media url=documentDataUri}}

  Please provide the extracted information in a JSON format.
  `,
});

const additionalInfoExtractionFlow = ai.defineFlow(
  {
    name: 'additionalInfoExtractionFlow',
    inputSchema: AdditionalInfoExtractionInputSchema,
    outputSchema: AdditionalInfoExtractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
