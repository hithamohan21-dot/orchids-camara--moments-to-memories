"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Phone, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

export function Hero() {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-white">
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c44e58e5-b73d-46c4-8c54-3d20d5288039/intro-video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white z-10" />
            </div>

            <div className="container relative z-20 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="mb-12 w-full max-w-4xl mx-auto rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)] border-8 border-white group relative"
                    >
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto aspect-video object-cover transition-transform duration-[2s] group-hover:scale-105"
                        >
                            <source src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c44e58e5-b73d-46c4-8c54-3d20d5288039/intro-video.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    </motion.div>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center w-full px-4 md:px-0">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 h-12 md:h-16 rounded-full text-sm md:text-lg group shadow-xl shadow-blue-600/20 font-black uppercase tracking-widest"
                            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            View Portfolio
                            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            className="w-full sm:w-auto bg-black hover:bg-zinc-900 text-white px-8 md:px-10 h-12 md:h-16 rounded-full text-sm md:text-lg shadow-xl font-black uppercase tracking-widest"
                            onClick={() => window.location.href = "tel:9845374999"}
                        >
                            <Phone className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                            Call Now
                        </Button>
                    </div>
                </motion.div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                <div className="w-[1px] h-12 bg-zinc-900" />
            </div>
        </section>
    );
}
