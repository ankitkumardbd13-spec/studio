import { z } from "zod";
import { ai } from "./genkit";

// Define the structure of an assignment question
export const QuestionSchema = z.object({
  question: z.string().describe("The objective question text"),
  options: z.array(z.string()).describe("Four possible options for the question"),
  correctAnswerIndex: z.number().describe("The index of the correct option (0-3)"),
});

// Define the input schema for generating an assignment
export const AssignmentInputSchema = z.object({
  subject: z.string().describe("The subject of the assignment, e.g., 'Fitter'"),
  topic: z.string().describe("The specific topic or multiple topics"),
});

// Define the Genkit flow
export const generateAssignmentFlow = ai.defineFlow({
  name: "generateAssignmentFlow",
  inputSchema: AssignmentInputSchema,
  outputSchema: z.array(QuestionSchema),
}, async (input) => {
  const { subject, topic } = input;

  const prompt = `Generate exactly 30 objective-type (multiple choice) questions for vocational students on the subject "${subject}" specifically focusing on the topic(s) "${topic}".
Each question MUST have exactly four options and a clearly identified correct answer.
Ensure the questions are accurate and relevant to an ITI (Industrial Training Institute) curriculum level.
`;

  const { output } = await ai.generate({
    prompt,
    output: {
      schema: z.array(QuestionSchema),
    },
  });

  return output || [];
});
