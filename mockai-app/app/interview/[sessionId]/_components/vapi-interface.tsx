"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";

// Vapi types (using any to avoid SDK version conflicts)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VapiClient = any;

interface VapiInterfaceProps {
  sessionId: Id<"interviewSessions">;
  jobTitle: string;
  jobDescription?: string;
  resumeText: string;
}

interface InterviewCoachConfig {
  firstMessage: string;
  systemPrompt: string;
  focusAreas: string[];
}

interface CoachConfigApiResponse {
  success: boolean;
  source?: "langchain" | "fallback";
  data?: InterviewCoachConfig;
  error?: string;
}

const buildFallbackCoachConfig = (
  jobTitle: string,
  resumeText: string,
  jobDescription?: string
): InterviewCoachConfig => ({
  firstMessage: `Hello! I'm excited to interview you for the ${jobTitle} role. I reviewed your resume and will ask targeted questions. Let's start: tell me about yourself and why this role is a strong fit for you.`,
  systemPrompt: `You are an expert AI interview coach conducting a professional interview for the position: ${jobTitle}.

JOB DESCRIPTION:
${jobDescription?.trim() ? jobDescription.trim().slice(0, 8_000) : "Not provided"}

CANDIDATE RESUME:
${resumeText.replace(/\s+/g, " ").trim().slice(0, 12_000)}

YOUR ROLE:
1. Run a realistic interview with 5-7 strong questions.
2. Ask one question at a time and wait for the candidate's response.
3. Mix behavioral, technical, and problem-solving questions.
4. Reference resume details when relevant.
5. Give short, constructive feedback after important answers.
6. Ask concise follow-up questions to probe depth.
7. Keep tone warm, direct, and professional.
8. End by asking if they have any questions for the interviewer.

DO NOT:
- Ask "How can I help you?"
- Dump multiple questions in one turn
- Break role as interviewer`,
  focusAreas: ["experience depth", "technical clarity", "communication quality"],
});

export default function VapiInterface({
  sessionId,
  jobTitle,
  jobDescription,
  resumeText,
}: VapiInterfaceProps) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [status, setStatus] = useState<string>("Ready to start");
  const [error, setError] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const vapiRef = useRef<VapiClient | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callRef = useRef<any>(null); // Store the active call object

  const updateSessionStatus = useMutation(
    api.interviewSessions.updateSessionStatus
  );

  // Add page unload handler to force stop call
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (e) {
          console.error("Error stopping Vapi on page unload:", e);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && vapiRef.current && isConnected) {
        try {
          vapiRef.current.stop();
        } catch (e) {
          console.error("Error stopping Vapi on visibility change:", e);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isConnected]);

  // Initialize Vapi
  useEffect(() => {
    const initVapi = async () => {
      try {
        // Dynamically import Vapi SDK
        const Vapi = (await import("@vapi-ai/web")).default;

        const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
        if (!publicKey || publicKey === "your_vapi_public_key_here") {
          setError(
            "Vapi API key not configured. Please add NEXT_PUBLIC_VAPI_PUBLIC_KEY to your .env.local file. See VAPI_SETUP.md for instructions."
          );
          return;
        }

        // Initialize Vapi client
        const vapi = new Vapi(publicKey);
        vapiRef.current = vapi;

        // Set up event listeners
        vapi.on("call-start", () => {
          setIsConnected(true);
          setStatus("Connected - Interview in progress");
          setError(null);

          // Store reference to the Vapi instance which has the call
          callRef.current = vapi;

          // Update session status to in_progress
          const token = localStorage.getItem("mockai_auth_token");
          if (token) {
            updateSessionStatus({
              token,
              sessionId,
              status: "in_progress",
            });
          }
        });

        vapi.on("call-end", () => {
          callRef.current = null; // Clear the call object
          setIsConnected(false);
          setIsAISpeaking(false); // Stop AI speaking animation
          setStatus("Interview ended");
          setIsMuted(false); // Reset mute state

          // Update session status to completed
          const token = localStorage.getItem("mockai_auth_token");
          if (token) {
            updateSessionStatus({
              token,
              sessionId,
              status: "completed",
            });
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vapi.on("error", (error: any) => {
          console.error("Vapi error:", error);

          // Handle different error formats
          let errorMessage = "An error occurred with the voice connection";

          if (error?.message) {
            errorMessage = error.message;
          } else if (typeof error === "string") {
            errorMessage = error;
          } else if (error?.error) {
            errorMessage = error.error;
          } else if (error?.statusCode === 401 || error?.statusCode === 403) {
            errorMessage =
              "Authentication failed. Please check your Vapi API key.";
          }

          setError(errorMessage);
          setStatus("Connection error");
          setIsConnected(false);
        });

        vapi.on("speech-start", () => {
          setIsAISpeaking(true);
          setStatus("AI is speaking...");
        });

        vapi.on("speech-end", () => {
          setIsAISpeaking(false);
          setStatus("Your turn to speak");
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Failed to initialize Vapi:", err);

        let errorMessage = "Failed to initialize voice interface.";

        // Provide specific error messages
        if (
          err?.message?.includes("API key") ||
          err?.message?.includes("authentication")
        ) {
          errorMessage =
            "Invalid Vapi API key. Please check your NEXT_PUBLIC_VAPI_PUBLIC_KEY in .env.local";
        } else if (
          err?.message?.includes("network") ||
          err?.message?.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (err?.message) {
          errorMessage = `Initialization error: ${err.message}`;
        }

        setError(errorMessage);
      }
    };

    initVapi();

    // Cleanup on unmount - CRITICAL: Stop call when component unmounts
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (e) {
          console.error("Error stopping Vapi on unmount:", e);
        }
        callRef.current = null;
      }
    };
  }, [sessionId, updateSessionStatus]);

  const handleStartCall = async () => {
    if (!vapiRef.current) {
      setError("Voice interface not initialized");
      return;
    }

    try {
      setStatus("Preparing interview...");
      setError(null);

      let coachConfig = buildFallbackCoachConfig(
        jobTitle,
        resumeText,
        jobDescription
      );

      try {
        const response = await fetch("/api/interview/coach-config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobTitle,
            jobDescription,
            resumeText,
          }),
        });

        if (response.ok) {
          const payload = (await response.json()) as CoachConfigApiResponse;
          if (payload.success && payload.data) {
            coachConfig = payload.data;
          } else if (payload.error) {
            console.error("Coach config API returned an error:", payload.error);
          }

          if (payload.source === "fallback") {
            console.warn(
              "Using fallback interview coach config (LangChain unavailable)."
            );
          }
        } else {
          console.error(
            "Coach config API request failed with status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Failed to fetch coach config:", error);
      }

      setFocusAreas(coachConfig.focusAreas.slice(0, 4));
      setStatus("Connecting...");

      // Create assistant configuration with LangChain/fallback prompt context
      const assistantConfig = {
        name: "Interview Coach",
        firstMessage: coachConfig.firstMessage,
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: coachConfig.systemPrompt,
            },
          ],
        },
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel voice
        },
      };

      // Use inline assistant configuration (transient assistant)
      // This creates a temporary assistant with our custom configuration
      await vapiRef.current.start(assistantConfig);
    } catch (err) {
      console.error("Failed to start call:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start interview";
      setError(errorMessage);
      setStatus("Error - Failed to connect");
    }
  };

  const handleEndCall = async () => {
    if (!vapiRef.current) return;

    try {
      // Immediately update UI state
      setIsConnected(false);
      setIsAISpeaking(false);
      setIsMuted(false);
      setStatus("Ending interview...");

      // Stop the Vapi call
      await vapiRef.current.stop();

      // Clear references
      callRef.current = null;

      setStatus("Interview ended");

      // Update session status
      const token = localStorage.getItem("mockai_auth_token");
      if (token) {
        await updateSessionStatus({
          token,
          sessionId,
          status: "completed",
        });
      }

      // Return to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error ending call:", error);
      // Force cleanup even on error
      callRef.current = null;
      setIsConnected(false);
      setIsAISpeaking(false);
      setStatus("Interview ended");

      // Still redirect on error
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  };

  const handleToggleMute = () => {
    if (!callRef.current) {
      setError("No active call to mute");
      return;
    }

    try {
      const newMutedState = !isMuted;
      callRef.current.setMuted(newMutedState);
      setIsMuted(newMutedState);
      setStatus(
        newMutedState ? "Microphone muted" : "Connected - Interview in progress"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error toggling mute:", err);
      setError("Failed to toggle mute");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Status Card */}
      <div className="glass-card rounded-2xl p-8 text-center">
        {/* Status Indicator with Sound Waves */}
        <div className="mb-6 relative">
          {/* Animated Sound Waves (only show when AI is speaking) */}
          {isAISpeaking && isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Wave 1 - Outer */}
              <div className="absolute w-40 h-40 rounded-full border-2 border-green-400/30 animate-ping" />
              {/* Wave 2 - Middle */}
              <div
                className="absolute w-32 h-32 rounded-full border-2 border-green-400/50 animate-ping"
                style={{ animationDelay: "0.2s" }}
              />
              {/* Wave 3 - Inner */}
              <div
                className="absolute w-28 h-28 rounded-full border-2 border-green-400/70 animate-ping"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          )}

          {/* Main Mic Icon */}
          <div
            className={`relative w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
              isConnected
                ? isAISpeaking
                  ? "bg-gradient-to-br from-green-500 to-emerald-400 scale-110 shadow-lg shadow-green-500/50"
                  : "bg-gradient-to-br from-green-500 to-emerald-400"
                : error
                  ? "bg-gradient-to-br from-red-500 to-red-400"
                  : "bg-gradient-to-br from-blue-500 to-cyan-400"
            }`}
          >
            <Mic
              className={`w-12 h-12 text-white transition-transform duration-300 ${
                isAISpeaking ? "scale-125" : ""
              }`}
            />
          </div>

          {/* Audio Bars Visualization (when AI is speaking) */}
          {isAISpeaking && isConnected && (
            <div className="flex gap-1 justify-center mt-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.6 + Math.random() * 0.4}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status Text */}
        <h2 className="text-2xl font-semibold mb-2">{status}</h2>
        <div
          className={`mx-auto mb-5 inline-flex items-center rounded-full border px-3 py-1 text-xs ${
            isConnected
              ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-100"
              : "border-sky-400/35 bg-sky-500/15 text-sky-100"
          }`}
        >
          {isConnected ? "Live Call Active" : "Ready To Connect"}
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {!error && !isConnected && (
          <p className="text-gray-400 mb-6">
            Click the button below to start your AI interview practice session
          </p>
        )}
        {isConnected && (
          <p className="text-gray-400 mb-6">
            Speak naturally with the AI interviewer. Your responses will be
            evaluated in real-time.
          </p>
        )}

        {focusAreas.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-300">
              Focus Areas
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {focusAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-100"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {!isConnected ? (
            <Button
              onClick={handleStartCall}
              disabled={!!error && !vapiRef.current}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-8 py-6 text-lg"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Interview
            </Button>
          ) : (
            <>
              <Button
                onClick={handleToggleMute}
                variant="outline"
                className={`px-6 py-6 ${
                  isMuted
                    ? "bg-yellow-500/20 border-yellow-500 text-yellow-300 hover:text-yellow-200"
                    : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {isMuted ? (
                  <>
                    <MicOff className="w-5 h-5 mr-2" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 mr-2" />
                    Mute
                  </>
                )}
              </Button>
              <Button
                onClick={handleEndCall}
                variant="destructive"
                className="px-6 py-6 bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Interview
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        {!isConnected && !error && (
          <div className="mt-8 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Interview Tips:
            </h3>
            <ul className="text-sm text-gray-400 space-y-2 text-left max-w-md mx-auto">
              <li>• Ensure you&apos;re in a quiet environment</li>
              <li>• Allow microphone access when prompted</li>
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Take your time to think before answering</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
