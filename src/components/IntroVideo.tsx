"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function IntroVideo() {
  const [show, setShow] = useState(true);

    useEffect(() => {
      // Hide video after it plays or after a timeout
      const timer = setTimeout(() => {
        setShow(false);
      }, 8000); // 8 seconds intro
  
      return () => clearTimeout(timer);
    }, []);
  
    // Check if intro was already played in this session
    useEffect(() => {
      const played = sessionStorage.getItem("intro_played");
      if (played) {
        setShow(false);
      } else {
        sessionStorage.setItem("intro_played", "true");
      }
    }, []);

    return (
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full flex items-center justify-center"
            >
              <video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-contain"
                onEnded={() => setShow(false)}
              >
                <source src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/c44e58e5-b73d-46c4-8c54-3d20d5288039/intro-video.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
}
