'use server';
/**
 * @fileOverview An AI-powered tool for administrators to generate objective MCQ assignment questions.
 *
 * - generateAssignmentAndMockTest - A function that handles the generation of 20 MCQ questions.
 * - AdminAssignmentAndMockTestGeneratorInput - The input type for the generateAssignmentAndMockTest function.
 * - AdminAssignmentAndMockTestGeneratorOutput - The return type for the generateAssignmentAndMockTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  text: z.string().describe('The text of the question.'),
  type: z.literal('objective').describe('The type of the question (always objective for MCQ).'),
  options: z.array(z.string()).describe('Provide exactly 4 distinct options (A, B, C, D).'),
  correctAnswer: z.string().describe('Specify which of the 4 options is the correct one.'),
});

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
  questions: z.array(QuestionSchema).describe('Exactly 20 objective (MCQ) questions generated for the topic.'),
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
Your task is to generate relevant assignment questions based on the provided trade, year, and topic, adhering strictly to the **New DGT/NCVT Syllabus**.

Please generate exactly 20 Objective (MCQ) questions. 
Each question MUST have exactly 4 options and one clearly marked correct answer.

Ensure the questions are technically accurate for a student in the specified ITI trade and year.

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
