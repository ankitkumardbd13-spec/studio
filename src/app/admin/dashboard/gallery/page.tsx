"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useFirebaseApp } from '@/firebase/provider';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { compressImage } from '@/lib/image-utils';
import { Loader2, Trash2, Upload } from 'lucide-react';

export default function GalleryPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = getStorage(useFirebaseApp());
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, [firestore]);

  const fetchGallery = async () => {
    try {
      const q = query(collection(firestore, 'gallery'));
      const snapshot = await getDocs(q);
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      toast({ title: "Processing Image", description: "Compressing image to < 50KB..." });
      const base64Image = await compressImage(file, 50);
      
      const storageRef = ref(storage, `gallery/img_${Date.now()}`);
      await uploadString(storageRef, base64Image, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);
      
      const docRef = await addDoc(collection(firestore, 'gallery'), {
        url: downloadURL,
        timestamp: Date.now()
      });
      
      setImages(prev => [{ id: docRef.id, url: downloadURL, timestamp: Date.now() }, ...prev]);
      toast({ title: "Success", description: "Image added to gallery." });
    } catch (err) {
      console.error(err);
      toast({ title: "Upload Failed", description: "Could not upload image.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'gallery', id));
      setImages(prev => prev.filter(img => img.id !== id));
      toast({ title: "Deleted", description: "Image removed from gallery." });
    } catch (err) {
      toast({ title: "Error", description: "Could not delete image.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Campus Gallery</h1>
        <div className="relative">
          <Button disabled={uploading} className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {images.length === 0 ? (
         <Card><CardContent className="p-8 text-center text-muted-foreground">Gallery is empty.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border shadow-sm">
              <img src={img.url} alt="Gallery" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="icon" onClick={() => handleDelete(img.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
