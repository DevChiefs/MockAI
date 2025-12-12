"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

const TOKEN_KEY = "mockai_auth_token";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    setToken(storedToken);
    setIsLoading(false);
  }, []);

  const user = useQuery(api.auth.getCurrentUser, token ? { token } : "skip");

  const signUpAction = useAction(api.auth.signUp);
  const signInMutation = useMutation(api.auth.signIn);
  const signOutMutation = useMutation(api.auth.signOut);

  const signUp = async (email: string, password: string, name?: string) => {
    const result = await signUpAction({ email, password, name });

    if (!result.success) {
      throw new Error(result.error);
    }

    if (result.token) {
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
    }
    return result;
  };

  const signIn = async (email: string, password: string) => {
    const result = await signInMutation({ email, password });

    if (!result.success) {
      throw new Error(result.error);
    }

    if (result.token) {
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
    }
    return result;
  };

  const signOut = async () => {
    if (token) {
      await signOutMutation({ token });
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || (token !== null && user === undefined),
    signUp,
    signIn,
    signOut,
  };
}
