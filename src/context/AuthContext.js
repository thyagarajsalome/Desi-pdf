"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";

const ADMIN_EMAIL = "thyagarajsalome@gmail.com";

const AuthContext = createContext({
  user: null,
  session: null,
  isPro: false,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [session, setSession] = useState(null);
  const [sbLoading, setSbLoading] = useState(true);
  const [fbLoading, setFbLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  // Single global Supabase auth subscription
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      setSupabaseUser(activeSession?.user ?? null);
      setSbLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      setSession(activeSession);
      setSupabaseUser(activeSession?.user ?? null);
      setSbLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Single global Firebase auth subscription
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      setFbLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const user = supabaseUser || firebaseUser;
  const loading = sbLoading && fbLoading;

  // Resolve Pro status once globally per signed-in user
  useEffect(() => {
    let active = true;
    async function resolvePro() {
      const email = user?.email;
      if (!email) {
        if (active) setIsPro(false);
        return;
      }
      if (email === ADMIN_EMAIL) {
        if (active) setIsPro(true);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("is_pro, pro_until")
          .eq("email", email)
          .single();

        if (!active) return;
        if (error || !data) {
          setIsPro(false);
        } else if (data.is_pro && data.pro_until) {
          setIsPro(new Date(data.pro_until) > new Date());
        } else {
          setIsPro(Boolean(data.is_pro));
        }
      } catch {
        if (active) setIsPro(false);
      }
    }
    resolvePro();
    return () => {
      active = false;
    };
  }, [user?.email]);

  const signInWithGoogle = async () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.convertpdftojpg.in";
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) {
      console.error("Supabase Google Auth Error:", error);
      throw error;
    }
    return data;
  };

  const signOut = async () => {
    if (supabaseUser) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Supabase SignOut Error:", error);
    }
    if (firebaseUser) {
      await fbSignOut(auth);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isPro,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
