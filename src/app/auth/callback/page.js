"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the auth code / hash for a session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth callback error:", error);
          router.push("/login?error=auth_failed");
          return;
        }

        if (data?.session?.user) {
          const user = data.session.user;
          // Ensure user exists in user_profiles
          await supabase
            .from("user_profiles")
            .upsert(
              {
                email: user.email,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "email", ignoreDuplicates: true }
            );
        }

        // Redirect to homepage or previous intended destination
        router.push("/");
      } catch (err) {
        console.error("Callback exception:", err);
        router.push("/login");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      <p className="text-gray-600 dark:text-gray-300 font-medium">
        Completing Google Sign-in... Please wait.
      </p>
    </div>
  );
}
