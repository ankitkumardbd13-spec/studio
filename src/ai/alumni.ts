import { z } from "zod";
import { ai } from "./genkit";

// Define the input schema
export const AlumniReviewInputSchema = z.object({
  message: z.string().describe("The review message submitted by the alumni"),
});

// Define the output schema
export const AlumniReviewOutputSchema = z.object({
  isAppropriate: z.boolean().describe("True if the message is appropriate, polite, and safe for a public education portal"),
  reason: z.string().describe("Explanation for the decision"),
  suggestedEdits: z.string().optional().describe("If inappropriate or slightly off, suggest a better version"),
});

// Define the flow
export const reviewAlumniMessageFlow = ai.defineFlow({
  name: "reviewAlumniMessageFlow",
  inputSchema: AlumniReviewInputSchema,
  outputSchema: AlumniReviewOutputSchema,
}, async (input) => {
  const { output } = await ai.generate({
    prompt: `Analyze the following review message submitted by an alumni for an ITI (Industrial Training Institute) public portal:
"${input.message}"

Determine if this message is appropriate to be posted publicly. It should be respectful, free of profanity or hate speech, and relevant to their experience as a student. Ensure the language is safe.`,
    output: {
      schema: AlumniReviewOutputSchema,
    },
  });

  return output || {
    isAppropriate: false,
    reason: "Failed to analyze message content",
  };
});
