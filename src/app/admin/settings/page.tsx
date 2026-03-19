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
import { useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/hooks/use-memo-firebase';

export default function AdminSettings() {
  const { toast } = useToast();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState<string | null>(null);

  const configDocQuery = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'siteSettings', 'config');
  }, [db]);

  const { data: remoteConfig, isLoading: configLoading } = useDoc(configDocQuery);

  const [siteData, setSiteData] = useState({
    logo: PlaceHolderImages.find(i => i.id === 'iti-logo')?.imageUrl || '',
    stamp: PlaceHolderImages.find(i => i.id === 'iti-stamp')?.imageUrl || '',
    address: 'Village Post Rankhandi, Deoband, Dist Saharanpur, UP, PIN 247554',
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
    heroSub: 'Rankhandi, Deoband, Saharanpur - Providing Excellence in Technical Skills Since 2015'
  });

  useEffect(() => {
    if (remoteConfig) {
      setSiteData(prev => ({ ...prev, ...remoteConfig }));
    }
  }, [remoteConfig]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof siteData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(field as string);
    try {
      const compressedBase64 = await compressImage(file, 50);
      setSiteData(prev => ({ ...prev, [field]: compressedBase64 }));
      toast({ title: "Image Uploaded", description: "Image compressed to ~50KB and updated locally." });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not process image." });
    } finally {
      setCompressing(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setLoading(true);

    try {
      const configRef = doc(db, 'siteSettings', 'config');
      await setDoc(configRef, siteData, { merge: true });
      toast({
        title: "Settings Saved Live",
        description: "Your updates are now persistent in the cloud.",
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (configLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Site Management</h1>
            <p className="text-muted-foreground">Manage cloud-hosted content and leadership photos</p>
          </div>
          <Button onClick={handleSave} disabled={loading} className="gap-2 bg-primary">
            {loading ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4"/>}
            Save to Cloud
          </Button>
        </header>

        <form onSubmit={handleSave}>
          <Tabs defaultValue="branding" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-lg border shadow-sm">
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
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
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} className="mt-2 text-sm" />
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
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'stamp')} className="mt-2 text-sm" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leadership">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm text-center">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-primary"/> Chairman</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4 p-4 bg-muted/20 rounded-xl border border-dashed border-primary/30">
                      {siteData.chairmanPhoto && (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img src={siteData.chairmanPhoto} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'chairmanPhoto')} className="mt-2 text-sm" />
                    </div>
                    <Textarea value={siteData.chairmanMsg} onChange={(e) => setSiteData({...siteData, chairmanMsg: e.target.value})} />
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm text-center">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-secondary"/> Principal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4 p-4 bg-muted/20 rounded-xl border border-dashed border-secondary/30">
                      {siteData.principalPhoto && (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img src={siteData.principalPhoto} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'principalPhoto')} className="mt-2 text-sm" />
                    </div>
                    <Textarea value={siteData.principalMsg} onChange={(e) => setSiteData({...siteData, principalMsg: e.target.value})} />
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm text-center">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-lg"><UserCheck className="w-5 h-5 text-blue-500"/> Alumni Rep</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center gap-4 p-4 bg-muted/20 rounded-xl border border-dashed border-blue-300">
                      {siteData.studentPhoto && (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img src={siteData.studentPhoto} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'studentPhoto')} className="mt-2 text-sm" />
                    </div>
                    <Textarea value={siteData.studentMsg} onChange={(e) => setSiteData({...siteData, studentMsg: e.target.value})} />
                  </CardContent>
                </Card>
              </div>
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
