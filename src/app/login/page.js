"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { Loader2, FileImage } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const { user: supabaseUser, loading: isAuthLoading } = useAuth();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  
  // Email/Password/Phone States
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [authError, setAuthError] = useState("");

  // If already logged in via Supabase or Firebase, redirect to home
  useEffect(() => {
    if (supabaseUser) {
      router.push("/");
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [supabaseUser, router]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError("Please enter both email and password.");
      return;
    }
    
    if (isSignUp && !phone) {
      setAuthError("Please enter your phone number.");
      return;
    }
    
    setIsEmailLoading(true);
    setAuthError("");
    
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save user data to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          phone: phone,
          createdAt: new Date().toISOString(),
          plan: "free"
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      // Clean up Firebase error messages for the user
      if (error.code === 'auth/email-already-in-use') setAuthError("Email is already in use. Please sign in instead.");
      else if (error.code === 'auth/invalid-credential') setAuthError("Invalid email or password. If you don't have an account, click 'Sign up here' below.");
      else if (error.code === 'auth/wrong-password') setAuthError("Incorrect password.");
      else if (error.code === 'auth/user-not-found') setAuthError("No account found with this email.");
      else if (error.code === 'auth/weak-password') setAuthError("Password should be at least 6 characters.");
      else if (error.code === 'auth/operation-not-allowed') setAuthError("Email/Password login is not enabled in your Firebase console.");
      else setAuthError("Authentication failed. Please check your credentials and try again.");
      
      setIsEmailLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-4 relative flex-grow flex flex-col items-center justify-center min-h-[80vh]">
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-1/2 left-1/2 -z-10 w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="bg-white dark:bg-[#09090b] w-full max-w-md rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl mb-4">
              <FileImage className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-extrabold text-3xl tracking-tight text-gray-900 dark:text-white">
              Desi<span className="text-blue-600 dark:text-blue-400">PDF</span>
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            {isSignUp ? "Sign up to access Pro features." : "Sign in to manage your documents securely."}
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                required={isSignUp}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isEmailLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-bold shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isEmailLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setAuthError(""); }}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm"
          >
            {isSignUp ? "Already have an account? Sign in here." : "Don't have an account? Sign up here."}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy. Your files remain private and are processed locally.
          </p>
        </div>
      </div>
    </div>
  );
}
