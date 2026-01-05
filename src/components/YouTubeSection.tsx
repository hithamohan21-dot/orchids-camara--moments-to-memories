"use client";

import { motion } from "framer-motion";
import { Play, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function YouTubeSection() {
  const [videos, setVideos] = useState<any[]>([]);
  const [channelUrl, setChannelUrl] = useState("https://www.youtube.com/@camarazone");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchYouTubeData() {
      try {
          const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .in("key", ["youtube_videos", "youtube_channel_url", "youtube_video_url"]);

        if (error) throw error;

            if (data) {
            const videosRaw = data.find(item => item.key === "youtube_videos")?.value;
            const urlData = data.find(item => item.key === "youtube_channel_url")?.value;
            const oldVideoUrl = data.find(item => item.key === "youtube_video_url")?.value;
            
              if (Array.isArray(videosRaw) && videosRaw.length > 0) {
                setVideos(videosRaw);
              } else if (oldVideoUrl && typeof oldVideoUrl === 'string') {
                // Fallback for old single video format
                setVideos([{ id: "old-1", title: "Featured Highlights", url: oldVideoUrl }]);
              } else if (videosRaw && typeof videosRaw === 'object' && !Array.isArray(videosRaw)) {
                // Fallback if it was saved as a single object instead of array
                setVideos([videosRaw]);
              } else {
                // Final fallback to default video if nothing in DB
                setVideos([{
                  id: "default-1",
                  title: "Cinematic Wedding Highlights",
                  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                }]);
              }

            if (urlData) setChannelUrl(urlData);
          }
        } catch (error) {
          console.error("Error fetching YouTube data:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchYouTubeData();
    }, []);

    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const getYoutubeId = (url: string) => {
      if (!url) return null;
      const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const getYoutubeThumbnail = (url: string) => {
      const id = getYoutubeId(url);
      if (id) {
        return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
      }
      return "https://images.unsplash.com/photo-1611162617263-43c2660ad1fe?q=80&w=1000"; // Fallback
    };

    return (
      <section className="py-16 md:py-24 bg-white border-y border-zinc-100" id="videos">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 md:gap-8 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-blue-600 font-black tracking-[0.3em] uppercase text-[8px] md:text-[10px] mb-2 md:mb-4">
                Our Channel
              </h2>
              <h3 className="text-xl md:text-5xl font-black text-black tracking-tight">
                Cinematic Highlights
              </h3>
            </motion.div>
            <motion.a 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              href={channelUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-red-600 text-white px-6 md:px-8 h-10 md:h-12 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[10px] shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all hover:-translate-y-1"
            >
              Subscribe Now
              <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
            </motion.a>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-[2rem] md:rounded-[3rem] border border-zinc-100">
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">No videos featured yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {videos.map((video, idx) => {
                const videoId = getYoutubeId(video.url);
                const isSelected = selectedVideo === videoId;

                return (
                  <motion.div
                    key={video.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-black shadow-lg md:shadow-2xl border-2 md:border-4 border-white transition-all duration-500"
                  >
                    {isSelected && videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <button
                        onClick={() => setSelectedVideo(videoId)}
                        className="w-full h-full relative block"
                      >
                        <img 
                          src={getYoutubeThumbnail(video.url)} 
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 group-hover:bg-white group-hover:text-red-600 transition-all duration-500 shadow-2xl">
                            <Play className="w-5 h-5 md:w-8 md:h-8 fill-current translate-x-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                          <p className="text-white text-xs md:text-lg font-black line-clamp-1 group-hover:text-red-400 transition-colors text-left">{video.title}</p>
                        </div>
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
  );
}
