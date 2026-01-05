"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2, Plus, Loader2, Star, User, MessageSquare, Check, X, Camera } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Review {
  id: string;
  author_name: string;
  author_image_url: string;
  review_text: string;
  rating: number;
  is_approved: boolean;
  photos: string[];
  created_at: string;
}

export function AdminReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newReview, setNewReview] = useState({
    author_name: "",
    author_image_url: "",
    review_text: "",
    rating: 5,
    photos: [] as string[]
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch reviews: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddReview() {
    if (!newReview.author_name || !newReview.review_text) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setAdding(true);
      setUploading(true);
      
      let author_image_url = "";
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `reviews/avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-uploads')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-uploads')
          .getPublicUrl(filePath);
        
        author_image_url = publicUrl;
      }

      let photoUrls: string[] = [];
      if (galleryFiles && galleryFiles.length > 0) {
        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `reviews/gallery/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('project-uploads')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('project-uploads')
            .getPublicUrl(filePath);
          
          photoUrls.push(publicUrl);
        }
      }

      const { error } = await supabase
        .from("reviews")
        .insert([{
          ...newReview,
          author_image_url,
          photos: photoUrls
        }]);

      if (error) throw error;

      toast.success("Review added successfully");
      setNewReview({ author_name: "", author_image_url: "", review_text: "", rating: 5, photos: [] });
      setAvatarFile(null);
      setGalleryFiles(null);
      fetchReviews();
    } catch (error: any) {
      toast.error("Failed to add review: " + error.message);
    } finally {
      setAdding(false);
      setUploading(false);
    }
  }

  async function handleDeleteReview(id: string) {
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Review deleted");
      fetchReviews();
    } catch (error: any) {
      toast.error("Failed to delete review: " + error.message);
    }
  }

  async function toggleApproval(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_approved: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      fetchReviews();
    } catch (error: any) {
      toast.error("Update failed: " + error.message);
    }
  }

  return (
    <div className="space-y-12">
      <div className="bg-white border border-zinc-200 rounded-[2rem] p-10 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold">Add Manual Review</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">Client Name</Label>
                <Input
                  value={newReview.author_name}
                  onChange={(e) => setNewReview({ ...newReview, author_name: e.target.value })}
                  placeholder="Ex: John Doe"
                  className="rounded-xl border-zinc-200 h-12"
                />
              </div>
              <div 
                className="w-12 h-12 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center cursor-pointer hover:border-blue-600 group"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                />
                {avatarFile ? (
                   <Image 
                    src={URL.createObjectURL(avatarFile)} 
                    alt="Avatar" 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-cover rounded-lg"
                   />
                ) : <Camera className="w-5 h-5 text-zinc-300 group-hover:text-blue-600" />}
              </div>
            </div>

              <div>
                <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">Rating (1-5)</Label>
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNewReview({ ...newReview, rating: num })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        newReview.rating >= num ? "bg-yellow-400 text-white" : "bg-zinc-100 text-zinc-300"
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>

                <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">Gallery Photos (Optional)</Label>
                <div 
                  className="border-2 border-dashed border-zinc-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer group"
                  onClick={() => document.getElementById('review-photos')?.click()}
                >
                  <input
                    id="review-photos"
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setGalleryFiles(e.target.files)}
                  />
                  <Plus className="w-6 h-6 text-zinc-300 group-hover:text-blue-600" />
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    {galleryFiles ? `${galleryFiles.length} Photos Selected` : "Add Gallery Photos"}
                  </p>
                </div>
              </div>
            </div>

          <div className="space-y-6">
            <div>
              <Label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 block">Review Text</Label>
              <textarea
                value={newReview.review_text}
                onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                placeholder="Write the client's testimonial here..."
                className="w-full h-32 rounded-xl border border-zinc-200 p-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 rounded-xl text-lg font-bold shadow-xl shadow-blue-600/20"
              disabled={adding || !newReview.author_name || !newReview.review_text}
              onClick={handleAddReview}
            >
              {adding ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Publish Review"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-bold">Managed Reviews</h3>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start justify-between hover:shadow-xl transition-all duration-300">
                <div className="flex gap-6 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 overflow-hidden flex-shrink-0">
                    {review.author_image_url ? (
                      <Image 
                        src={review.author_image_url} 
                        alt={review.author_name} 
                        width={64} 
                        height={64} 
                        className="w-full h-full object-cover"
                      />
                    ) : <User className="w-8 h-8" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold">{review.author_name}</h4>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-500 leading-relaxed max-w-2xl italic">"{review.review_text}"</p>
                    
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {review.photos.map((photo, i) => (
                          <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-100">
                            <Image src={photo} alt="Review" width={48} height={48} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button
                    variant="ghost"
                    onClick={() => toggleApproval(review.id, review.is_approved)}
                    className={`flex-1 md:flex-none rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] ${
                      review.is_approved 
                        ? "bg-green-50 text-green-600 hover:bg-green-100" 
                        : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                    }`}
                  >
                    {review.is_approved ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                    {review.is_approved ? "Approved" : "Hidden"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteReview(review.id)}
                    className="rounded-xl h-12 w-12 shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
