"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Very friendly staff and their work is awesome.",
    author: "Sneha Reddy",
    role: "Wedding Client",
  },
  {
    quote: "They captured every moment beautifully. Highly recommended!",
    author: "Rahul Sharma",
    role: "Event Client",
  },
  {
    quote: "Highly professional and punctual team. Exceptional quality.",
    author: "Priya Das",
    role: "Corporate Client",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="container px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
              <span className="text-sm font-medium text-blue-100">
                5.0 Rating
              </span>
          </motion.div>
          
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by <span className="text-blue-400">Our</span> Happy Clients
            </h2>
          <p className="text-blue-100/40 max-w-2xl">
            See what our clients have to say about their experience with Camara Crew.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors group"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />
              <p className="text-lg text-blue-50/80 mb-8 italic relative z-10">
                "{testimonial.quote}"
              </p>
              <div>
                <h4 className="text-white font-bold tracking-wide">{testimonial.author}</h4>
                <p className="text-blue-400/60 text-sm tracking-widest uppercase">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-blue-100/40 text-sm">
            Verified Reviews from Google
          </div>
          <button 
            onClick={() => window.open("https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID", "_blank")}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Leave a Review
            <Star className="w-4 h-4 fill-current" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
