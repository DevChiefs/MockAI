"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import FaultyTerminal from "@/components/faulty-terminal-bg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      await signIn(values.email, values.password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-shell min-h-screen overflow-hidden text-white">
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-25" />

      {/* Terminal Background */}
      <div className="pointer-events-none absolute inset-0 hidden opacity-20 md:block">
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
          pageLoadAnimation={false}
          brightness={0.8}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-6">
          <Link href="/" className="flex items-center gap-2 text-slate-200">
            <Image
              src="/mockai-trans-bg.png"
              alt="MockAI Logo"
              width={30}
              height={30}
            />
            <span className="font-medium">MockAI</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-300 transition-colors hover:text-white"
          >
            Back to Home
          </Link>
        </nav>

        {/* Login Form */}
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="glass-card rounded-2xl p-8">
              <p className="section-label">Welcome Back</p>

              <div className="text-center mb-8">
                <h1 className="mb-2 mt-4 text-4xl font-semibold">
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Sign In To Continue
                  </span>
                </h1>
                <p className="text-gray-300">Pick up where you left off.</p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-6 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
