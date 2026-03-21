"use server";

import { generateAssignmentFlow } from "@/ai/assignments";

export async function generateQuestionsTarget(subject: string, topic: string) {
  try {
    const questions = await generateAssignmentFlow({ subject, topic });
    return { success: true, questions };
  } catch (err: any) {
    console.error("AI Generation failed:", err);
    return { success: false, error: err.message || "Failed to generate questions." };
  }
}
