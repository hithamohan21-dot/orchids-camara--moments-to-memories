"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Camera, ArrowLeft, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

// Video component to handle play/pause on hover with sound
function VideoThumbnail({ src, isHovered }: { src: string; isHovered: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        // Unmute and play on hover
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {
          // Fallback to muted play if browser blocks audio
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
      className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 opacity-100' : 'opacity-50 group-hover:opacity-80'}`}
      loop
      playsInline
      muted // Start muted to satisfy autoplay policies
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
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center md:text-left"
            >
              <Button 
                variant="ghost" 
                className="mb-8 text-blue-600 hover:text-blue-700 -ml-4"
                onClick={() => window.location.href = "/"}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <h1 className="text-5xl md:text-7xl font-bold text-black mb-4 tracking-tighter">
                Full Portfolio
              </h1>
              <p className="text-zinc-500 text-lg max-w-xl mx-auto md:mx-0">
                A curated selection of our finest moments captured through the lens.
              </p>
            </motion.div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex gap-1.5 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 justify-center scrollbar-hide">
                {["all", "photography", "videography"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setMainFilter(f);
                      setSubFilter("all");
                    }}
                    className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                      mainFilter === f 
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30" 
                        : "text-zinc-500 hover:text-black"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {mainFilter !== "all" && (
                <div className="flex gap-2 overflow-x-auto pb-2 justify-center scrollbar-hide">
                  <button
                    onClick={() => setSubFilter("all")}
                    className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                      subFilter === "all" ? "bg-black text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                    }`}
                  >
                    All {mainFilter}
                  </button>
                  {subCategoriesMap[mainFilter === "photography" ? "Photography" : "Videography"].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSubFilter(sub)}
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                        subFilter === sub ? "bg-black text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                      }`}
                    >
                      {sub.replace(" Photography", "").replace(" Videography", "")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-40">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-40 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
              <p className="text-zinc-400 font-bold uppercase tracking-widest">No items found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                      <motion.div
                        key={item.id || item.title}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="group relative aspect-square rounded-[2.5rem] overflow-hidden cursor-pointer bg-zinc-100 border border-zinc-200 hover:border-blue-600 transition-all duration-500 shadow-2xl shadow-black/5"
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
                        {item.type === 'photography' ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0">
                            <VideoThumbnail 
                              src={item.videoUrl} 
                              isHovered={hoveredVideo === (item.id || item.title)} 
                            />
                            {hoveredVideo !== (item.id || item.title) && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                                  <Play className="w-8 h-8 text-white fill-current" />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity z-10" />
                      
                        <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                          <div className="flex items-center gap-3 mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-xl">
                              {item.type === "videography" ? <Play className="w-4 h-4 fill-current" /> : <Camera className="w-4 h-4" />}
                            </span>
                            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{item.sub_category}</span>
                          </div>
                          <h4 className="text-2xl font-black text-white mb-2 group-hover:text-blue-500 transition-colors duration-300 line-clamp-2">{item.title}</h4>
                        </div>
                      </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors z-[110]"
            >
              <X className="w-10 h-10" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-[4/5] md:aspect-auto md:h-[85vh] bg-black rounded-3xl overflow-hidden shadow-2xl"
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

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12"
          >
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors z-[110]"
            >
              <X className="w-10 h-10" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
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
