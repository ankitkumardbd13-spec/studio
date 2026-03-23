"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useFirebaseApp } from '@/firebase/provider';
import { collection, query, orderBy, addDoc, deleteDoc, doc, serverTimestamp, getDocs, DocumentData } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { compressImage } from '@/lib/image-utils';
import { Loader2, Trash2, Upload, ImageIcon, Tag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  'Campus Views',
  'Fitter Lab',
  'Electrician Lab',
  'Computer Lab',
  'Tablet Distribution',
  'Events',
  'Other'
];

export default function GalleryPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = getStorage(useFirebaseApp());
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  
  useEffect(() => {
    fetchGallery();
  }, [firestore]);

  const fetchGallery = async () => {
    try {
      const q = query(collection(firestore, 'gallery'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      setImages(snapshot.docs.map((doc: DocumentData) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      toast({ title: "Error", description: "Failed to load gallery.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      toast({ title: "Compressing", description: "Optimizing image to 50KB..." });
      const base64Image = await compressImage(file, 50);
      
      toast({ title: "Uploading", description: `Saving to ${selectedCategory}...` });
      const storageRef = ref(storage, `gallery/${selectedCategory}/${Date.now()}_${file.name}`);
      await uploadString(storageRef, base64Image, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);
      
      const docRef = await addDoc(collection(firestore, 'gallery'), {
        url: downloadURL,
        category: selectedCategory,
        fileName: file.name,
        timestamp: serverTimestamp()
      });
      
      setImages(prev => [{ id: docRef.id, url: downloadURL, category: selectedCategory, fileName: file.name, timestamp: Date.now() }, ...prev]);
      toast({ title: "Success", description: "Image added to gallery." });
    } catch (err) {
      console.error(err);
      toast({ title: "Upload Failed", description: "Could not upload image.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(firestore, 'gallery', id));
      
      // Delete from Storage
      const imageRef = ref(storage, imageUrl); // Assuming imageUrl contains the full path
      await deleteObject(imageRef);

      setImages(prev => prev.filter(img => img.id !== id));
      toast({ title: "Deleted", description: "Image removed from gallery." });
    } catch (err) {
      console.error("Error deleting image:", err);
      toast({ title: "Error", description: "Could not delete image.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Campus Gallery</h1>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" /> SELECT CATEGORY
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 border-2 focus:ring-secondary">
                    <SelectValue placeholder="Select folder/category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> CHOOSE IMAGE
                </label>
                <div className="relative group">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleUpload} 
                    disabled={uploading}
                    className="h-12 border-2 border-dashed group-hover:border-secondary transition-colors cursor-pointer"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
                      <Loader2 className="w-5 h-5 animate-spin text-secondary mr-2" />
                      <span className="text-sm font-bold animate-pulse">Processing...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex w-48 h-32 border-2 border-dashed rounded-xl items-center justify-center bg-muted/30 text-muted-foreground text-center p-4">
              <p className="text-xs font-bold uppercase tracking-tighter">Photo will be saved in <br/><span className="text-secondary">{selectedCategory}</span></p>
            </div>
          </div>
        </CardContent>
      </div>

      {images.length === 0 ? (
         <Card><CardContent className="p-8 text-center text-muted-foreground">Gallery is empty.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(item => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden shadow-md border group">
              <img src={item.url} alt="Gallery" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-[10px] font-bold shadow-sm">
                  {item.category || 'Legacy'}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full h-12 w-12 shadow-2xl scale-75 group-hover:scale-100 transition-transform"
                  onClick={() => handleDelete(item.id, item.url)}
                >
                  <Trash2 className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
