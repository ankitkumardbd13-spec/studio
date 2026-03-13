'use server';
/**
 * @fileOverview An AI assistant for drafting professional messages for the Principal and Student Manager.
 *
 * - draftAdminMessage - A function that handles the message drafting process.
 * - AdminMessageDraftingAssistantInput - The input type for the draftAdminMessage function.
 * - AdminMessageDraftingAssistantOutput - The return type for the draftAdminMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminMessageDraftingAssistantInputSchema = z.object({
  messageIntent: z.string().describe('The main purpose or topic of the message.'),
  recipient: z.enum(['Principal', 'Student Manager']).describe('The intended recipient of the message.'),
  keyPoints: z.string().optional().describe('Any specific points or details that must be included in the message.'),
  tone: z.string().optional().describe('The desired tone for the message (e.g., formal, encouraging, informative). Defaults to professional and appropriate for an educational institute.'),
});
export type AdminMessageDraftingAssistantInput = z.infer<typeof AdminMessageDraftingAssistantInputSchema>;

const AdminMessageDraftingAssistantOutputSchema = z.object({
  draftedMessage: z.string().describe('The AI-generated professional message.'),
});
export type AdminMessageDraftingAssistantOutput = z.infer<typeof AdminMessageDraftingAssistantOutputSchema>;

export async function draftAdminMessage(input: AdminMessageDraftingAssistantInput): Promise<AdminMessageDraftingAssistantOutput> {
  return adminMessageDraftingAssistantFlow(input);
}

const adminMessageDraftingPrompt = ai.definePrompt({
  name: 'adminMessageDraftingPrompt',
  input: {schema: AdminMessageDraftingAssistantInputSchema},
  output: {schema: AdminMessageDraftingAssistantOutputSchema},
  prompt: `You are an AI assistant for Maharana Pratap ITI Saharanpur, Uttar Pradesh. Your task is to draft professional and appropriate messages for internal communication within an educational institute.

Draft a message based on the following details:

Recipient: {{{recipient}}}
Message Intent: {{{messageIntent}}}
{{#if keyPoints}}Key Points to Include: {{{keyPoints}}}
{{/if}}{{#if tone}}Desired Tone: {{{tone}}}
{{else}}Tone: Professional and appropriate for an educational institute.
{{/if}}

Please structure the message clearly with a greeting and a closing.`,
});

const adminMessageDraftingAssistantFlow = ai.defineFlow(
  {
    name: 'adminMessageDraftingAssistantFlow',
    inputSchema: AdminMessageDraftingAssistantInputSchema,
    outputSchema: AdminMessageDraftingAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await adminMessageDraftingPrompt(input);
    return output!;
  }
);
