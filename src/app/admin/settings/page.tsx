
"use client";

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Info, MapPin, Phone, Mail, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    principalMsg: 'Welcome to MPITI. We provide a disciplined environment for learning modern trades.',
    heroTitle: 'Maharana Pratap ITI',
    heroSub: 'Saharanpur, Uttar Pradesh - Following New DGT NCVT Syllabus for Skilled Excellence'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Updated",
        description: "Homepage and contact data has been refreshed.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="font-headline text-4xl text-slate-900 font-bold">Site Management</h1>
          <p className="text-muted-foreground">Manage homepage content and institute contact details</p>
        </header>

        <form onSubmit={handleSave}>
          <div className="flex justify-end mb-6">
            <Button type="submit" disabled={loading} className="gap-2 bg-primary">
              {loading ? "Saving..." : <><Save className="w-4 h-4"/> Save All Changes</>}
            </Button>
          </div>

          <Tabs defaultValue="contact" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-lg border shadow-sm">
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="homepage">Homepage Content</TabsTrigger>
              <TabsTrigger value="leadership">Leadership Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="contact">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary"/> Institute Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Office Address</Label>
                      <Textarea 
                        value={siteData.address} 
                        onChange={(e) => setSiteData({...siteData, address: e.target.value})}
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Primary Phone</Label>
                        <Input 
                          value={siteData.phone1} 
                          onChange={(e) => setSiteData({...siteData, phone1: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Phone</Label>
                        <Input 
                          value={siteData.phone2} 
                          onChange={(e) => setSiteData({...siteData, phone2: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input 
                      type="email" 
                      value={siteData.email} 
                      onChange={(e) => setSiteData({...siteData, email: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="homepage">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5 text-secondary"/> Hero Section Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Main Title</Label>
                    <Input 
                      value={siteData.heroTitle} 
                      onChange={(e) => setSiteData({...siteData, heroTitle: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subheading / Description</Label>
                    <Textarea 
                      value={siteData.heroSub} 
                      onChange={(e) => setSiteData({...siteData, heroSub: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leadership">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserCheck className="w-5 h-5 text-primary"/> Chairman's Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea 
                        className="min-h-[150px]"
                        value={siteData.chairmanMsg} 
                        onChange={(e) => setSiteData({...siteData, chairmanMsg: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserCheck className="w-5 h-5 text-secondary"/> Principal's Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea 
                        className="min-h-[150px]"
                        value={siteData.principalMsg} 
                        onChange={(e) => setSiteData({...siteData, principalMsg: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </main>
    </div>
  );
}
