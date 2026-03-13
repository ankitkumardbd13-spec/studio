
"use client";

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Image as ImageIcon, MapPin, Plus, Trash2, UserCheck, LayoutGrid, Upload, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { compressImage } from '@/lib/image-utils';

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState<string | null>(null);

  const [siteData, setSiteData] = useState({
    logo: PlaceHolderImages.find(i => i.id === 'iti-logo')?.imageUrl || '',
    stamp: PlaceHolderImages.find(i => i.id === 'iti-stamp')?.imageUrl || '',
    address: 'Near Delhi Road, Saharanpur, Uttar Pradesh - 247001',
    phone1: '+91 98765 43210',
    phone2: '+91 12345 67890',
    email: 'info@mpitisre.edu.in',
    chairmanMsg: 'Our mission is to empower the youth with skills that lead to sustainable employment.',
    chairmanPhoto: PlaceHolderImages.find(i => i.id === 'chairman')?.imageUrl || '',
    principalMsg: 'Welcome to MPITI. We provide a disciplined environment for learning modern trades.',
    principalPhoto: PlaceHolderImages.find(i => i.id === 'principal')?.imageUrl || '',
    studentMsg: 'MPITI transformed my career. The practical workshops are world-class.',
    studentPhoto: PlaceHolderImages.find(i => i.id === 'student-rep')?.imageUrl || '',
    heroTitle: 'Maharana Pratap ITI',
    heroSub: 'Saharanpur, Uttar Pradesh - Following New DGT NCVT Syllabus for Skilled Excellence'
  });

  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('mpiti_site_settings');
    if (savedData) {
      setSiteData(prev => ({ ...prev, ...JSON.parse(savedData) }));
    }
    const savedGallery = localStorage.getItem('mpiti_gallery');
    if (savedGallery) {
      setGalleryImages(JSON.parse(savedGallery));
    } else {
      setGalleryImages([
        { id: 1, url: 'https://picsum.photos/seed/lab1/800/600', caption: 'Practical Lab' },
        { id: 2, url: 'https://picsum.photos/seed/class1/800/600', caption: 'Classroom Session' },
        { id: 3, url: 'https://picsum.photos/seed/equip1/800/600', caption: 'Workshop Tools' },
      ]);
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof siteData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(field as string);
    try {
      const compressedBase64 = await compressImage(file, 50);
      setSiteData(prev => ({ ...prev, [field]: compressedBase64 }));
      toast({ title: "Image Uploaded", description: "Image compressed to ~50KB and updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not process image." });
    } finally {
      setCompressing(null);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing('gallery');
    try {
      const compressedBase64 = await compressImage(file, 50);
      const newImg = { id: Date.now(), url: compressedBase64, caption: 'New Campus Image' };
      setGalleryImages(prev => [...prev, newImg]);
      toast({ title: "Gallery Image Added", description: "New photo added and compressed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not process image." });
    } finally {
      setCompressing(null);
    }
  };

  const handleRemoveGalleryImage = (id: number) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('mpiti_site_settings', JSON.stringify(siteData));
    localStorage.setItem('mpiti_gallery', JSON.stringify(galleryImages));
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your updates are now live on the website.",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Site Management</h1>
            <p className="text-muted-foreground">Manage content, photos (Auto-resized to 50KB), and leadership</p>
          </div>
          <Button onClick={handleSave} disabled={loading} className="gap-2 bg-primary">
            {loading ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4"/>}
            Save All Changes
          </Button>
        </header>

        <form onSubmit={handleSave}>
          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-lg border shadow-sm">
              <TabsTrigger value="branding">Branding (Logo/Stamp)</TabsTrigger>
              <TabsTrigger value="leadership">Leadership & Photos</TabsTrigger>
              <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="homepage">Hero Text</TabsTrigger>
            </TabsList>

            <TabsContent value="branding">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><ImageIcon className="w-5 h-5 text-primary"/> Official Logo</CardTitle>
                    <CardDescription>Shown in Navbar, Footer and ID Card Header.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4 p-4 bg-muted/50 rounded-xl border">
                      {siteData.logo && (
                        <img src={siteData.logo} alt="Logo Preview" className="h-24 w-24 object-contain" />
                      )}
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                      {compressing === 'logo' && <p className="text-xs text-primary animate-pulse">Processing logo...</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5 text-secondary"/> Official Stamp</CardTitle>
                    <CardDescription>Shown at the bottom of the Student ID Card.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4 p-4 bg-muted/50 rounded-xl border">
                      {siteData.stamp && (
                        <img src={siteData.stamp} alt="Stamp Preview" className="h-24 w-24 object-contain rounded-full bg-white border p-1" />
                      )}
                      <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'stamp')} />
                      {compressing === 'stamp' && <p className="text-xs text-primary animate-pulse">Processing stamp...</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leadership">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Chairman */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-primary"/> Chairman</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Photo (Circular Shape)</Label>
                      <div className="flex flex-col items-center gap-4 p-4 bg-muted/20 rounded-xl border border-dashed border-primary/30">
                        {siteData.chairmanPhoto && (
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <img src={siteData.chairmanPhoto} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'chairmanPhoto')} />
                        {compressing === 'chairmanPhoto' && <p className="text-xs text-primary animate-pulse">Compressing...</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea value={siteData.chairmanMsg} onChange={(e) => setSiteData({...siteData, chairmanMsg: e.target.value})} />
                    </div>
                  </CardContent>
                </Card>

                {/* Principal */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-secondary"/> Principal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Photo (Circular Shape)</Label>
                      <div className="flex flex-col items-center gap-4 p-4 bg-muted/20 rounded-xl border border-dashed border-secondary/30">
                        {siteData.principalPhoto && (
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <img src={siteData.principalPhoto} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'principalPhoto')} />
                        {compressing === 'principalPhoto' && <p className="text-xs text-primary animate-pulse">Compressing...</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea value={siteData.principalMsg} onChange={(e) => setSiteData({...siteData, principalMsg: e.target.value})} />
                    </div>
                  </CardContent>
                </Card>

                {/* Alumni/Student Success */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-blue-500"/> Alumni Rep</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Photo (Circular Shape)</Label>
                      <div className="flex flex-col items-center gap-4 p-4 bg-muted/20 rounded-xl border border-dashed border-blue-300">
                        {siteData.studentPhoto && (
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                            <img src={siteData.studentPhoto} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'studentPhoto')} />
                        {compressing === 'studentPhoto' && <p className="text-xs text-primary animate-pulse">Compressing...</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Success Story Message</Label>
                      <Textarea value={siteData.studentMsg} onChange={(e) => setSiteData({...siteData, studentMsg: e.target.value})} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gallery">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-primary"/> Manage Homepage Gallery</CardTitle>
                  <CardDescription>Upload workshop and campus photos from your PC.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-8 border-2 border-dashed rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                    <p className="mb-4 text-sm text-muted-foreground">Select a local photo to add to the gallery.<br/>The system will automatically resize it to ~50KB.</p>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      className="max-w-xs" 
                      onChange={handleGalleryUpload} 
                      disabled={!!compressing}
                    />
                    {compressing === 'gallery' && <p className="mt-2 text-primary animate-pulse font-bold">Resizing & Compressing...</p>}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryImages.map((img) => (
                      <div key={img.id} className="relative group rounded-lg overflow-hidden border shadow-sm aspect-square bg-white">
                        <img src={img.url} alt={img.caption} className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRemoveGalleryImage(img.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Institute Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Address</Label>
                      <Textarea value={siteData.address} onChange={(e) => setSiteData({...siteData, address: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Primary Mobile</Label>
                        <Input value={siteData.phone1} onChange={(e) => setSiteData({...siteData, phone1: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary/Office Phone</Label>
                        <Input value={siteData.phone2} onChange={(e) => setSiteData({...siteData, phone2: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Official Email</Label>
                        <Input value={siteData.email} onChange={(e) => setSiteData({...siteData, email: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="homepage">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Hero Section Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Main Title (Big Text)</Label>
                    <Input value={siteData.heroTitle} onChange={(e) => setSiteData({...siteData, heroTitle: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sub-heading (Smaller Text)</Label>
                    <Textarea value={siteData.heroSub} onChange={(e) => setSiteData({...siteData, heroSub: e.target.value})} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </main>
    </div>
  );
}
