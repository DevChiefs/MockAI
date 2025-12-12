"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import VapiInterface from "./_components/vapi-interface";
import type { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as Id<"interviewSessions">;
  const [isResumeVisible, setIsResumeVisible] = useState(true);

  // Get auth token from localStorage
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("mockai_auth_token")
      : null;

  const session = useQuery(
    api.interviewSessions.getSession,
    token && sessionId ? { token, sessionId } : "skip"
  );

  if (session === undefined) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-xl">Loading session...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (session === null) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-gray-400 hover:text-white text-xs sm:text-sm"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/mockai-trans-bg.png"
                alt="MockAI Logo"
                width={32}
                height={32}
                className="sm:w-10 sm:h-10"
              />
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                MockAI
              </span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Session Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {session.jobTitle}
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              AI Interview Practice Session
            </p>
          </div>

          {/* Desktop Layout (md and up): Side by Side */}
          <div className="hidden md:flex gap-6">
            {/* Left Side - Interview Interface */}
            <div className="flex-1">
              <VapiInterface
                sessionId={sessionId}
                jobTitle={session.jobTitle}
                resumeText={session.resumeText}
              />
            </div>

            {/* Right Side - Resume Panel (Desktop) */}
            <div
              className={`transition-all duration-300 ${
                isResumeVisible ? "w-96" : "w-12"
              }`}
            >
              {/* Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResumeVisible(!isResumeVisible)}
                className="mb-4 text-gray-400 hover:text-white"
              >
                {isResumeVisible ? (
                  <>
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Hide Resume
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Show Resume
                  </>
                )}
              </Button>

              {/* Resume Content */}
              {isResumeVisible && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 h-[calc(100vh-220px)] overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold">Your Resume</h3>
                  </div>

                  {/* Resume Text */}
                  <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {session.resumeText}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile/Tablet Layout (below md): Stacked */}
          <div className="md:hidden space-y-6">
            {/* Interview Interface */}
            <div>
              <VapiInterface
                sessionId={sessionId}
                jobTitle={session.jobTitle}
                resumeText={session.resumeText}
              />
            </div>

            {/* Resume Section (Mobile/Tablet) */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              {/* Toggle Button */}
              <button
                onClick={() => setIsResumeVisible(!isResumeVisible)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">Your Resume</h3>
                </div>
                {isResumeVisible ? (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Resume Content (Collapsible) */}
              {isResumeVisible && (
                <div className="px-4 pb-4 max-h-[400px] overflow-y-auto">
                  <div className="pt-4 border-t border-gray-800">
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {session.resumeText}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
