"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Phone, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export function Hero() {
    const [settings, setSettings] = useState({
        hero_background_url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c44e58e5-b73d-46c4-8c54-3d20d5288039/intro-video.mp4",
        hero_background_type: "video",
        hero_logo_video_url: "",
        contact_phone: "9845374999"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data, error } = await supabase
                    .from("site_settings")
                    .select("*")
                    .in("key", ["hero_background_url", "hero_background_type", "hero_logo_video_url", "contact_phone"]);

                if (data) {
                    const settingsMap: any = {};
                    data.forEach(item => {
                        settingsMap[item.key] = item.value;
                    });
                    setSettings(prev => ({ ...prev, ...settingsMap }));
                }
            } catch (error) {
                console.error("Error fetching hero settings:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const isVideo = settings.hero_background_type === 'video';

    return (
        <section id="hero" className="relative h-screen flex flex-col items-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                {isVideo ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        key={settings.hero_background_url}
                        className="w-full h-full object-cover opacity-80"
                    >
                        <source src={settings.hero_background_url} type="video/mp4" />
                    </video>
                ) : (
                    <Image 
                        src={settings.hero_background_url} 
                        alt="Hero background" 
                        fill 
                        className="object-cover opacity-80"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />
            </div>

            <div className="container relative z-20 px-4 h-full flex flex-col items-center justify-center gap-12 md:gap-16 pt-32 md:pt-40 pb-12 md:pb-24">
                {/* Center Logo Video with Glassmorphic Panel */}
                <div className="flex flex-col items-center justify-center w-full max-w-4xl px-4 text-center">
                    {settings.hero_logo_video_url && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative group"
                        >
                            {/* Subtle Shadow for Readability */}
                            <div className="absolute inset-0 bg-black/10 blur-[100px] rounded-full opacity-50 pointer-events-none" />

                            <div className="relative flex items-center justify-center overflow-hidden">
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    key={settings.hero_logo_video_url}
                                    className="w-full max-h-[40vh] md:max-h-[50vh] object-contain scale-125 transform-gpu transition-transform duration-700 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                >
                                    <source src={settings.hero_logo_video_url} type="video/mp4" />
                                </video>
                            </div>
                        </motion.div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-4 md:gap-8 items-center justify-center w-full"
                >
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 h-14 md:h-16 rounded-full text-base md:text-lg group shadow-2xl shadow-blue-600/40 border-none min-w-[180px] md:min-w-[200px]"
                        onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                    >
                        View Portfolio
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                        size="lg"
                        className="bg-white hover:bg-zinc-100 text-black px-8 md:px-10 h-14 md:h-16 rounded-full text-base md:text-lg shadow-2xl min-w-[180px] md:min-w-[200px]"
                        onClick={() => window.location.href = `tel:${settings.contact_phone}`}
                    >
                        <Phone className="mr-2 h-5 w-5" />
                        Call Now
                    </Button>
                </motion.div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-20 hidden md:block">
                <div className="w-[1px] h-10 bg-white" />
            </div>
        </section>
    );
}

