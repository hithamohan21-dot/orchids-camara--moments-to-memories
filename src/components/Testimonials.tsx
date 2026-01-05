"use client";

import { motion } from "framer-motion";
import { Star, Quote, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const staticTestimonials = [
  {
    review_text: "Very friendly staff and their work is awesome. They captured our wedding so beautifully.",
    author_name: "Sneha Reddy",
    role: "Wedding Photography",
    author_image_url: "https://i.pravatar.cc/150?u=sneha",
    rating: 5,
    photos: []
  },
  {
    review_text: "They captured every moment beautifully. Highly recommended for any event!",
    author_name: "Rahul Sharma",
    role: "Event Videography",
    author_image_url: "https://i.pravatar.cc/150?u=rahul",
    rating: 5,
    photos: []
  },
  {
    review_text: "The best photography team in Bengaluru! 32 years of experience really shows in their work.",
    author_name: "Vikram Singh",
    role: "Candid Photography",
    author_image_url: "https://i.pravatar.cc/150?u=vikram",
    rating: 5,
    photos: []
  }
];

export function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("is_approved", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const displayReviews = reviews.length > 0 ? reviews : staticTestimonials;

  return (
    <section id="reviews" className="py-24 bg-white relative overflow-hidden border-t border-zinc-100">
      <div className="container px-4 mb-16">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6 bg-zinc-100 border border-zinc-200 px-6 py-2 rounded-full"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </motion.div>
        
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Loved by <span className="text-blue-600">Our</span> Clients
          </h2>
          <p className="text-zinc-500 max-w-2xl">
            Read what our clients have to say about their experience with Camara Crew.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-8 overflow-hidden">
          <motion.div
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            className="flex gap-8 shrink-0"
          >
            {[...displayReviews, ...displayReviews, ...displayReviews].map((testimonial, index) => (
              <div
                key={index}
                className="w-[400px] p-8 rounded-[2rem] bg-zinc-50 border border-zinc-200 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <Quote className="w-10 h-10 text-blue-100" />
                    <div className="flex">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-600 text-lg leading-relaxed italic">
                    "{testimonial.review_text}"
                  </p>
                </div>

                {testimonial.photos && testimonial.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 h-20 overflow-hidden">
                    {testimonial.photos.slice(0, 3).map((photo: string, i: number) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                        <Image src={photo} alt="Review photo" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-6 border-t border-zinc-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-zinc-200">
                    {testimonial.author_image_url ? (
                      <img src={testimonial.author_image_url} alt={testimonial.author_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold uppercase">
                        {testimonial.author_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-black font-bold text-sm">{testimonial.author_name}</h4>
                    <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">{testimonial.role || "Verified Client"}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
        <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 hidden md:block" />
        <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 hidden md:block" />
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-zinc-100 text-zinc-500 text-sm font-medium border border-zinc-200">
          5.0 Average Rating on Google
        </div>
      </div>
    </section>
  );
}
