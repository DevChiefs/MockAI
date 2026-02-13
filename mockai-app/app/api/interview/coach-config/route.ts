import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildInterviewCoachConfig,
  getFallbackInterviewCoachConfig,
} from "@/lib/interview-coach-config";

export const runtime = "nodejs";

const coachConfigRequestSchema = z.object({
  jobTitle: z.string().min(1).max(120),
  jobDescription: z.string().max(50_000).optional(),
  resumeText: z.string().min(10).max(200_000),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON request body" },
      { status: 400 }
    );
  }

  const parsed = coachConfigRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }

  const { jobTitle, jobDescription, resumeText } = parsed.data;
  const fallbackConfig = getFallbackInterviewCoachConfig(
    jobTitle,
    resumeText,
    jobDescription
  );

  try {
    const config = await buildInterviewCoachConfig({
      jobTitle,
      jobDescription,
      resumeText,
    });
    return NextResponse.json({
      success: true,
      source: "langchain",
      data: config,
    });
  } catch (error) {
    console.error("Failed to build LangChain interview coach config:", error);

    return NextResponse.json({
      success: true,
      source: "fallback",
      data: fallbackConfig,
    });
  }
}
