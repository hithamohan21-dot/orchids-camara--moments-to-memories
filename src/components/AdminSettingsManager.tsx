"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Settings, Save, Loader2, Youtube, Globe, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function AdminSettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
      youtube_videos: [
        {
          id: "1",
          title: "Darshan's Tata Nexon - India's Best Nexon",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
      ],
      youtube_channel_url: "https://www.youtube.com/@camarazone",
      contact_phone: "9845374999",
      contact_email: "camaracrew@gmail.com",
      services: [
        "Wedding Photography",
        "Candid Photography",
        "Pre-Wedding Shoots",
        "Event Photography",
        "Corporate Shoots",
        "Wedding Videography",
        "Candid Videography",
        "Pre-Wedding Videography",
        "Event Videography",
        "Corporate Videography"
      ]
    });

    const [newService, setNewService] = useState("");
    const [newVideo, setNewVideo] = useState({ title: "", url: "" });

    const addVideo = () => {
      if (newVideo.title && newVideo.url) {
        setSettings({ 
          ...settings, 
          youtube_videos: [...settings.youtube_videos, { ...newVideo, id: Math.random().toString() }] 
        });
        setNewVideo({ title: "", url: "" });
      }
    };

    const removeVideo = (id: string) => {
      setSettings({ ...settings, youtube_videos: settings.youtube_videos.filter(v => v.id !== id) });
    };

    const addService = () => {
      if (newService && !settings.services.includes(newService)) {
        setSettings({ ...settings, services: [...settings.services, newService] });
        setNewService("");
      }
    };

    const removeService = (service: string) => {
      setSettings({ ...settings, services: settings.services.filter(s => s !== service) });
    };

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

      if (error) throw error;

      if (data) {
        const settingsMap: any = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });
        setSettings(prev => ({ ...prev, ...settingsMap }));
      }
    } catch (error: any) {
      toast.error("Failed to fetch settings: " + error.message);
    } finally {
      setLoading(false);
    }
  }

    async function handleSave() {
      try {
        setSaving(true);
        
        // Prepare updates for site_settings
        const updates = Object.entries(settings).map(([key, value]) => ({
          key,
          value,
          updated_at: new Date().toISOString()
        }));

        // Log the updates for debugging
        console.log("Saving settings:", updates);

        // Save each setting individually to be more robust and avoid bulk failure
        for (const update of updates) {
          const { error } = await supabase
            .from("site_settings")
            .upsert(update, { onConflict: 'key' });
          if (error) throw error;
        }

        // Also update the old key for backward compatibility if it's the first video
        if (settings.youtube_videos.length > 0) {
          await supabase
            .from("site_settings")
            .upsert({
              key: "youtube_video_url",
              value: settings.youtube_videos[0].url,
              updated_at: new Date().toISOString()
            }, { onConflict: 'key' });
        }

        toast.success("Settings saved successfully");
        await fetchSettings(); // Refresh from DB
      } catch (error: any) {
        console.error("Error saving settings:", error);
        toast.error("Failed to save settings: " + error.message);
      } finally {
        setSaving(false);
      }
    }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 shadow-sm">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Site Configuration</h3>
              <p className="text-zinc-500 text-sm">Update global settings and links for the website.</p>
            </div>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 px-8 h-12 rounded-xl font-bold shadow-lg shadow-blue-600/20"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <Youtube className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-black uppercase tracking-widest text-xs">YouTube & Services</h4>
              </div>
              
                <div className="space-y-6">
                  <div>
                    <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4 block">YouTube Videos</Label>
                    <div className="space-y-4 mb-6">
                      {settings.youtube_videos.map((video) => (
                        <div key={video.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100 group">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">{video.title}</p>
                            <p className="text-[10px] text-zinc-400 truncate">{video.url}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVideo(video.id)}
                            className="text-zinc-400 hover:text-red-600 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-zinc-100 rounded-2xl border border-zinc-200 space-y-3">
                      <Input
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        placeholder="Video Title"
                        className="rounded-xl border-zinc-200 h-10 bg-white"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={newVideo.url}
                          onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                          placeholder="Video URL"
                          className="rounded-xl border-zinc-200 h-10 bg-white flex-1"
                        />
                        <Button 
                          onClick={addVideo}
                          className="bg-blue-600 hover:bg-blue-700 rounded-xl h-10"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Channel URL</Label>
                    <Input
                      value={settings.youtube_channel_url}
                      onChange={(e) => setSettings({ ...settings, youtube_channel_url: e.target.value })}
                      className="rounded-xl border-zinc-200 h-12"
                    />
                  </div>

                <div className="pt-6 border-t border-zinc-100">
                  <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4 block">Manage Services</Label>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Add new service..."
                      className="rounded-xl border-zinc-200 h-12"
                    />
                    <Button 
                      onClick={addService}
                      className="bg-black hover:bg-zinc-800 rounded-xl h-12 px-6"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.services.map((service) => (
                      <div 
                        key={service}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg group"
                      >
                        <span className="text-xs font-medium">{service}</span>
                          <button 
                            onClick={() => removeService(service)}
                            className="text-zinc-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          <div className="space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-black uppercase tracking-widest text-xs">Contact Information</h4>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Contact Phone</Label>
                <Input
                  value={settings.contact_phone}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="rounded-xl border-zinc-200 h-12"
                />
              </div>
              <div>
                <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">Contact Email</Label>
                <Input
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="rounded-xl border-zinc-200 h-12"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
