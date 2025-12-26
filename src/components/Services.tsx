"use client";

import { motion } from "framer-motion";
import { Camera, Video, Users, Heart, Sparkles, Calendar } from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Wedding Photography",
    description: "Traditional and artistic coverage of your big day.",
  },
  {
    icon: Video,
    title: "Wedding Videography",
    description: "Cinematic films that tell your love story.",
  },
  {
    icon: Heart,
    title: "Candid Photography",
    description: "Natural, unposed moments filled with raw emotion.",
  },
  {
    icon: Sparkles,
    title: "Pre-Wedding Shoots",
    description: "Creative and romantic sessions before you say 'I do'.",
  },
  {
    icon: Users,
    title: "Event Photography",
    description: "Complete coverage for birthdays, anniversaries, and more.",
  },
  {
    icon: Calendar,
    title: "Event Videography",
    description: "Highlight reels and full event documentation.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-neutral-950">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-blue-500 font-medium tracking-widest uppercase mb-4">
            Our Services
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What We Do Best
          </h3>
          <p className="text-blue-100/40 max-w-2xl mx-auto">
            From intimate weddings to grand celebrations, we provide comprehensive photography and videography services tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <service.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {service.title}
              </h4>
              <p className="text-blue-100/40 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
