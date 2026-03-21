"use server";

import { reviewAlumniMessageFlow } from "@/ai/alumni";

export async function validateAlumniReview(message: string) {
  try {
    const response = await reviewAlumniMessageFlow({ message });
    return { success: true, result: response };
  } catch (err: any) {
    console.error("AI Generation failed:", err);
    return { success: false, error: err.message || "Failed to validate review." };
  }
}
