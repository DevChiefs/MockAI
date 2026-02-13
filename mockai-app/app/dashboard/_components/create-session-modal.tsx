"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z
    .string()
    .min(30, "Job description must be at least 30 characters")
    .max(20_000, "Job description is too long"),
  resumeFile: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Resume PDF is required")
    .refine(
      (files) => files?.[0]?.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB"
    ),
});

type FormData = z.infer<typeof formSchema>;

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSessionModal({
  isOpen,
  onClose,
}: CreateSessionModalProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const createSession = useMutation(api.interviewSessions.createSession);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfjs, setPdfjs] = useState<any>(null);

  // Dynamically import PDF.js (client-side only)
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        // Configure worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        setPdfjs(pdfjsLib);
      } catch (error) {
        console.error("Failed to load PDF.js:", error);
        setError("Failed to initialize PDF processor");
      }
    };

    loadPdfJs();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const resumeFile = watch("resumeFile");
  const jobDescription = watch("jobDescription");

  // Update selected file name when file changes
  useEffect(() => {
    if (resumeFile && resumeFile.length > 0) {
      setSelectedFileName(resumeFile[0].name);
    } else {
      setSelectedFileName(null);
    }
  }, [resumeFile]);

  const onSubmit = async (data: FormData) => {
    // Check if PDF.js is loaded
    if (!pdfjs) {
      setError(
        "PDF processor is still loading. Please wait a moment and try again."
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("mockai_auth_token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Read file
      const file = data.resumeFile[0];
      const arrayBuffer = await file.arrayBuffer();

      // Process PDF on client side using PDF.js
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: { str?: string }) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += pageText + "\n\n";
      }

      // Clean up the text
      const cleanText = fullText
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .replace(/ \n /g, "\n") // Clean up line breaks
        .trim();

      if (!cleanText || cleanText.length < 10) {
        throw new Error(
          "Could not extract text from PDF. Please ensure your resume contains readable text."
        );
      }

      // Create session with extracted text
      const sessionResult = await createSession({
        token,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        resumeText: cleanText,
      });

      if (!sessionResult.success) {
        throw new Error(sessionResult.error || "Failed to create session");
      }

      // Reset form and close modal
      reset();
      setSelectedFileName(null);
      onClose();

      // Navigate to interview page
      router.push(`/interview/${sessionResult.sessionId}`);
    } catch (err) {
      console.error("Error creating session:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create session. Please try again.";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      reset();
      setSelectedFileName(null);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="glass-card relative w-full max-w-md rounded-2xl p-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-2">Create Interview Session</h2>
        <p className="text-gray-400 mb-6">
          Add role details and upload your resume to start a focused interview
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Job Title Input */}
          <div>
            <Label htmlFor="jobTitle" className="text-white">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              type="text"
              placeholder="e.g., Senior Software Engineer"
              {...register("jobTitle")}
              disabled={isProcessing}
              className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
            {errors.jobTitle && (
              <p className="text-red-400 text-sm mt-1">
                {errors.jobTitle.message}
              </p>
            )}
          </div>

          {/* Job Description Input */}
          <div>
            <Label htmlFor="jobDescription" className="text-white">
              Job Description
            </Label>
            <textarea
              id="jobDescription"
              placeholder="Paste the role requirements, responsibilities, and preferred skills..."
              {...register("jobDescription")}
              disabled={isProcessing}
              rows={6}
              className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="mt-1 text-right text-xs text-gray-400">
              {(jobDescription?.length || 0).toLocaleString()}/20,000
            </div>
            {errors.jobDescription && (
              <p className="text-red-400 text-sm mt-1">
                {errors.jobDescription.message}
              </p>
            )}
          </div>

          {/* Resume Upload */}
          <div>
            <Label htmlFor="resumeFile" className="text-white">
              Resume (PDF)
            </Label>
            <div className="mt-2">
              <label
                htmlFor="resumeFile"
                className={`
                  flex items-center justify-center w-full px-4 py-8 
                  border-2 border-dashed rounded-lg cursor-pointer
                  transition-colors
                  ${
                    selectedFileName
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-gray-600 bg-gray-800"
                  }
                  ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <div className="text-center">
                  {selectedFileName ? (
                    <>
                      <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-white font-medium">
                        {selectedFileName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-300">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF (max 5MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="resumeFile"
                  type="file"
                  accept=".pdf"
                  {...register("resumeFile")}
                  disabled={isProcessing}
                  className="hidden"
                  onChange={(e) => {
                    register("resumeFile").onChange(e);
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFileName(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>
            {errors.resumeFile && (
              <p className="text-red-400 text-sm mt-1">
                {errors.resumeFile.message?.toString()}
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Create Session"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
