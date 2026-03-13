
"use client";

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Image as ImageIcon, MapPin, Plus, Trash2, UserCheck, LayoutGrid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Mock initial state for site data
  const [siteData, setSiteData] = useState({
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

  const [galleryImages, setGalleryImages] = useState([
    { id: 1, url: 'https://picsum.photos/seed/lab1/800/600', caption: 'Practical Lab' },
    { id: 2, url: 'https://picsum.photos/seed/class1/800/600', caption: 'Classroom Session' },
    { id: 3, url: 'https://picsum.photos/seed/equip1/800/600', caption: 'Workshop Tools' },
  ]);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  const handleAddGalleryImage = () => {
    if (!newImageUrl) return;
    setGalleryImages([...galleryImages, { id: Date.now(), url: newImageUrl, caption: newCaption }]);
    setNewImageUrl('');
    setNewCaption('');
    toast({ title: "Image Added", description: "The image has been added to the gallery preview." });
  };

  const handleRemoveGalleryImage = (id: number) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Updated",
        description: "All changes including messages, photos, and gallery have been saved.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="font-headline text-4xl text-slate-900 font-bold">Site Management</h1>
          <p className="text-muted-foreground">Manage content, photos, and leadership messages</p>
        </header>

        <form onSubmit={handleSave}>
          <div className="flex justify-end mb-6">
            <Button type="submit" disabled={loading} className="gap-2 bg-primary">
              {loading ? "Saving..." : <><Save className="w-4 h-4"/> Save All Changes</>}
            </Button>
          </div>

          <Tabs defaultValue="leadership" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-lg border shadow-sm">
              <TabsTrigger value="leadership">Leadership & Photos</TabsTrigger>
              <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="homepage">Hero Text</TabsTrigger>
            </TabsList>

            <TabsContent value="leadership">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Chairman */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-primary"/> Chairman</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Photo URL</Label>
                      <Input value={siteData.chairmanPhoto} onChange={(e) => setSiteData({...siteData, chairmanPhoto: e.target.value})} />
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
                      <Label>Photo URL</Label>
                      <Input value={siteData.principalPhoto} onChange={(e) => setSiteData({...siteData, principalPhoto: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea value={siteData.principalMsg} onChange={(e) => setSiteData({...siteData, principalMsg: e.target.value})} />
                    </div>
                  </CardContent>
                </Card>

                {/* Student Manager/Rep */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-blue-500"/> Student Rep</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Photo URL</Label>
                      <Input value={siteData.studentPhoto} onChange={(e) => setSiteData({...siteData, studentPhoto: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Message Content</Label>
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
                  <CardDescription>Add or remove photos from the main website gallery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4 p-4 border rounded-xl bg-slate-50">
                    <div className="space-y-2">
                      <Label>New Image URL</Label>
                      <Input placeholder="https://..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Caption</Label>
                      <Input placeholder="e.g. Electrician Lab" value={newCaption} onChange={(e) => setNewCaption(e.target.value)} />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={handleAddGalleryImage} className="w-full gap-2"><Plus className="w-4 h-4"/> Add to Gallery</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryImages.map((img) => (
                      <div key={img.id} className="relative group rounded-lg overflow-hidden border shadow-sm aspect-square bg-white">
                        <img src={img.url} alt={img.caption} className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                          <p className="text-[10px] text-white mb-2">{img.caption}</p>
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
                  <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Institute Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea value={siteData.address} onChange={(e) => setSiteData({...siteData, address: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Primary Phone</Label>
                        <Input value={siteData.phone1} onChange={(e) => setSiteData({...siteData, phone1: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={siteData.email} onChange={(e) => setSiteData({...siteData, email: e.target.value})} />
                      </div>
                    </div>
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
