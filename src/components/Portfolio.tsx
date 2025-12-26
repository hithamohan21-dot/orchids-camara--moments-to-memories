"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Play, Camera, ExternalLink } from "lucide-react";

const portfolioItems = [
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
  {
    type: "photography",
    title: "Pre-Wedding Shoot",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000",
  },
  {
    type: "videography",
    title: "Event Montage",
    category: "Videography",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000",
  },
  {
    type: "photography",
    title: "Grand Reception",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
  },
];

export function Portfolio() {
  const [filter, setFilter] = useState("all");

  const filteredItems = filter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.type === filter);

  return (
    <section id="portfolio" className="py-24 bg-black">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
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

          <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10">
            {["all", "photography", "videography"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer bg-neutral-900"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1.5 rounded-lg bg-blue-600/80 backdrop-blur-sm text-white">
                    {item.type === "videography" ? <Play className="w-3 h-3 fill-current" /> : <Camera className="w-3 h-3" />}
                  </span>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">{item.category}</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
                <div className="flex items-center text-blue-100/60 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  View Case Study <ExternalLink className="ml-2 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
