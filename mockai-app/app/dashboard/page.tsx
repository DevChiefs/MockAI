"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateSessionModal from "./_components/create-session-modal";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Calendar, Briefcase } from "lucide-react";
import Image from "next/image";
import type { Id } from "@/convex/_generated/dataModel";

// Type for interview session
interface InterviewSession {
  _id: Id<"interviewSessions">;
  _creationTime: number;
  userId: Id<"users">;
  jobTitle: string;
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

  // Get auth token from localStorage
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10";
      case "in_progress":
        return "text-yellow-400 bg-yellow-400/10";
      case "pending":
        return "text-blue-400 bg-blue-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/mockai-trans-bg.png"
                alt="MockAI Logo"
                width={40}
                height={40}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                MockAI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">{user?.name || user?.email}</span>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-gray-700 text-black hover:text-white hover:bg-gray-800"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Interview Sessions</h1>
              <p className="text-gray-400">
                Manage your AI-powered interview practice sessions
              </p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Session
            </Button>
          </div>

          {/* Sessions List */}
          {sessions === undefined ? (
            <div className="text-center py-12 text-gray-400">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-12 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  No Interview Sessions Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  Create your first interview session to start practicing with
                  AI
                </p>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  Create Your First Session
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session: InterviewSession) => (
                <div
                  key={session._id}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/interview/${session._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                        {session.jobTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(session.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        session.status
                      )}`}
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
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Session Modal */}
        <CreateSessionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
