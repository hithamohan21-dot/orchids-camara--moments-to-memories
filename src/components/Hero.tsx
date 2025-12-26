"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Phone, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Logo } from "./Logo";
import { useState, useRef, useEffect } from "react";

export function Hero() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

    return (
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105"
          >
            <source 
              src="https://cdn.pixabay.com/video/2020/10/21/52835-471243171_tiny.mp4" 
              type="video/mp4" 
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
        </div>

        <div className="container relative z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 opacity-80 scale-75 md:scale-100">
            <Logo />
          </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-2 mb-4 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </motion.div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-4 text-white">
            CAMARA
          </h1>
          <p className="text-xl md:text-2xl font-light text-blue-100/80 mb-12 tracking-widest uppercase">
            moments to memories
          </p>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center w-full max-w-lg mx-auto sm:max-w-none">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-14 rounded-full text-lg group w-full sm:w-auto"
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Portfolio
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 h-14 rounded-full text-lg transition-all w-full sm:w-auto"
                onClick={() => window.location.href = "tel:9845374999"}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Button>
            </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 text-white/40 text-sm tracking-widest uppercase"
          >
            Bengaluru, Karnataka
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
