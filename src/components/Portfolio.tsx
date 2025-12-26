"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Camera, ExternalLink, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";

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

export function Portfolio() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
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
            category: item.type === 'image' ? 'Photography' : 'Videography',
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

  const filteredItems = filter === "all" 
    ? items 
    : items.filter(item => item.type === filter);

  const getEmbedUrl = (url: string, autoplay = true) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      return `https://www.youtube.com/embed/${id}${autoplay ? '?autoplay=1&mute=1' : ''}`;
    }
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}${autoplay ? '?autoplay=1&muted=1' : ''}`;
    }
    return null;
  };

  return (
    <section id="portfolio" className="py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-blue-500 font-medium tracking-widest uppercase mb-4">
              Portfolio
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white">
              Our Recent Work
            </h3>
          </motion.div>

          <div className="flex gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto justify-center scrollbar-hide">
            {["all", "photography", "videography"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 md:px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  filter === f 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-blue-100/40 hover:text-white"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
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
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer bg-neutral-900"
                  onMouseEnter={() => item.type === 'videography' && setHoveredVideo(item.id || item.title)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  onClick={() => {
                    if (item.type === 'videography' && item.videoUrl) {
                      setSelectedVideo(item.videoUrl);
                    }
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={`object-cover transition-all duration-700 group-hover:scale-110 ${hoveredVideo === (item.id || item.title) ? 'opacity-0' : 'opacity-70 group-hover:opacity-100'}`}
                  />
                  
                  {item.type === 'videography' && item.videoUrl && hoveredVideo === (item.id || item.title) && (
                    <div className="absolute inset-0 z-0">
                      {getEmbedUrl(item.videoUrl) ? (
                        <iframe
                          src={getEmbedUrl(item.videoUrl, true)!}
                          className="w-full h-full pointer-events-none scale-150"
                          allow="autoplay"
                        />
                      ) : (
                        <video
                          src={item.videoUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1.5 rounded-lg bg-blue-600/80 backdrop-blur-sm text-white">
                        {item.type === "videography" ? <Play className="w-3 h-3 fill-current" /> : <Camera className="w-3 h-3" />}
                      </span>
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{item.category}</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 h-14 rounded-full text-lg transition-all"
            onClick={() => window.location.href = "/portfolio"}
          >
            View Full Portfolio
            <ExternalLink className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
