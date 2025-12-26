"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function EventSpotlight() {
  return (
    <section className="py-24 bg-black">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-[3rem] overflow-hidden group shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070"
            alt="Beautiful Event"
            fill
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-blue-400 font-medium tracking-[0.3em] uppercase mb-4 block">Event Spotlight</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-2xl">
                Capturing the <span className="text-blue-500">Magic</span> of Every Celebration.
              </h2>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
