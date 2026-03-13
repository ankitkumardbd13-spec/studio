
'use server';
/**
 * @fileOverview An AI-powered tool for administrators to generate assignment and mock test questions.
 *
 * - generateAssignmentAndMockTest - A function that handles the generation of assignment and mock test questions.
 * - AdminAssignmentAndMockTestGeneratorInput - The input type for the generateAssignmentAndMockTest function.
 * - AdminAssignmentAndMockTestGeneratorOutput - The return type for the generateAssignmentAndMockTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminAssignmentAndMockTestGeneratorInputSchema = z.object({
  trade: z
    .string()
    .describe('The name of the ITI trade (e.g., Electrician, Fitter, HSI).'),
  year:
    z.number().int().min(1).describe('The year of the course (e.g., 1 for first year, 2 for second year).'),
  topic: z
    .string()
    .describe(
      'The specific topic within the trade and year for which to generate questions.'
    ),
});
export type AdminAssignmentAndMockTestGeneratorInput = z.infer<
  typeof AdminAssignmentAndMockTestGeneratorInputSchema
>;

const AdminAssignmentAndMockTestGeneratorOutputSchema = z.object({
  assignmentQuestions: z
    .array(z.string())
    .describe('A list of assignment questions for the given topic.'),
  mockTestQuestions: z
    .array(z.string())
    .describe('A list of mock test questions for the given topic.'),
});
export type AdminAssignmentAndMockTestGeneratorOutput = z.infer<
  typeof AdminAssignmentAndMockTestGeneratorOutputSchema
>;

export async function generateAssignmentAndMockTest(
  input: AdminAssignmentAndMockTestGeneratorInput
): Promise<AdminAssignmentAndMockTestGeneratorOutput> {
  return adminAssignmentAndMockTestGeneratorFlow(input);
}

const generateQuestionsPrompt = ai.definePrompt({
  name: 'generateQuestionsPrompt',
  input: {schema: AdminAssignmentAndMockTestGeneratorInputSchema},
  output: {schema: AdminAssignmentAndMockTestGeneratorOutputSchema},
  prompt: `You are an expert educational content creator for Industrial Training Institute (ITI) courses in India.
Your task is to generate relevant assignment questions and mock test questions based on the provided trade, year, and topic, adhering strictly to the **New DGT/NCVT Syllabus**.

Please generate:
- 5-7 comprehensive assignment questions that test understanding and application.
- 5-7 multiple-choice or short-answer mock test questions suitable for assessing knowledge.

Ensure the questions are appropriate for a student in the specified ITI trade and year, focusing on technical accuracy and current industry standards.

Trade: {{{trade}}}
Year: {{{year}}}
Topic: {{{topic}}}`,
});

const adminAssignmentAndMockTestGeneratorFlow = ai.defineFlow(
  {
    name: 'adminAssignmentAndMockTestGeneratorFlow',
    inputSchema: AdminAssignmentAndMockTestGeneratorInputSchema,
    outputSchema: AdminAssignmentAndMockTestGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await generateQuestionsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate questions.');
    }
    return output;
  }
);
