"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import CreateSessionModal from "./_components/create-session-modal";
import { useRouter } from "next/navigation";
import {
  Activity,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock3,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import type { Id } from "@/convex/_generated/dataModel";

interface InterviewSession {
  _id: Id<"interviewSessions">;
  _creationTime: number;
  userId: Id<"users">;
  jobTitle: string;
  jobDescription?: string;
  resumeText: string;
  vapiSessionId?: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: number;
  updatedAt: number;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<Id<"interviewSessions"> | null>(
    null
  );

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("mockai_auth_token")
      : null;

  const sessions = useQuery(
    api.interviewSessions.getUserSessions,
    token ? { token } : "skip"
  );
  const deleteSessionMutation = useMutation(
    api.interviewSessions.deleteSession
  );

  const sessionStats = useMemo(() => {
    const rows = sessions ?? [];
    return {
      total: rows.length,
      completed: rows.filter((item) => item.status === "completed").length,
      inProgress: rows.filter((item) => item.status === "in_progress").length,
      pending: rows.filter((item) => item.status === "pending").length,
    };
  }, [sessions]);

  const handleDeleteSession = async (sessionId: Id<"interviewSessions">) => {
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this interview session?"
    );
    if (!confirmed) return;

    setDeletingId(sessionId);
    try {
      await deleteSessionMutation({ token, sessionId });
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusStyle = (status: InterviewSession["status"]) => {
    switch (status) {
      case "completed":
        return "text-emerald-300 bg-emerald-500/15 border-emerald-400/30";
      case "in_progress":
        return "text-amber-300 bg-amber-500/15 border-amber-400/30";
      case "pending":
        return "text-sky-300 bg-sky-500/15 border-sky-400/30";
      default:
        return "text-slate-300 bg-slate-500/15 border-slate-400/30";
    }
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <ProtectedRoute>
      <div className="app-shell min-h-screen text-white">
        <div className="grid-overlay pointer-events-none absolute inset-0 opacity-25" />

        <div className="relative z-10">
          <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Image
                  src="/mockai-trans-bg.png"
                  alt="MockAI Logo"
                  width={34}
                  height={34}
                  className="sm:h-10 sm:w-10"
                />
                <span className="text-xl font-semibold sm:text-2xl">MockAI</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="max-w-[140px] truncate text-sm text-slate-300 sm:max-w-none sm:text-base">
                  {user?.name || user?.email}
                </span>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="border-white/20 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10 sm:text-sm"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </nav>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="glass-card mb-6 rounded-2xl p-5 sm:mb-8 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="section-label">Interview Workspace</p>
                  <h1 className="mt-3 text-2xl font-semibold sm:text-4xl">
                    Your Practice Sessions
                  </h1>
                  <p className="mt-2 text-sm text-slate-300 sm:text-base">
                    Track role-specific sessions and launch your next mock
                    interview.
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="h-11 w-full justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 hover:from-sky-400 hover:to-cyan-300 sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Create New Session
                </Button>
              </div>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-slate-300">
                  Total Sessions
                </p>
                <p className="mt-2 text-2xl font-semibold">{sessionStats.total}</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                  Completed
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {sessionStats.completed}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300">
                  <Activity className="h-3.5 w-3.5 text-amber-300" />
                  In Progress
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {sessionStats.inProgress}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300">
                  <Clock3 className="h-3.5 w-3.5 text-sky-300" />
                  Pending
                </div>
                <p className="mt-2 text-2xl font-semibold">{sessionStats.pending}</p>
              </div>
            </div>

            {sessions === undefined ? (
              <div className="glass-card rounded-2xl py-14 text-center text-sm text-slate-300 sm:text-base">
                Loading sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-10 text-center sm:py-16">
                <div className="glass-card mx-auto max-w-2xl rounded-2xl p-7 sm:p-12">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400">
                    <Briefcase className="h-7 w-7 text-slate-950" />
                  </div>
                  <h3 className="text-xl font-semibold sm:text-2xl">
                    No Sessions Yet
                  </h3>
                  <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300 sm:text-base">
                    Add your target role, job description, and resume to start
                    personalized interview practice.
                  </p>
                  <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-7 h-11 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 hover:from-sky-400 hover:to-cyan-300"
                  >
                    Create First Session
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session: InterviewSession) => (
                  <article
                    key={session._id}
                    className="glass-card glass-card-hover cursor-pointer rounded-2xl p-5"
                    onClick={() => router.push(`/interview/${session._id}`)}
                  >
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold sm:text-xl">
                          {session.jobTitle}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-300 sm:text-sm">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{formatDate(session.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="min-h-[40px] text-sm leading-relaxed text-slate-300">
                      {session.jobDescription
                        ? `${session.jobDescription.slice(0, 130)}${session.jobDescription.length > 130 ? "..." : ""}`
                        : "No job description provided for this session."}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(session.status)}`}
                      >
                        {session.status.replace("_", " ").toUpperCase()}
                      </span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSession(session._id);
                        }}
                        disabled={deletingId === session._id}
                        className="p-2 text-red-300 hover:bg-red-500/15 hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <CreateSessionModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
