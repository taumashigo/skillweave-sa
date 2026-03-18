"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useAuthStore } from "@/lib/store";
import type { Profile, UserRole } from "@/types";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const { user: profile, isLoading, setUser, setLoading } = useAuthStore();
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createSupabaseBrowser();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (data && !error) {
      setUser(data as Profile);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setUser(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (data?.user && !error) {
      const { error: insertErr } = await supabase.from("profiles").insert({
        user_id: data.user.id,
        full_name: fullName,
        role,
        email,
      });
      if (insertErr) {
        await supabase.from("profiles").update({ full_name: fullName, role, email }).eq("user_id", data.user.id);
      }
      setUser({
        id: data.user.id,
        user_id: data.user.id,
        full_name: fullName,
        email,
        role,
        onboarding_completed: false,
        country: "South Africa",
        career_interests: [],
        skills_interests: [],
        target_jobs: [],
        portfolio_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile);
    }
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const signInWithOAuth = async (provider: "google" | "github") => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/auth/callback" },
    });
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!session?.user) return { data: null, error: "Not authenticated" };
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", session.user.id)
      .select()
      .single();
    if (data && !error) setUser(data as Profile);
    return { data, error };
  };

  return {
    session,
    profile,
    isLoading,
    isAuthenticated: !!session,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    resetPassword,
    updateProfile,
    refreshProfile: () => session?.user && fetchProfile(session.user.id),
  };
}