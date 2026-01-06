"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Camera, ExternalLink, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";

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
      className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
      loop
      playsInline
      muted // Start muted to satisfy autoplay policies
    />
  );
}

const staticPortfolioItems = [
  {
    type: "photography",
    title: "Elegant Wedding",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000",
  },
  {
    type: "videography",
    title: "Cinematic Highlights",
    category: "Videography",
    image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000",
  },
  {
    type: "photography",
    title: "Candid Moments",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000",
  },
];

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

export function Portfolio() {
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
        } else {
          setItems(staticPortfolioItems.map(item => ({ ...item, client_name: "Private Client" })));
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        setItems(staticPortfolioItems.map(item => ({ ...item, client_name: "Private Client" })));
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
    <section id="portfolio" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-blue-600 font-bold uppercase tracking-[0.4em] text-xs mb-4">
              Our Collection
            </h2>
            <h3 className="text-5xl md:text-7xl font-medium text-black tracking-tight">
              Curated Stories.
            </h3>
          </motion.div>

          <div className="flex flex-col gap-6 w-full max-w-4xl">
            <div className="flex gap-2 bg-zinc-50 p-2 rounded-2xl border border-zinc-100 justify-center overflow-x-auto scrollbar-hide">
              {["all", "photography", "videography"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setMainFilter(f);
                    setSubFilter("all");
                  }}
                  className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
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
                className="flex gap-2 overflow-x-auto pb-2 justify-center scrollbar-hide"
              >
                <button
                  onClick={() => setSubFilter("all")}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    subFilter === "all" ? "bg-black text-white" : "bg-zinc-50 text-zinc-400 hover:text-black border border-zinc-100"
                  }`}
                >
                  All {mainFilter}
                </button>
                {subCategoriesMap[mainFilter === "photography" ? "Photography" : "Videography"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubFilter(sub)}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
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
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="px-4 md:px-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {filteredItems.slice(0, 8).map((item, idx) => (
                <motion.div
                  key={item.id || `${item.title}-${idx}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }}
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
                    <h4 className="text-2xl font-medium text-black uppercase tracking-tight">{item.title}</h4>
                    <p className="text-zinc-400 text-xs font-bold uppercase tracking-[0.3em]">{item.client_name || "Private Client"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-24 text-center">
          <Button
            size="lg"
            variant="ghost"
            className="text-black hover:text-blue-600 px-12 h-16 rounded-full text-xs font-bold uppercase tracking-[0.4em] group transition-all border border-zinc-200 hover:border-blue-600"
            onClick={() => window.location.href = "/portfolio"}
          >
            Explore Full Portfolio
            <ExternalLink className="ml-4 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

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
              className="absolute top-8 right-8 text-white hover:text-blue-400 transition-colors z-[110]"
            >
              <X className="w-10 h-10" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-[4/5] md:aspect-auto md:h-[85vh] bg-black overflow-hidden"
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
              className="absolute top-8 right-8 text-white hover:text-blue-400 transition-colors z-[110]"
            >
              <X className="w-10 h-10" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black overflow-hidden"
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
    </section>
  );
}
