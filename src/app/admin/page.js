"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [seoPages, setSeoPages] = useState([]);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const ADMIN_EMAIL = "thyagarajsalome@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setIsAuthorized(true);
        await Promise.all([fetchUsers(), fetchSeoPages()]);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchSeoPages = async () => {
    try {
      const { data, error } = await supabase.from('seo_pages').select('slug, h1_title').order('created_at', { ascending: false });
      if (!error && data) {
        setSeoPages(data);
      }
    } catch (err) {
      console.error("Error fetching SEO pages:", err);
    }
  };

  const checkLinksHealth = async () => {
    setCheckingHealth(true);
    const statuses = {};
    
    // Process in batches of 50 to avoid overwhelming the browser/server when scaling to 2000+ links
    const batchSize = 50;
    for (let i = 0; i < seoPages.length; i += batchSize) {
      const batch = seoPages.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (page) => {
          try {
            const res = await fetch(`/tool/${page.slug}`, { method: 'HEAD' });
            statuses[page.slug] = res.status;
          } catch (error) {
            statuses[page.slug] = 500;
          }
        })
      );
      // Update state progressively as batches complete
      setHealthStatus((prev) => ({ ...prev, ...statuses }));
    }
    setCheckingHealth(false);
  };

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      // Sort by newest first
      usersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProPlan = async (userId, currentPlan) => {
    const newPlan = currentPlan === "pro" ? "free" : "pro";
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { plan: newPlan });
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
    } catch (error) {
      console.error("Error updating user plan:", error);
      alert("Failed to update user plan.");
    }
  };

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const proUsersCount = users.filter(u => u.plan === "pro").length;
  const freeUsersCount = users.length - proUsersCount;

  return (
    <div className="pt-16 pb-24 px-4 max-w-7xl mx-auto min-h-[80vh]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <i className="fa-solid fa-shield-halved text-blue-600"></i> Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage users, view revenue, and grant Pro access.</p>
        </div>
        <button onClick={fetchUsers} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold transition flex items-center gap-2 self-start md:self-auto">
          <i className="fa-solid fa-arrows-rotate"></i> Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4 text-blue-500">
            <i className="fa-solid fa-users text-2xl"></i>
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Total Users</h3>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{users.length}</p>
        </div>
        
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4 text-amber-500">
            <i className="fa-solid fa-crown text-2xl"></i>
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Pro Subscribers</h3>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{proUsersCount}</p>
        </div>
        
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4 text-emerald-500">
            <i className="fa-solid fa-indian-rupee-sign text-2xl"></i>
            <h3 className="font-bold text-gray-700 dark:text-gray-300">Est. Revenue</h3>
          </div>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white">₹{proUsersCount * 49}</p>
          <p className="text-xs text-gray-500 mt-1">Based on ₹49/Student plan</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <h3 className="font-bold text-gray-900 dark:text-white">Registered Users</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">Email Address</th>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">Phone</th>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">Joined Date</th>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 text-center">Plan</th>
                <th className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 font-medium">
                    No users found in the database.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{user.email}</td>
                    <td className="px-6 py-4">{user.phone || "—"}</td>
                    <td className="px-6 py-4">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      }) : "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.plan === "pro" 
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800/50" 
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      }`}>
                        {user.plan === "pro" && <i className="fa-solid fa-crown mr-1.5"></i>}
                        {user.plan || "free"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleProPlan(user.id, user.plan)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          user.plan === "pro"
                            ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                        }`}
                      >
                        {user.plan === "pro" ? "Revoke Pro" : "Grant Pro"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Programmatic SEO Pages List */}
      <div className="mt-10 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 dark:text-white">Programmatic SEO Pages ({seoPages.length})</h3>
          <button 
            onClick={checkLinksHealth}
            disabled={checkingHealth || seoPages.length === 0}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-2"
          >
            {checkingHealth ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Checking...</>
            ) : (
              <><i className="fa-solid fa-heart-pulse"></i> Check Health Status</>
            )}
          </button>
        </div>
        
        <div className="p-0 max-h-[600px] overflow-y-auto">
          {seoPages.length === 0 ? (
            <p className="p-6 text-gray-500 dark:text-gray-400 text-sm">No SEO pages found in database.</p>
          ) : (
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-3 font-bold text-gray-700 dark:text-gray-300">Title</th>
                  <th className="px-6 py-3 font-bold text-gray-700 dark:text-gray-300">URL Path</th>
                  <th className="px-6 py-3 font-bold text-gray-700 dark:text-gray-300 text-right">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {seoPages.map((page) => (
                  <tr key={page.slug} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition">
                    <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">{page.h1_title}</td>
                    <td className="px-6 py-3">
                      <Link href={`/tool/${page.slug}`} target="_blank" className="text-blue-500 hover:text-blue-600 hover:underline">
                        /tool/{page.slug}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {healthStatus[page.slug] ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          healthStatus[page.slug] === 200
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500"
                        }`}>
                          {healthStatus[page.slug] === 200 ? "200 OK" : `Error ${healthStatus[page.slug]}`}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
