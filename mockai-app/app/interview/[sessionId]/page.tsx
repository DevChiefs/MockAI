"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  ScrollText,
} from "lucide-react";
import Image from "next/image";
import VapiInterface from "./_components/vapi-interface";
import type { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as Id<"interviewSessions">;
  const [isContextVisible, setIsContextVisible] = useState(true);

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
        <div className="app-shell flex min-h-screen items-center justify-center text-white">
          <div className="glass-card rounded-2xl px-8 py-6 text-xl">
            Loading session...
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (session === null) {
    return (
      <ProtectedRoute>
        <div className="app-shell flex min-h-screen items-center justify-center text-white">
          <div className="glass-card rounded-2xl px-8 py-7 text-center">
            <h1 className="mb-4 text-2xl font-semibold">Session Not Found</h1>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 hover:from-sky-400 hover:to-cyan-300"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="app-shell min-h-screen text-white">
        <div className="grid-overlay pointer-events-none absolute inset-0 opacity-25" />

        <div className="relative z-10">
          <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-xs text-slate-300 hover:text-white sm:text-sm"
              >
                <ArrowLeft className="mr-1 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>

              <div className="flex items-center gap-2 sm:gap-3">
                <Image
                  src="/mockai-trans-bg.png"
                  alt="MockAI Logo"
                  width={34}
                  height={34}
                  className="sm:h-10 sm:w-10"
                />
                <span className="text-lg font-semibold sm:text-2xl">MockAI</span>
              </div>
            </div>
          </nav>

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8">
            <div className="glass-card mb-6 rounded-2xl p-5 sm:mb-8 sm:p-7">
              <h1 className="text-2xl font-semibold sm:text-4xl">
                {session.jobTitle}
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                AI Interview Practice Session
              </p>
              <div className="mt-4 inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100">
                Live Voice Interview Context Loaded
              </div>
            </div>

            <div className="hidden gap-6 md:flex">
              <div className="flex-1">
                <VapiInterface
                  sessionId={sessionId}
                  jobTitle={session.jobTitle}
                  jobDescription={session.jobDescription}
                  resumeText={session.resumeText}
                />
              </div>

              <div
                className={`transition-all duration-300 ${
                  isContextVisible ? "w-96" : "w-14"
                }`}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsContextVisible(!isContextVisible)}
                  className="mb-3 text-slate-300 hover:text-white"
                >
                  {isContextVisible ? (
                    <>
                      <ChevronRight className="mr-2 h-4 w-4" />
                      Hide Context
                    </>
                  ) : (
                    <>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Show Context
                    </>
                  )}
                </Button>

                {isContextVisible && (
                  <aside className="glass-card h-[calc(100vh-250px)] space-y-5 overflow-y-auto rounded-2xl p-5">
                    {session.jobDescription && (
                      <section>
                        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
                          <ScrollText className="h-5 w-5 text-cyan-300" />
                          <h3 className="text-base font-semibold">
                            Job Description
                          </h3>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                          {session.jobDescription}
                        </p>
                      </section>
                    )}

                    <section>
                      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
                        <FileText className="h-5 w-5 text-cyan-300" />
                        <h3 className="text-base font-semibold">Your Resume</h3>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                        {session.resumeText}
                      </p>
                    </section>
                  </aside>
                )}
              </div>
            </div>

            <div className="space-y-6 md:hidden">
              <VapiInterface
                sessionId={sessionId}
                jobTitle={session.jobTitle}
                jobDescription={session.jobDescription}
                resumeText={session.resumeText}
              />

              <div className="glass-card overflow-hidden rounded-2xl">
                <button
                  onClick={() => setIsContextVisible(!isContextVisible)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-300" />
                    <h3 className="font-semibold">Interview Context</h3>
                  </div>
                  {isContextVisible ? (
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronLeft className="h-5 w-5 text-slate-400" />
                  )}
                </button>

                {isContextVisible && (
                  <div className="max-h-[460px] space-y-5 overflow-y-auto border-t border-white/10 px-4 pb-4 pt-4">
                    {session.jobDescription && (
                      <section>
                        <h4 className="mb-2 text-sm font-semibold text-cyan-100">
                          Job Description
                        </h4>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                          {session.jobDescription}
                        </p>
                      </section>
                    )}

                    <section>
                      <h4 className="mb-2 text-sm font-semibold text-cyan-100">
                        Your Resume
                      </h4>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                        {session.resumeText}
                      </p>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
