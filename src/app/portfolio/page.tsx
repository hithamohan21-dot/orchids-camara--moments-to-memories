"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Camera, ArrowLeft, Loader2, X, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

// Video component to handle play/pause on hover with sound
function VideoThumbnail({ src, isHovered }: { src: string; isHovered: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.muted = true;
      }
    }
  }, [isHovered]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
      loop
      playsInline
      muted 
    />
  );
}

const subCategoriesMap: Record<string, string[]> = {
  "Photography": [
    "Wedding Photography",
    "Candid Photography",
    "Pre-Wedding Photography",
    "Event Photography",
    "Corporate Photography"
  ],
  "Videography": [
    "Wedding Videography",
    "Candid Videography",
    "Pre-Wedding Videography",
    "Event Videography",
    "Corporate Videography"
  ]
};

export default function PortfolioPage() {
  const [mainFilter, setMainFilter] = useState("all");
  const [subFilter, setSubFilter] = useState("all");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setItems(data.map(item => ({
            type: item.type === 'image' ? 'photography' : 'videography',
            title: item.title,
            client_name: item.client_name,
            category: item.category,
            sub_category: item.sub_category,
            image: item.url,
            videoUrl: item.type === 'video' ? item.url : null,
            id: item.id
          })));
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchMain = mainFilter === "all" || item.type === mainFilter;
    const matchSub = subFilter === "all" || item.sub_category === subFilter;
    return matchMain && matchSub;
  });

  return (
    <main className="min-h-screen bg-white text-black selection:bg-blue-500/10">
      <Navbar />
      
      <section className="pt-40 pb-32 px-4 md:px-24">
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <Button 
                variant="ghost" 
                className="mb-12 text-zinc-400 hover:text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px] group transition-all"
                onClick={() => window.location.href = "/"}
              >
                <ArrowLeft className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>
              <h1 className="text-6xl md:text-8xl font-medium text-black mb-6 tracking-tighter uppercase">
                Portfolio
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl mx-auto uppercase tracking-[0.1em]">
                Capturing life's most profound moments with cinematic precision.
              </p>
            </motion.div>

            <div className="flex flex-col gap-8 w-full max-w-5xl">
              <div className="flex gap-2 bg-zinc-50 p-2 rounded-2xl border border-zinc-100 justify-center overflow-x-auto scrollbar-hide">
                {["all", "photography", "videography"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setMainFilter(f);
                      setSubFilter("all");
                    }}
                    className={`px-10 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 whitespace-nowrap ${
                      mainFilter === f 
                        ? "bg-white text-blue-600 shadow-sm border border-zinc-100" 
                        : "text-zinc-400 hover:text-black"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {mainFilter !== "all" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 overflow-x-auto pb-2 justify-center scrollbar-hide"
                >
                  <button
                    onClick={() => setSubFilter("all")}
                    className={`px-8 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                      subFilter === "all" ? "bg-black text-white" : "bg-zinc-50 text-zinc-400 hover:text-black border border-zinc-100"
                    }`}
                  >
                    All {mainFilter}
                  </button>
                  {subCategoriesMap[mainFilter === "photography" ? "Photography" : "Videography"].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSubFilter(sub)}
                      className={`px-8 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                        subFilter === sub ? "bg-black text-white" : "bg-zinc-50 text-zinc-400 hover:text-black border border-zinc-100"
                      }`}
                    >
                      {sub.replace(" Photography", "").replace(" Videography", "")}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-40">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-40">
              <p className="text-zinc-300 font-bold uppercase tracking-[0.4em] text-xs">The collection is currently quiet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id || item.title}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }}
                    className="group cursor-pointer"
                    onMouseEnter={() => item.type === 'videography' && setHoveredVideo(item.id || item.title)}
                    onMouseLeave={() => setHoveredVideo(null)}
                    onClick={() => {
                      if (item.type === 'videography' && item.videoUrl) {
                        setSelectedVideo(item.videoUrl);
                      } else if (item.type === 'photography') {
                        setSelectedImage(item.image);
                      }
                    }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-50 mb-8 rounded-sm">
                      {item.type === 'photography' ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0">
                          <VideoThumbnail 
                            src={item.videoUrl} 
                            isHovered={hoveredVideo === (item.id || item.title)} 
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-transparent transition-colors duration-500">
                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                              <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-2xl font-medium text-black uppercase tracking-tight">{item.title}</h4>
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{item.type}</span>
                      </div>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em]">{item.client_name || "Private Client"}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="py-32 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-medium text-black mb-12 tracking-tight uppercase">Ready to tell your story?</h2>
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 h-20 rounded-full text-xs font-bold uppercase tracking-[0.4em] shadow-2xl shadow-blue-600/20"
            onClick={() => window.location.href = "/#contact"}
          >
            Get in Touch
          </Button>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white hover:text-blue-400 transition-colors z-[110]">
              <X className="w-12 h-12" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-7xl aspect-[4/5] md:aspect-auto md:h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Portfolio view"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-8 text-white hover:text-blue-400 transition-colors z-[110]"
            >
              <X className="w-12 h-12" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-7xl aspect-video bg-black"
            >
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
