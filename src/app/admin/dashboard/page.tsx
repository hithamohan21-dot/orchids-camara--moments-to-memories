"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Star, Settings, Menu, X as CloseIcon, Layout } from "lucide-react";
import { AdminPortfolioManager } from "@/components/AdminPortfolioManager";
import { AdminReviewsManager } from "@/components/AdminReviewsManager";
import { AdminSettingsManager } from "@/components/AdminSettingsManager";
import { AdminHeroManager } from "@/components/AdminHeroManager";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const menuItems = [
    { id: "hero", label: "Hero Section", icon: Layout },
    { id: "portfolio", label: "Portfolio", icon: LayoutDashboard },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-black font-sans">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-zinc-200 hidden lg:flex flex-col p-6 shadow-sm">
        <div className="mb-12">
          <Logo />
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setActiveTab(item.id)}
              className={`w-full justify-start rounded-xl px-4 py-6 transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:text-white" 
                  : "text-zinc-500 hover:text-black hover:bg-zinc-100"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span className="font-semibold tracking-wide">{item.label}</span>
            </Button>
          ))}
        </nav>

        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-4 py-6"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-semibold">Logout</span>
        </Button>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-[100] lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-white p-8 flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <Logo />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-3">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full justify-start rounded-xl px-4 py-7 transition-all duration-200 ${
                      activeTab === item.id 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                        : "text-zinc-500 hover:text-black hover:bg-zinc-100"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="font-bold tracking-wide">{item.label}</span>
                  </Button>
                ))}
              </nav>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:bg-red-50 rounded-xl px-4 py-7 mt-auto"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="font-bold">Logout</span>
              </Button>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* Header */}
        <header className="h-24 border-b border-zinc-200 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </Button>
            <Logo />
          </div>
          <h2 className="text-sm font-black hidden lg:block uppercase tracking-[0.3em] text-zinc-400">
            Management Panel / <span className="text-black">{activeTab}</span>
          </h2>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black">Administrator</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Master Access</p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white shadow-xl shadow-blue-600/30">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
          {activeTab === "hero" && <AdminHeroManager />}
          {activeTab === "portfolio" && <AdminPortfolioManager />}
          {activeTab === "reviews" && <AdminReviewsManager />}
          {activeTab === "settings" && <AdminSettingsManager />}
        </div>
      </main>
    </div>
  );
}
