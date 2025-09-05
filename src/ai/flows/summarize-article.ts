'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing news articles.
 *
 * - summarizeArticle - An async function that takes an article content and returns a summary.
 * - SummarizeArticleInput - The input type for the summarizeArticle function, defining the article content.
 * - SummarizeArticleOutput - The output type for the summarizeArticle function, defining the summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeArticleInputSchema = z.object({
  articleContent: z.string().describe('The content of the article to summarize.'),
  summaryLength: z.enum(['short', 'medium', 'long']).default('medium').describe('Desired length of the summary (short, medium, or long).'),
});

export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the article.'),
});

export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: {schema: SummarizeArticleInputSchema},
  output: {schema: SummarizeArticleOutputSchema},
  prompt: `You are an AI expert in summarizing news articles.  You will be provided with the content of a news article, and your job is to summarize it.

The user will specify a desired length for the summary: short, medium, or long.  Make the summary that length.

Article content: {{{articleContent}}}

Summary length: {{{summaryLength}}}`,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
