"use client";

import { motion } from "framer-motion";
import { Camera, Video, Users, Heart, Sparkles, Calendar } from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Wedding Photography and Videography",
    description: "Traditional and cinematic coverage of your special day.",
  },
  {
    icon: Heart,
    title: "Candid Photography and Videography",
    description: "Natural, unposed moments filled with raw emotion and cinematic flair.",
  },
  {
    icon: Sparkles,
    title: "Pre-Wedding Shoots",
    description: "Creative and romantic sessions before you say 'I do'.",
  },
  {
    icon: Users,
    title: "Event Photography and Videography",
    description: "Complete coverage for birthdays, anniversaries, and all social celebrations.",
  },
  {
    icon: Video,
    title: "Corporate Photography and Videography",
    description: "Professional coverage for corporate events, seminars, and brand shoots.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-zinc-50">
      <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px] mb-2 md:mb-4">
              Our Services
            </h2>
            <h3 className="text-xl md:text-5xl font-black text-black mb-4 md:mb-6">
              What We Do Best
            </h3>
            <p className="text-zinc-600 max-w-2xl mx-auto text-xs md:text-base px-4">
              From intimate weddings to grand corporate events, we provide comprehensive photography and videography services tailored to your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-zinc-200 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 md:mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <service.icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h4 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h4>
                <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
      </div>
    </section>
  );
}
