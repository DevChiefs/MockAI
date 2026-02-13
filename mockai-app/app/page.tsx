"use client";

import FaultyTerminal from "@/components/faulty-terminal-bg";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BrainCircuit,
  ChartSpline,
  MessageCircleHeart,
  MicVocal,
  Sparkles,
} from "lucide-react";

const featureCards = [
  {
    title: "Role-Specific Questions",
    description:
      "Interview prompts are tailored to your resume, target role, and job description.",
    icon: BrainCircuit,
  },
  {
    title: "Live Voice Practice",
    description:
      "Simulate a real interview with an AI interviewer that speaks naturally and asks follow-ups.",
    icon: MicVocal,
  },
  {
    title: "Focused Improvement",
    description:
      "Practice repeatedly with structured prompts designed to reveal communication and technical gaps.",
    icon: ChartSpline,
  },
];

const workflowSteps = [
  {
    title: "Create Session",
    description: "Set role title, paste the job description, and upload your resume PDF.",
  },
  {
    title: "Start Interview",
    description:
      "Launch a voice session and answer realistic behavioral and technical prompts.",
  },
  {
    title: "Repeat & Improve",
    description:
      "Run new sessions for different roles to sharpen confidence and response quality.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <div className="app-shell min-h-screen overflow-hidden text-white">
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-25" />

      <div className="pointer-events-none absolute inset-0 hidden opacity-20 md:block">
        <FaultyTerminal
          scale={1.2}
          gridMul={[3, 2]}
          digitSize={1}
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
        <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
            <div className="flex items-center gap-2">
              <Image
                src="/mockai-trans-bg.png"
                alt="MockAI Logo"
                width={44}
                height={44}
              />
              <span className="text-xl font-semibold tracking-tight">
                MockAI
              </span>
            </div>

            <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
              <a href="#features" className="transition-colors hover:text-white">
                Features
              </a>
              <a href="#how-it-works" className="transition-colors hover:text-white">
                How It Works
              </a>
              <a href="#about" className="transition-colors hover:text-white">
                About
              </a>
            </div>

            <Button
              onClick={() =>
                router.push(isAuthenticated ? "/dashboard" : "/register")
              }
              className="bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 hover:from-sky-400 hover:to-cyan-300"
            >
              {isAuthenticated ? "Open Dashboard" : "Get Started"}
            </Button>
          </div>
        </nav>

        <main>
          <section className="px-5 pb-16 pt-20 md:px-8 md:pt-24">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto max-w-4xl text-center">
                <span className="section-label">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Interview Studio
                </span>

                <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl md:text-7xl">
                  Practice Interviews
                  <span className="block bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                    Like It&apos;s The Real One
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg md:text-xl">
                  MockAI runs role-aware voice interviews using your resume and
                  the job description, so each session targets the exact
                  position you care about.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    onClick={() =>
                      router.push(isAuthenticated ? "/dashboard" : "/register")
                    }
                    className="h-12 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-8 text-base font-semibold text-slate-950 hover:from-sky-400 hover:to-cyan-300"
                  >
                    {isAuthenticated ? "Start New Session" : "Start Free Practice"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="h-12 rounded-xl border-white/20 bg-white/5 px-8 text-base text-slate-100 hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </div>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="glass-card floating-soft rounded-2xl p-5">
                  <p className="text-sm text-slate-300">Interview Mode</p>
                  <p className="mt-1 text-2xl font-semibold">Voice + AI</p>
                </div>
                <div
                  className="glass-card floating-soft rounded-2xl p-5"
                  style={{ animationDelay: "0.8s" }}
                >
                  <p className="text-sm text-slate-300">Session Inputs</p>
                  <p className="mt-1 text-2xl font-semibold">Resume + Job JD</p>
                </div>
                <div
                  className="glass-card floating-soft rounded-2xl p-5"
                  style={{ animationDelay: "1.6s" }}
                >
                  <p className="text-sm text-slate-300">Interview Length</p>
                  <p className="mt-1 text-2xl font-semibold">10-15 Min Target</p>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="px-5 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-10 text-center">
                <span className="section-label">Built For Real Prep</span>
                <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
                  Why MockAI Works
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {featureCards.map((feature) => (
                  <article
                    key={feature.title}
                    className="glass-card glass-card-hover rounded-2xl p-6"
                  >
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-slate-950">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {feature.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="px-5 py-16 md:px-8 md:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-10 text-center">
                <span className="section-label">
                  <MessageCircleHeart className="h-3.5 w-3.5" />
                  Workflow
                </span>
                <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
                  From Setup To Practice In Minutes
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {workflowSteps.map((step, index) => (
                  <div key={step.title} className="glass-card rounded-2xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-200/90">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="px-5 pb-20 pt-10 md:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="glass-card rounded-3xl border border-cyan-300/30 p-7 text-center md:p-10">
                <h2 className="text-3xl font-semibold md:text-5xl">
                  Ready To Practice Your Next Interview?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
                  Create a session, upload your resume, and rehearse with a
                  realistic AI interviewer that stays aligned with your target
                  role.
                </p>
                <Button
                  onClick={() =>
                    router.push(isAuthenticated ? "/dashboard" : "/register")
                  }
                  className="mt-8 h-12 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-8 text-base font-semibold text-slate-950 hover:from-sky-400 hover:to-cyan-300"
                >
                  {isAuthenticated ? "Go To Dashboard" : "Create Free Account"}
                </Button>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-5 py-8 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-slate-400 md:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/mockai-trans-bg.png"
                alt="MockAI Logo"
                width={26}
                height={26}
              />
              <span>MockAI</span>
            </div>
            <span>© 2026 MockAI. Interview smarter.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
