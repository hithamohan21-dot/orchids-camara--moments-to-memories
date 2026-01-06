"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Layout, Save, Loader2, Upload, Trash2, Video, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function AdminHeroManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    hero_background_url: "",
    hero_background_type: "video", // video or image
    hero_logo_video_url: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("key", ["hero_background_url", "hero_background_type", "hero_logo_video_url"]);

      if (error) throw error;

      if (data) {
        const settingsMap: any = {};
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });
        setSettings(prev => ({ ...prev, ...settingsMap }));
      }
    } catch (error: any) {
      toast.error("Failed to fetch hero settings: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'background' | 'logo') {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-uploads')
        .getPublicUrl(filePath);
      
      if (field === 'background') {
        const type = file.type.startsWith('video') ? 'video' : 'image';
        setSettings(prev => ({
          ...prev,
          hero_background_url: publicUrl,
          hero_background_type: type
        }));
      } else {
        setSettings(prev => ({
          ...prev,
          hero_logo_video_url: publicUrl
        }));
      }

      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      
      const updates = [
        { key: "hero_background_url", value: settings.hero_background_url, updated_at: new Date().toISOString() },
        { key: "hero_background_type", value: settings.hero_background_type, updated_at: new Date().toISOString() },
        { key: "hero_logo_video_url", value: settings.hero_logo_video_url, updated_at: new Date().toISOString() }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(update, { onConflict: 'key' });
        if (error) throw error;
      }

      toast.success("Hero settings saved successfully");
    } catch (error: any) {
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

    const isVideo = settings.hero_background_type === 'video';

    return (
      <div className="space-y-12">
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Hero Section</h3>
                <p className="text-zinc-500 text-sm">Manage your website's main entrance background.</p>
              </div>
            </div>
            
            <Button
              onClick={handleSave}
              disabled={saving || uploading}
              className="bg-blue-600 hover:bg-blue-700 px-8 h-12 rounded-xl font-bold shadow-lg shadow-blue-600/20"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest block">Background Media</Label>
                  <div className="flex p-1 bg-zinc-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, hero_background_type: 'image' }))}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${!isVideo ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-400'}`}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, hero_background_type: 'video' }))}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${isVideo ? 'bg-white text-blue-600 shadow-sm' : 'text-zinc-400'}`}
                    >
                      Video
                    </button>
                  </div>
                </div>
                <div 
                  className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 hover:bg-blue-50/50 transition-all"
                  onClick={() => document.getElementById('hero-upload')?.click()}
                >
                {settings.hero_background_url ? (
                  <>
                    {isVideo ? (
                      <video 
                        src={settings.hero_background_url} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        muted 
                        loop 
                      />
                    ) : (
                      <Image 
                        src={settings.hero_background_url} 
                        alt="Hero background" 
                        fill 
                        className="object-cover" 
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" className="rounded-xl h-10">
                        <Upload className="w-4 h-4 mr-2" />
                        Replace
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="rounded-xl h-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSettings({ ...settings, hero_background_url: "" });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-300 group-hover:text-blue-600 transition-colors">
                      {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-zinc-900">Click to upload media</p>
                      <p className="text-xs text-zinc-400 mt-1">MP4, MOV, JPG, PNG or WEBP</p>
                    </div>
                  </>
                )}
                  <input 
                    id="hero-upload" 
                    type="file" 
                    className="hidden" 
                    accept="video/*,image/*" 
                    onChange={(e) => handleFileUpload(e, 'background')}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div>
                <Label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4 block">Hero Logo Video (Center Logo)</Label>
                <div 
                  className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 hover:bg-blue-50/50 transition-all"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  {settings.hero_logo_video_url ? (
                    <>
                      <video 
                        src={settings.hero_logo_video_url} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        muted 
                        loop 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="secondary" className="rounded-xl h-10">
                          <Upload className="w-4 h-4 mr-2" />
                          Replace
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="rounded-xl h-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSettings({ ...settings, hero_logo_video_url: "" });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-300 group-hover:text-blue-600 transition-colors">
                        {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-zinc-900">Click to upload logo video</p>
                        <p className="text-xs text-zinc-400 mt-1">MP4 or MOV</p>
                      </div>
                    </>
                  )}
                  <input 
                    id="logo-upload" 
                    type="file" 
                    className="hidden" 
                    accept="video/*" 
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">

              <div className={`p-3 rounded-xl ${isVideo ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                {isVideo ? <Video className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
              </div>
              <div>
                <p className="font-bold text-sm">Media Type: {isVideo ? 'Video' : 'Image'}</p>
                <p className="text-xs text-zinc-500">Automatically detected from file</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2">Pro Tip</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                For the best experience, use a high-quality video (under 10MB) or a sharp image. 
                Vertical videos work great for mobile, but horizontal is better for desktop. 
                The background will automatically cover the entire screen.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl border border-zinc-200 space-y-4">
              <h4 className="font-bold">Preview Status</h4>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Live on Site</span>
                <span className={`px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-widest ${settings.hero_background_url ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                  {settings.hero_background_url ? 'Active' : 'Missing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
