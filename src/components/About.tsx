"use client";

import { motion, useSpring, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { Users, Shield, Award, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [displayText, setDisplayText] = useState("0");

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  useMotionValueEvent(display, "change", (latest) => {
    setDisplayText(latest.toString());
  });

  return (
    <span ref={ref}>
      {displayText}
      {suffix}
    </span>
  );
}

const stats = [
  {
    icon: Users,
    label: "Professional Team",
    description: "Punctual and dedicated crew for every event.",
    value: 15,
    suffix: "+"
  },
  {
    icon: Shield,
    label: "Trusted Quality",
    description: "High-end photography and videography gear.",
    value: 100,
    suffix: "%"
  },
  {
    icon: Award,
    label: "Years Experience",
    description: "Providing excellence in photography since 1992.",
    value: 32,
    suffix: "+"
  },
  {
    icon: MapPin,
    label: "Full Coverage",
    description: "Seamless wedding and event documentation.",
    value: 500,
    suffix: "+"
  },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-blue-600 font-black tracking-[0.3em] uppercase text-[10px] mb-2 md:mb-4">
              About Camara Crew
            </h2>
            <h3 className="text-xl md:text-5xl font-black mb-6 md:mb-8 text-black leading-tight tracking-tighter">
              Capturing your most precious <span className="text-blue-600">moments</span> with precision.
            </h3>
            <p className="text-zinc-600 text-xs md:text-lg mb-8 md:mb-12 leading-relaxed">
              At CAMARA, we believe every event is a story waiting to be told. Based in Bengaluru, our professional team specializes in high-quality wedding and event coverage, ensuring that your memories are preserved in their most beautiful and emotional form.
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-8 mb-8 md:mb-12">
              <div className="p-4 md:p-8 rounded-2xl md:rounded-[2rem] bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center">
                <div className="text-2xl md:text-5xl font-black text-blue-600 mb-1 md:mb-2">
                  <Counter value={1000} suffix="+" />
                </div>
                <div className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Clients Worked</div>
              </div>
              <div className="p-4 md:p-8 rounded-2xl md:rounded-[2rem] bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center">
                <div className="text-2xl md:text-5xl font-black text-black mb-1 md:mb-2">
                  <Counter value={32} suffix="+" />
                </div>
                <div className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Years Experience</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-black font-bold mb-1">{stat.label}</h4>
                    <p className="text-zinc-500 text-sm leading-snug">{stat.description}</p>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/90 backdrop-blur-md border border-zinc-200 p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold text-black mb-1">5.0 ⭐</div>
                <div className="text-zinc-500 text-sm tracking-wide uppercase">Google Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
