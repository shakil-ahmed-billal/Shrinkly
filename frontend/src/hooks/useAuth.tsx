"use client";

import { authClient } from "@/lib/auth-client";
import { ReactNode, useEffect, useState } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const fetchSession = async () => {
      try {
        const result = await authClient.getSession();
        if (result.data) {
          setSession(result.data);
          setUser(result.data.user || null);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name: email.split("@")[0], // Use email prefix as default name
      });

      if (result.error) {
        return { error: result.error };
      }

      // Refresh session after sign up
      const sessionResult = await authClient.getSession();
      if (sessionResult.data) {
        setSession(sessionResult.data);
        setUser(sessionResult.data.user || null);
      }
      
      return { data: result.data, error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "Failed to create account",
        },
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        return { error: result.error };
      }

      // Refresh session after sign in
      const sessionResult = await authClient.getSession();
      if (sessionResult.data) {
        setSession(sessionResult.data);
        setUser(sessionResult.data.user || null);
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || "Failed to sign in",
        },
      };
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      // Clear session after sign out
      setSession(null);
      setUser(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
