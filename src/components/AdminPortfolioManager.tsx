"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2, Plus, Loader2, Image as ImageIcon, Video, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
}

export function AdminPortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
    const [newItem, setNewItem] = useState({
      title: "",
      description: "",
      type: "image" as "image" | "video",
      externalUrl: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch portfolio items: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!newItem.title) {
      toast.error("Please provide a title");
      return;
    }

    if (newItem.type === 'video' && !newItem.externalUrl && !file) {
      toast.error("Please provide a video file or a YouTube/Vimeo URL");
      return;
    }

    if (newItem.type === 'image' && !file) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      
      let finalUrl = newItem.externalUrl;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `portfolio/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);
        
        finalUrl = publicUrl;
      }

      const { error: dbError } = await supabase
        .from('portfolio')
        .insert([{
          title: newItem.title,
          description: newItem.description,
          type: newItem.type,
          url: finalUrl,
        }]);

      if (dbError) throw dbError;

      toast.success("Item added successfully");
      setNewItem({ title: "", description: "", type: "image", externalUrl: "" });
      setFile(null);
      fetchItems();
    } catch (error: any) {
      toast.error("Operation failed: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, url: string) {
    try {
      // Try to delete from storage if it's a Supabase URL
      if (url.includes('supabase.co')) {
        const path = url.split('/').pop();
        if (path) {
          await supabase.storage.from('portfolio').remove([`portfolio/${path}`]);
        }
      }

      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Item deleted");
      setDeleteId(null);
      fetchItems();
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Add New Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-blue-100/60">Title</Label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Ex: Wedding Highlights"
                className="bg-black/50 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-blue-100/60">Type</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  variant={newItem.type === 'image' ? 'default' : 'outline'}
                  onClick={() => setNewItem({ ...newItem, type: 'image', externalUrl: "" })}
                  className="flex-1"
                >
                  <ImageIcon className="mr-2 h-4 w-4" /> Photo
                </Button>
                <Button
                  type="button"
                  variant={newItem.type === 'video' ? 'default' : 'outline'}
                  onClick={() => setNewItem({ ...newItem, type: 'video' })}
                  className="flex-1"
                >
                  <Video className="mr-2 h-4 w-4" /> Video
                </Button>
              </div>
            </div>
            {newItem.type === 'video' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Label className="text-blue-100/60">Video URL (YouTube/Vimeo)</Label>
                <Input
                  value={newItem.externalUrl}
                  onChange={(e) => setNewItem({ ...newItem, externalUrl: e.target.value, description: "External Video" })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="bg-black/50 border-white/10 text-white mt-2"
                />
                <p className="text-xs text-blue-100/20 mt-2">Or upload a video file below</p>
              </motion.div>
            )}
          </div>
          <div className="space-y-4">
            <Label className="text-blue-100/60">Upload {newItem.type === 'image' ? 'Photo' : 'Video File'}</Label>
            <div 
              className={`border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 transition-colors cursor-pointer bg-black/20 ${newItem.externalUrl ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => !newItem.externalUrl && document.getElementById('file-upload')?.click()}
            >
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept={newItem.type === 'image' ? "image/*" : "video/*"}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file ? (
                <div className="text-center">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-blue-400 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              ) : (
                <>
                  <Plus className="h-10 w-10 text-blue-500/50" />
                  <p className="text-blue-100/40 text-sm">
                    {newItem.externalUrl ? 'Video URL provided' : `Click to select ${newItem.type}`}
                  </p>
                </>
              )}
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
              disabled={uploading || (!file && !newItem.externalUrl) || !newItem.title}
              onClick={handleUpload}
            >
              {uploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save to Portfolio"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white">Current Portfolio</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl">
            <AlertCircle className="h-12 w-12 text-blue-100/20 mx-auto mb-4" />
            <p className="text-blue-100/40">No items in your portfolio yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
                {item.type === 'image' || (!item.url.includes('youtube') && !item.url.includes('vimeo')) ? (
                  <Image
                    src={item.url.includes('youtube') ? `https://img.youtube.com/vi/${item.url.includes('v=') ? item.url.split('v=')[1].split('&')[0] : item.url.split('/').pop()}/maxresdefault.jpg` : item.url}
                    alt={item.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-900/20">
                    <Video className="h-12 w-12 text-blue-500/50" />
                    {item.url.includes('youtube') || item.url.includes('vimeo') ? (
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-tighter text-blue-400/60 font-bold">External Link</span>
                    ) : null}
                  </div>
                )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex justify-between items-end gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold truncate text-lg">{item.title}</h4>
                        <p className="text-blue-400 text-xs uppercase tracking-widest font-semibold">{item.type}</p>
                      </div>
                      
                      {deleteId === item.id ? (
                        <div className="flex gap-2">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(item.id, item.url)}
                            className="text-xs h-8 px-2"
                          >
                            Confirm
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeleteId(null)}
                            className="text-xs h-8 px-2 text-white/40 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="rounded-xl h-10 w-10 shrink-0 md:opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
