"use client";

import { useAuth } from "@/context/AuthContext";

// Backwards-compatible hook reading globally cached AuthContext state
// instead of triggering duplicate Supabase/Firebase queries per tool component.
export function useProStatus() {
  const { isPro, loading } = useAuth();
  return { isPro, loading };
}
