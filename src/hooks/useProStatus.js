"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useProStatus(passedUser) {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      // Check passed user first, or fetch active Supabase user
      let email = passedUser?.email;

      if (!email) {
        const { data: { session } } = await supabase.auth.getSession();
        email = session?.user?.email;
      }

      if (!email) {
        setIsPro(false);
        setLoading(false);
        return;
      }
      
      // Admin is always Pro
      if (email === "thyagarajsalome@gmail.com") {
        setIsPro(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_pro, pro_until')
          .eq('email', email)
          .single();

        if (error || !data) {
          setIsPro(false);
        } else if (data.is_pro && data.pro_until) {
          // Check expiry date
          const now = new Date();
          const expiry = new Date(data.pro_until);
          setIsPro(expiry > now);
        } else {
          setIsPro(data.is_pro);
        }
      } catch (err) {
        setIsPro(false);
      }
      setLoading(false);
    }
    
    checkStatus();
  }, [passedUser]);

  return { isPro, loading };
}
