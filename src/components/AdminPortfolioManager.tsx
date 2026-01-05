"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2, Plus, Loader2, Image as ImageIcon, Video, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  sub_category: string;
}

const mainCategories = ["Photography", "Videography"];

const subCategoriesMap: Record<string, string[]> = {
  "Photography": [
    "Wedding Photography",
    "Candid Photography",
    "Pre-Wedding Photography",
    "Event Photography",
    "Corporate Photography"
  ],
  "Videography": [
    "Wedding Videography",
    "Candid Videography",
    "Pre-Wedding Videography",
    "Event Videography",
    "Corporate Videography"
  ]
};

export function AdminPortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    type: "image" as "image" | "video",
    category: mainCategories[0],
    sub_category: subCategoriesMap[mainCategories[0]][0]
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

    if (!file) {
      toast.error(`Please select ${newItem.type === 'image' ? 'an image' : 'a video'} file`);
      return;
    }

    try {
      setUploading(true);
      
      let finalUrl = "";

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
          category: newItem.category,
          sub_category: newItem.sub_category
        }]);

      if (dbError) throw dbError;

      toast.success("Item added successfully");
      setNewItem({ 
        title: "", 
        description: "", 
        type: "image", 
        category: mainCategories[0],
        sub_category: subCategoriesMap[mainCategories[0]][0]
      });
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
    <div className="space-y-12">
      <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold">Add New Work</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">Project Title</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Ex: Sharma Wedding Highlights"
                  className="rounded-xl border-zinc-200 focus:ring-blue-600 h-12"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">Main Category</Label>
                  <select
                    value={newItem.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setNewItem({ 
                        ...newItem, 
                        category: cat,
                        sub_category: subCategoriesMap[cat][0]
                      });
                    }}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {mainCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">Sub Category</Label>
                  <select
                    value={newItem.sub_category}
                    onChange={(e) => setNewItem({ ...newItem, sub_category: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {subCategoriesMap[newItem.category].map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">Media Type</Label>
              <div className="flex p-1 bg-zinc-100 rounded-xl w-full relative h-12">
                <button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, type: 'image' })}
                  className={cn(
                    "flex-1 flex items-center justify-center rounded-lg text-sm font-bold z-10 transition-all",
                    newItem.type === 'image' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  <ImageIcon className="mr-2 h-4 w-4" /> Photo
                </button>
                <button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, type: 'video' })}
                  className={cn(
                    "flex-1 flex items-center justify-center rounded-lg text-sm font-bold z-10 transition-all",
                    newItem.type === 'video' ? "bg-white text-blue-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
                  )}
                >
                  <Video className="mr-2 h-4 w-4" /> Video
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">
                {newItem.type === 'image' ? 'Upload Photo' : 'Upload Video'}
              </Label>
              <div 
                className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer group"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept={newItem.type === 'image' ? "image/*" : "video/*"}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="text-center">
                    <p className="text-black font-bold">{file.name}</p>
                    <p className="text-blue-600 text-xs mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="h-8 w-8 text-zinc-300 group-hover:text-blue-600" />
                    </div>
                    <p className="text-zinc-400 text-sm font-medium">
                      Select {newItem.type} file to upload
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-xl text-lg font-bold shadow-xl shadow-blue-600/20"
              disabled={uploading || !file || !newItem.title}
              onClick={handleUpload}
            >
              {uploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Confirm & Upload"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Recent Portfolio</h3>
          <span className="px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-500 text-xs font-bold uppercase tracking-widest">
            {items.length} Total Items
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white border border-zinc-200 rounded-[2rem]">
            <AlertCircle className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
            <p className="text-zinc-400 font-medium">Your portfolio is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
                <div key={item.id} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-500">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0">
                      <video 
                        src={item.url}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                        <Video className="h-12 w-12 text-white/50" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex justify-between items-end gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest mb-1 inline-block">{item.category}</span>
                        <h4 className="text-white font-bold truncate text-base">{item.title}</h4>
                      </div>
                      
                      {deleteId === item.id ? (
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDelete(item.id, item.url)}
                            className="text-[10px] h-7 font-bold uppercase"
                          >
                            Yes
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setDeleteId(null)}
                            className="text-[10px] h-7 font-bold uppercase"
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="rounded-xl h-10 w-10 shrink-0 shadow-lg"
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
