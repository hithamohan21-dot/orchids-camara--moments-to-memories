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
      className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 opacity-100' : 'opacity-50 group-hover:opacity-80'}`}
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
              category: item.category,
              sub_category: item.sub_category,
              image: item.url,
              videoUrl: item.type === 'video' ? item.url : null,
              id: item.id
            })));
          } else {
            setItems(staticPortfolioItems);
          }
        } catch (error) {
          console.error("Error fetching portfolio:", error);
          setItems(staticPortfolioItems);
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

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const scrollContainer = scrollRef.current;
      if (!scrollContainer || loading) return;

      let animationFrameId: number;
      let scrollPos = 0;

      const scroll = () => {
        scrollPos += 0.5; // Very slow move
        if (scrollPos >= scrollContainer.scrollWidth / 2) {
          scrollPos = 0;
        }
        scrollContainer.scrollLeft = scrollPos;
        animationFrameId = requestAnimationFrame(scroll);
      };

      animationFrameId = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(animationFrameId);
    }, [loading, items, mainFilter, subFilter]);

  return (
    <section id="portfolio" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 md:gap-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px] mb-2 md:mb-4">
                Portfolio
              </h2>
              <h3 className="text-xl md:text-5xl font-black text-black">
                Our Recent Work
              </h3>
            </motion.div>

            <div className="flex flex-col gap-3 md:gap-4 w-full md:w-auto">
              <div className="flex gap-1.5 bg-zinc-100 p-1.5 rounded-xl md:rounded-2xl border border-zinc-200 justify-center scrollbar-hide overflow-x-auto">
                {["all", "photography", "videography"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setMainFilter(f);
                      setSubFilter("all");
                    }}
                    className={`px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                      mainFilter === f 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "text-zinc-500 hover:text-black"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {mainFilter !== "all" && (
                <div className="flex gap-1.5 overflow-x-auto pb-2 justify-center scrollbar-hide">
                  <button
                    onClick={() => setSubFilter("all")}
                    className={`px-3 py-1.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                      subFilter === "all" ? "bg-black text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                    }`}
                  >
                    All {mainFilter}
                  </button>
                  {subCategoriesMap[mainFilter === "photography" ? "Photography" : "Videography"].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSubFilter(sub)}
                      className={`px-3 py-1.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
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
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="relative group/slider">
              <div 
                ref={scrollRef}
                className="flex gap-4 md:gap-8 overflow-x-hidden pb-8 md:pb-12 pointer-events-auto"
                style={{ scrollBehavior: 'auto' }}
              >
                {[...filteredItems, ...filteredItems, ...filteredItems].map((item, idx) => (
                  <motion.div
                    key={item.id ? `${item.id}-${idx}` : `${item.title}-${idx}`}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % filteredItems.length) * 0.1 }}
                    className="flex-shrink-0 w-[240px] md:w-[450px] snap-center"
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
                    <div className="group relative aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-zinc-100 border border-zinc-200 hover:border-blue-600 transition-all duration-500 shadow-lg md:shadow-xl shadow-black/5">
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
                              <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30">
                                <Play className="w-4 h-4 md:w-6 md:h-6 text-white fill-current" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity z-10" />
                    
                      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 z-20">
                        <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                          <span className="p-1 md:p-1.5 rounded-lg bg-blue-600 text-white">
                            {item.type === "videography" ? <Play className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" /> : <Camera className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                          </span>
                          <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">{item.category}</span>
                        </div>
                        <h4 className="text-sm md:text-xl font-bold text-white mb-0.5 md:mb-1 truncate">{item.title}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Gradient Mask for Slider */}
              <div className="absolute top-0 bottom-12 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 hidden md:block" />
              <div className="absolute top-0 bottom-12 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden md:block" />
            </div>
          )}
  
          <div className="mt-8 md:mt-12 text-center">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 h-12 md:h-16 rounded-full text-sm md:text-lg group shadow-xl shadow-blue-600/20 font-black uppercase tracking-widest"
              onClick={() => window.location.href = "/portfolio"}
            >
              View Full Portfolio
              <ExternalLink className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
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
              className="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors z-[110]"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-[4/5] md:aspect-auto md:h-[80vh] bg-black rounded-2xl overflow-hidden shadow-2xl"
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
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
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
