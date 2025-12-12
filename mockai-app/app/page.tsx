"use client";

import FaultyTerminal from "@/components/faulty-terminal-bg";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-20">
        <FaultyTerminal
          scale={1.2}
          gridMul={[3, 2]}
          digitSize={1.0}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.3}
          glitchAmount={0.8}
          flickerAmount={0.5}
          noiseAmp={0.7}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#047BE3"
          mouseReact={true}
          mouseStrength={0.3}
          pageLoadAnimation={true}
          brightness={0.8}
        />
      </div>

      <div className="relative z-10">
        <nav className="flex items-center justify-between p-6 md:p-8">
          <div className="flex items-center">
            <Image
              src="/mockai-trans-bg.png"
              alt="MockAI Logo"
              width={50}
              height={50}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              MockAI
            </span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="/register"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </nav>

        <section className="px-6 md:px-8 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Master Your
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent block">
                Job Interviews
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered interview companion that helps you prepare,
              practice, and excel in any job interview with personalized
              guidance and real-time feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() =>
                  isAuthenticated
                    ? router.push("/dashboard")
                    : router.push("/register")
                }
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isAuthenticated ? "Start Practicing" : "Get Started Free"}
              </button>
              <button className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        <section id="features" className="px-6 md:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Why Choose
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {" "}
                MockAI
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  AI-Powered Practice
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Get personalized interview questions tailored to your
                  industry, role, and experience level with intelligent AI
                  analysis.
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M7 8l-2-2m12 2l2-2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Real-time Feedback
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Receive instant feedback on your answers, body language, and
                  speaking pace to improve your interview performance.
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Progress Tracking
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Monitor your improvement over time with detailed analytics and
                  personalized recommendations for skill development.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 md:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have successfully landed their
              dream jobs with MockAI&apos;s comprehensive interview preparation
              platform.
            </p>
            <Button
              onClick={() =>
                isAuthenticated
                  ? router.push("/practice")
                  : router.push("/register")
              }
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-10 py-5 rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
            </Button>
          </div>
        </section>

        <footer className="px-6 md:px-8 py-12 border-t border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <Image
                  src="/mockai-trans-bg.png"
                  alt="MockAI Logo"
                  width={50}
                  height={50}
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  MockAI
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                © 2025 MockAI. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
