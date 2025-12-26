"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

    const ADMIN_EMAIL = "admin@gmail.com";
    const DEFAULT_PASSWORD = "camara2024";

    useEffect(() => {
      async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/admin/dashboard");
        }
        setChecking(false);
      }
      checkUser();
    }, [router]);

    async function handleLogin(e: React.FormEvent) {
      e.preventDefault();
      setLoading(true);
      try {
        if (password !== DEFAULT_PASSWORD) {
          throw new Error("Invalid admin password");
        }

        // Use a simple local session for admin access to bypass Supabase Auth issues
        localStorage.setItem("admin_session", "active");
        
        toast.success("Welcome back!");
        router.push("/admin/dashboard");
      } catch (error: any) {
        toast.error(error.message || "Invalid credentials");
      } finally {
        setLoading(false);
      }
    }

  if (checking) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-12">
        <Logo />
      </div>
      
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
        <p className="text-blue-100/40 mb-8">Enter the admin password to access the dashboard</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-blue-100/60">Admin Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-100/20" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-black/50 border-white/10 pl-11 text-white h-12 rounded-xl focus:ring-blue-500/50"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg rounded-xl"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Access Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
