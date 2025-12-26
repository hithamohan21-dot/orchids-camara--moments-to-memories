"use client";

import { motion } from "framer-motion";
import { Users, Shield, Award, MapPin } from "lucide-react";
import Image from "next/image";

const stats = [
  {
    icon: Users,
    label: "Professional Team",
    description: "Punctual and dedicated crew for every event.",
  },
  {
    icon: Shield,
    label: "Trusted Quality",
    description: "High-end photography and videography gear.",
  },
  {
    icon: Award,
    label: "Happy Clients",
    description: "60+ satisfied families and event organizers.",
  },
  {
    icon: MapPin,
    label: "Full Coverage",
    description: "Seamless wedding and event documentation.",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-blue-500 font-medium tracking-widest uppercase mb-4">
              About Camara Crew
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
              Capturing your most precious <span className="text-blue-400">moments</span> with precision.
            </h3>
            <p className="text-blue-100/60 text-lg mb-12 leading-relaxed">
              At CAMARA, we believe every event is a story waiting to be told. Based in Bengaluru, our professional team specializes in high-quality wedding and event coverage, ensuring that your memories are preserved in their most beautiful and emotional form.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{stat.label}</h4>
                    <p className="text-blue-100/40 text-sm leading-snug">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden group"
          >
            <Image
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000"
              alt="Camara Professional Gear"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                <div className="text-3xl font-bold text-white mb-1">5.0 ⭐</div>
                <div className="text-blue-100/60 text-sm tracking-wide uppercase">Google Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
