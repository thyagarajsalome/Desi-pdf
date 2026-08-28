"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileImage, LogIn, LogOut, Loader2, Moon, Sun, Crown } from "lucide-react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition">
              <FileImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              Desi<span className="text-blue-600 dark:text-blue-400">PDF</span>
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">Tools Hub</Link>
            <Link href="/pdf-to-jpg" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">PDF to JPG</Link>
            <Link href="/compress" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">Compress</Link>
            <Link href="/merge" className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">Merge</Link>
          </nav>

          <div className="flex items-center gap-4">
            
            <Link href="/pricing" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
              <Crown className="h-3 w-3" /> Pro
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.displayName.split(" ")[0]}</span>
                  <img src={user.photoURL || "https://ui-avatars.com/api/?name=User"} alt="Profile" className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
                </div>
                
                {user.email === "thyagarajsalome@gmail.com" && (
                  <Link 
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-sm font-bold transition"
                  >
                    <i className="fa-solid fa-shield-halved"></i>
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold shadow-md transition"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
