"use client";

import { useState } from "react";
import Script from "next/script";
import { useTheme } from "@/components/ThemeProvider";
import { Check, Zap, Shield, Crown, Loader2 } from "lucide-react";

export default function PricingPage() {
  const { resolvedTheme } = useTheme();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handlePayment = async (planName, amount) => {
    setLoadingPlan(planName);
    try {
      // 1. Create order on our backend
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      
      const order = await res.json();
      
      if (order.error) {
        alert("Payment setup error: " + order.error);
        setLoadingPlan(null);
        return;
      }

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key on client
        amount: order.amount,
        currency: order.currency,
        name: "DesiPDF Premium",
        description: `${planName} Subscription`,
        order_id: order.id,
        theme: {
          color: resolvedTheme === "dark" ? "#4f46e5" : "#2563eb",
        },
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          // Here we would update Firestore to unlock premium for this user
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
          contact: "9999999999",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong initializing payment.");
    }
    setLoadingPlan(null);
  };

  return (
    <div className="pt-20 pb-24 px-4 relative flex-grow flex flex-col items-center">
      {/* Razorpay Client Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-10 left-1/2 -z-10 w-[800px] h-[400px] bg-gradient-to-r from-blue-100/50 via-indigo-50/50 to-purple-100/50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50 -translate-x-1/2"></div>
      </div>

      <div className="max-w-3xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Unlock the Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">DesiPDF Pro</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-xl mx-auto">
          Batch convert 100+ pages, unlock massive zip downloads, and get priority processing with zero limits.
        </p>
      </div>

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Student Pass */}
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Student Pass (24 Hrs)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Perfect for urgent exam forms.</p>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">₹49</div>
          <ul className="space-y-4 mb-8 flex-grow">
            {["24 Hour Pro Access", "Max 50MB File Size", "Batch Convert Allowed", "No Ads"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-blue-500" /> {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => handlePayment("Student Pass", 49)}
            disabled={loadingPlan !== null}
            className="w-full py-4 rounded-xl font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition flex items-center justify-center gap-2"
          >
            {loadingPlan === "Student Pass" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Pay ₹49 with UPI"}
          </button>
        </div>

        {/* Pro Monthly (Highlight) */}
        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 border border-blue-500 dark:border-indigo-700 rounded-3xl p-8 shadow-xl flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            Most Popular
          </div>
          <div className="h-12 w-12 bg-white/20 text-white rounded-xl flex items-center justify-center mb-6">
            <Crown className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Pro Monthly</h3>
          <p className="text-sm text-blue-100 mb-6">For cyber cafes & heavy users.</p>
          <div className="text-4xl font-extrabold text-white mb-6">₹149<span className="text-lg text-blue-200 font-medium">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-grow">
            {["Unlimited Conversions", "No File Size Limits", "Batch ZIP Downloads", "Priority Support", "Remove Passwords"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-blue-50">
                <Check className="h-5 w-5 text-blue-300" /> {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => handlePayment("Pro Monthly", 149)}
            disabled={loadingPlan !== null}
            className="w-full py-4 rounded-xl font-bold text-indigo-700 bg-white hover:bg-gray-50 transition shadow-lg flex items-center justify-center gap-2"
          >
            {loadingPlan === "Pro Monthly" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Subscribe ₹149/mo"}
          </button>
        </div>

        {/* Lifetime */}
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Desi-Deal (Lifetime)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Pay once, use forever.</p>
          <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">₹999</div>
          <ul className="space-y-4 mb-8 flex-grow">
            {["Lifetime Pro Access", "All Future Tools Free", "100% Privacy Guarantee", "Early Access Features"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Check className="h-5 w-5 text-purple-500" /> {feature}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => handlePayment("Lifetime Deal", 999)}
            disabled={loadingPlan !== null}
            className="w-full py-4 rounded-xl font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition flex items-center justify-center gap-2"
          >
            {loadingPlan === "Lifetime Deal" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Lifetime Deal"}
          </button>
        </div>

      </div>
    </div>
  );
}
