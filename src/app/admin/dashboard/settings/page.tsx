"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useFirebaseApp } from '@/firebase/provider';
import { compressImage } from '@/lib/image-utils';
import { Loader2, Upload } from 'lucide-react';

export default function SiteSettings() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const firebaseApp = useFirebaseApp();
  const storage = getStorage(firebaseApp);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [settings, setSettings] = useState({
    logo: '',
    stamp: '',
    address: '',
    phone1: '',
    phone2: '',
    email: '',
    heroTitle: '',
    heroSub: '',
    heroPhoto: '',
    chairmanMsg: '',
    chairmanPhoto: '',
    principalMsg: '',
    principalPhoto: ''
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const docRef = doc(firestore, 'siteSettings', 'config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        toast({ title: "Error", description: "Failed to load site settings from database.", variant: "destructive" });
      } finally {
        setInitialLoading(false);
      }
    }
    loadSettings();
  }, [firestore, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast({ title: "Compressing Image", description: "Resizing image to < 50KB..." });
      // Use the utility to compress the image down to ~50KB
      const base64Image = await compressImage(file, 50);
      
      toast({ title: "Uploading Image", description: "Saving compressed image to storage..." });
      const storageRef = ref(storage, `siteSettings/${fieldName}_${Date.now()}`);
      await uploadString(storageRef, base64Image, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);
      
      setSettings(prev => ({ ...prev, [fieldName]: downloadURL }));
      toast({ title: "Success", description: "Image uploaded successfully." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Upload Failed", description: err.message || "Something went wrong.", variant: "destructive" });
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const docRef = doc(firestore, 'siteSettings', 'config');
      await setDoc(docRef, settings, { merge: true });
      toast({ title: "Settings Saved", description: "Your site configurations have been updated live." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Save Failed", description: err.message || "Could not save settings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Live Site Settings</h1>
        <Button onClick={saveSettings} disabled={loading} className="bg-secondary text-white font-bold h-11 px-8">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {loading ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Core Brand Assets</CardTitle>
            <CardDescription>Upload ITI Logo and Official Stamp (Auto-resized to ~50KB).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ITI Logo</Label>
              <div className="flex items-center gap-4">
                {settings.logo && <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain" />}
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Official ITI Stamp</Label>
              <div className="flex items-center gap-4">
                {settings.stamp && <img src={settings.stamp} alt="Stamp" className="w-16 h-16 object-contain" />}
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'stamp')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input name="address" value={settings.address} onChange={handleInputChange} />
            </div>
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label>Phone 1</Label>
                <Input name="phone1" value={settings.phone1} onChange={handleInputChange} />
              </div>
              <div className="space-y-2 flex-1">
                <Label>Phone 2</Label>
                <Input name="phone2" value={settings.phone2} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" value={settings.email} onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>

        {/* Hero Text */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Homepage Hero Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Background Photo</Label>
              <div className="flex items-center gap-4">
                {settings.heroPhoto && <img src={settings.heroPhoto} alt="Hero" className="w-32 h-16 object-cover rounded-md" />}
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroPhoto')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hero Title</Label>
              <Input name="heroTitle" value={settings.heroTitle} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label>Hero Subtitle</Label>
              <Input name="heroSub" value={settings.heroSub} onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Chairman's Desk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chairman Photo</Label>
              <div className="flex items-center gap-4">
                {settings.chairmanPhoto && <img src={settings.chairmanPhoto} alt="Chairman" className="w-16 h-16 object-cover rounded-md" />}
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'chairmanPhoto')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Chairman Message</Label>
              <Textarea name="chairmanMsg" value={settings.chairmanMsg} onChange={handleInputChange} className="h-32" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Principal's Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Principal Photo</Label>
              <div className="flex items-center gap-4">
                {settings.principalPhoto && <img src={settings.principalPhoto} alt="Principal" className="w-16 h-16 object-cover rounded-md" />}
                <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'principalPhoto')} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Principal Message</Label>
              <Textarea name="principalMsg" value={settings.principalMsg} onChange={handleInputChange} className="h-32" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
