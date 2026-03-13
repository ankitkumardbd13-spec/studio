'use server';
/**
 * @fileOverview An AI-powered tool for administrators to generate bilingual objective MCQ assignment questions.
 *
 * - generateAssignmentAndMockTest - A function that handles the generation of 20 bilingual MCQ questions.
 * - AdminAssignmentAndMockTestGeneratorInput - The input type for the generateAssignmentAndMockTest function.
 * - AdminAssignmentAndMockTestGeneratorOutput - The return type for the generateAssignmentAndMockTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  text: z.string().describe('The bilingual text of the question (English / Hindi). Example: "What is current? / विद्युत धारा क्या है?"'),
  type: z.literal('objective').describe('The type of the question (always objective for MCQ).'),
  options: z.array(z.string()).describe('Provide exactly 4 distinct bilingual options (English / Hindi).'),
  correctAnswer: z.string().describe('Specify which of the 4 bilingual options is the correct one.'),
});

const AdminAssignmentAndMockTestGeneratorInputSchema = z.object({
  trade: z
    .string()
    .describe('The name of the ITI trade (e.g., Electrician, Fitter, HSI).'),
  year:
    z.number().int().min(1).describe('The year of the course (e.g., 1 for first year, 2 for second year).'),
  subject: z
    .string()
    .describe('The specific subject (e.g., Trade Theory, Workshop Calculation, Employability Skills).'),
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
  questions: z.array(QuestionSchema).describe('Exactly 20 bilingual objective (MCQ) questions generated for the topic.'),
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
Your task is to generate relevant assignment questions based on the provided trade, year, subject, and topic, adhering strictly to the **New DGT/NCVT Syllabus**.

Please generate exactly 20 Objective (MCQ) questions. 

**CONTEXT:**
- Trade: {{{trade}}}
- Year: {{{year}}}
- Subject: {{{subject}}}
- Topic: {{{topic}}}

**IMPORTANT BILINGUAL REQUIREMENT:**
- Every question text MUST be provided in both English and Hindi, separated by a forward slash.
- Every option (A, B, C, D) MUST be provided in both English and Hindi, separated by a forward slash.
- Example Question: "What is the unit of resistance? / प्रतिरोध की इकाई क्या है?"
- Example Option: "Ohm / ओम"

Ensure technical terms are accurate in both languages according to NCVT standards.`,
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
