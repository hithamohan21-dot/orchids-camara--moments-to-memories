"use client";

import { Camera } from "lucide-react";
import Link from "next/link";

export function Logo({ className = "", showTagline = false }: { className?: string; showTagline?: boolean }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 group">
          <Camera className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <span className="text-2xl font-bold tracking-[0.2em] text-white">CAMARA</span>
      </div>
      {showTagline && (
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1 ml-12">
          moments to memories
        </span>
      )}
    </div>
  );
}
