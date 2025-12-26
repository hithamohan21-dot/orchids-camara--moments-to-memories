"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Settings, User } from "lucide-react";
import { AdminPortfolioManager } from "@/components/AdminPortfolioManager";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

    useEffect(() => {
      function checkAuth() {
        const session = localStorage.getItem("admin_session");
        if (!session) {
          router.push("/admin");
        } else {
          setUser({ email: "admin@gmail.com", role: "admin" });
        }
        setLoading(false);
      }
      checkAuth();
    }, [router]);

    async function handleLogout() {
      localStorage.removeItem("admin_session");
      toast.success("Logged out successfully");
      router.push("/admin");
    }


  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/5 border-r border-white/10 hidden lg:flex flex-col p-6">
        <div className="mb-12">
          <Logo />
        </div>
        
        <nav className="flex-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start bg-blue-600/10 text-blue-400 hover:bg-blue-600/20">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Portfolio
          </Button>
        </nav>

        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <Logo />
          </div>
          <h2 className="text-xl font-bold hidden lg:block">Dashboard</h2>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Administrator</p>
                <p className="text-xs text-blue-400">Admin Panel</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                A
              </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden text-red-400"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-blue-100/40">Manage your website content and portfolio items.</p>
          </div>

          <AdminPortfolioManager />
        </div>
      </main>
    </div>
  );
}
