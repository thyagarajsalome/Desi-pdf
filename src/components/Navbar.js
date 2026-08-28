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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition">
              <FileImage className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
              Desi<span className="text-blue-600 dark:text-blue-400">PDF</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">All Tools</Link>
            <Link href="/image-to-pdf" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">Image to PDF</Link>
            <Link href="/image-compressor" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">Compress Image</Link>
            <Link href="/compress" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">Compress PDF</Link>
            <Link href="/merge" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition">Merge</Link>
          </nav>

          <div className="flex items-center gap-2">
            
            <Link href="/pricing" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition">
              <Crown className="h-3 w-3" /> Pro
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : user ? (
              <div className="hidden md:flex items-center gap-2">
                <img src={user.photoURL || "https://ui-avatars.com/api/?name=User"} alt="Profile" className="h-7 w-7 rounded-full border border-gray-200 dark:border-gray-700" />
                
                {user.email === "thyagarajsalome@gmail.com" && (
                  <Link 
                    href="/admin"
                    className="px-2.5 py-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-semibold transition"
                  >
                    Admin
                  </Link>
                )}

                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium transition"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#09090b] px-4 py-5 shadow-lg absolute w-full left-0">
          
          <div className="space-y-1 mb-4">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-3 mb-2">Tools</p>
            <Link onClick={() => setMobileMenuOpen(false)} href="/" className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900">All Tools</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/image-to-pdf" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">Image to PDF</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/image-compressor" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">Compress Image</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/pdf-to-jpg" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">PDF to JPG</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/compress" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">Compress PDF</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/merge" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">Merge PDF</Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/age-calculator" className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900">Age Calculator</Link>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
            <Link onClick={() => setMobileMenuOpen(false)} href="/pricing" className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg border border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 text-sm font-semibold">
              <Crown className="h-3.5 w-3.5" /> Upgrade to Pro
            </Link>
            
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <img src={user.photoURL || "https://ui-avatars.com/api/?name=User"} alt="Profile" className="h-8 w-8 rounded-full" />
                  <span className="font-medium text-sm text-gray-900 dark:text-white">{user.displayName}</span>
                </div>
                {user.email === "thyagarajsalome@gmail.com" && (
                  <Link onClick={() => setMobileMenuOpen(false)} href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 justify-center">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex justify-center items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <button onClick={() => { handleLogin(); setMobileMenuOpen(false); }} className="flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium">
                <LogIn className="h-4 w-4" /> Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
