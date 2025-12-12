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
  resumeText: string;
}

export default function VapiInterface({
  sessionId,
  jobTitle,
  resumeText,
}: VapiInterfaceProps) {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [status, setStatus] = useState<string>("Ready to start");
  const [error, setError] = useState<string | null>(null);
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
      setStatus("Connecting...");
      setError(null);

      // Create assistant configuration with resume context
      const assistantConfig = {
        name: "Interview Coach",
        firstMessage: `Hello! I'm excited to interview you for the ${jobTitle} position. I've reviewed your resume, and I'm looking forward to learning more about your experience. Let's begin - could you please tell me a bit about yourself and what interests you about this ${jobTitle} role?`,
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an expert AI interview coach conducting a professional job interview for the position: ${jobTitle}.

CANDIDATE'S RESUME:
${resumeText}

YOUR ROLE AND INSTRUCTIONS:
1. Conduct a realistic, professional job interview
2. Ask relevant behavioral and technical questions based on the job requirements and the candidate's resume
3. Listen attentively to their responses
4. Provide brief, constructive feedback after key answers
5. Ask thoughtful follow-up questions to dive deeper
6. Keep the conversation natural and encouraging
7. Cover topics like: experience, technical skills, problem-solving, teamwork, and career goals
8. Aim for a 10-15 minute interview with 5-7 main questions

IMPORTANT BEHAVIORAL NOTES:
- Be conversational and warm, but professional
- Don't ask "How can I help you?" - YOU are the interviewer
- Take turns speaking - ask one question at a time
- Reference their resume when relevant
- End the interview by asking if they have questions for you

Begin the interview now. You've already greeted them with the firstMessage.`,
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
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 text-center">
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
                    : "border-gray-700 text-black hover:text-white hover:bg-gray-800"
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
