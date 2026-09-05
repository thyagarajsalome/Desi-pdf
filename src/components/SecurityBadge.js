import React from 'react';

export default function SecurityBadge({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-medium shadow-sm transition-all ${className}`}>
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <i className="fa-solid fa-shield-halved text-emerald-600 dark:text-emerald-400 text-sm sm:text-base"></i>
      <span>
        <strong className="font-semibold text-emerald-900 dark:text-emerald-200">100% Client-Side &amp; Private:</strong> Files never leave your browser or get saved on servers.
      </span>
    </div>
  );
}
