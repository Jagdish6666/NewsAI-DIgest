'use server';

/**
 * @fileOverview An AI agent that generates summaries of news articles with customizable length.
 *
 * - summarizeArticle - A function that generates a summary of a news article.
 * - CustomizeSummaryLengthInput - The input type for the summarizeArticle function.
 * - CustomizeSummaryLengthOutput - The return type for the summarizeArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeSummaryLengthInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the news article to be summarized.'),
  summaryLength: z
    .enum(['short', 'medium', 'long'])
    .describe('The desired length of the summary (short, medium, or long).'),
});
export type CustomizeSummaryLengthInput = z.infer<
  typeof CustomizeSummaryLengthInputSchema
>;

const CustomizeSummaryLengthOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the news article.'),
});
export type CustomizeSummaryLengthOutput = z.infer<
  typeof CustomizeSummaryLengthOutputSchema
>;

export async function summarizeArticle(
  input: CustomizeSummaryLengthInput
): Promise<CustomizeSummaryLengthOutput> {
  return customizeSummaryLengthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeSummaryLengthPrompt',
  input: {schema: CustomizeSummaryLengthInputSchema},
  output: {schema: CustomizeSummaryLengthOutputSchema},
  prompt: `You are a professional news summarizer.  Your job is to provide summaries of news articles.

  The article to summarize is:
  {{articleContent}}

  The user has requested a summary of the following length:
  {{summaryLength}}

  Please provide a summary that adheres to the user's desired length.`,
});

const customizeSummaryLengthFlow = ai.defineFlow(
  {
    name: 'customizeSummaryLengthFlow',
    inputSchema: CustomizeSummaryLengthInputSchema,
    outputSchema: CustomizeSummaryLengthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
