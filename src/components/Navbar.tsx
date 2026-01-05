"use client";

import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Menu, X, Phone } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

    return (
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-xl py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105 duration-300">
            <Logo />
          </Link>
  
            {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all hover:text-blue-600 ${scrolled ? "text-zinc-800" : "text-zinc-900 drop-shadow-sm"}`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 font-black shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 hover:shadow-blue-600/60 text-[10px] tracking-widest" asChild>
                  <a href="tel:9845374999">
                    <Phone className="w-4 h-4 mr-2" />
                    CALL NOW
                  </a>
                </Button>
              </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-black p-2 bg-zinc-50 rounded-xl transition-all active:scale-95" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-zinc-200 overflow-hidden md:hidden shadow-2xl"
            >
                <div className="flex flex-col gap-1 p-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] py-3 px-4 hover:bg-zinc-50 hover:text-blue-600 rounded-xl transition-all"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl h-10 font-black uppercase tracking-widest text-[9px]" asChild>
                      <a href="tel:9845374999">
                        <Phone className="w-3 h-3 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
    </nav>
  );
}
