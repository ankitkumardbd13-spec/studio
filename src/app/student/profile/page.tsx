
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, MapPin, GraduationCap, ArrowLeft, CreditCard, Calendar, Lock, Save, Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { compressImage } from '@/lib/image-utils';

export default function StudentProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Rahul Kumar',
    father: 'Shri Suresh Kumar',
    trade: 'Electrician',
    session: '2023-25',
    year: '1st Year',
    mobile: '+91 98765 43210',
    aadhaar: '1234 5678 9012',
    rollNo: '2023/MP/ELEC/042',
    dob: '15-05-2002',
    address: 'Near Delhi Road, Saharanpur, UP',
    photo: PlaceHolderImages.find(i => i.id === 'student-1')?.imageUrl || ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_student_profile');
    if (saved) {
      setProfile(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedBase64 = await compressImage(file, 50);
      setProfile(prev => ({ ...prev, photo: compressedBase64 }));
      toast({ title: "Photo Updated", description: "Your profile photo has been updated and compressed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not process image." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Save to localStorage so it persists across pages (like ID Card)
    localStorage.setItem('mpiti_student_profile', JSON.stringify(profile));
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved and reflected on your ID Card.",
      });
    }, 800);
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <Button variant="ghost" asChild>
              <Link href="/student/dashboard" className="gap-2 text-muted-foreground">
                <ArrowLeft className="w-4 h-4"/> Back to Dashboard
              </Link>
            </Button>
            <Badge variant="outline" className="gap-2 border-primary/20 bg-primary/5 text-primary font-bold py-1.5 px-4">
              <Lock className="w-3 h-3" /> Core Identity Locked
            </Badge>
          </header>

          <form onSubmit={handleSave} className="grid md:grid-cols-3 gap-8">
            {/* Left: Identity Card Photo Section */}
            <Card className="md:col-span-1 border-none shadow-lg h-fit">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md mb-4 bg-muted">
                    {profile.photo ? (
                      <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-full h-full p-6 text-muted-foreground" />
                    )}
                  </div>
                  <Label 
                    htmlFor="photo-upload" 
                    className="absolute bottom-4 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-colors"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  </Label>
                  <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
                
                <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                <Badge className="bg-primary/10 text-primary mt-2">{profile.trade} - {profile.session}</Badge>
                
                <div className="mt-8 w-full space-y-4 text-left pt-6 border-t">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Roll Number</Label>
                    <Input 
                      value={profile.rollNo} 
                      onChange={e => setProfile({...profile, rollNo: e.target.value})} 
                      className="h-9 text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Trade / Course</Label>
                    <p className="text-sm font-bold bg-muted/50 p-2 rounded border">{profile.trade} (Locked)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Editable Details Form */}
            <Card className="md:col-span-2 border-none shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>My Profile Record</CardTitle>
                    <CardDescription>Update your personal and academic information below.</CardDescription>
                  </div>
                  <Button type="submit" disabled={loading} className="gap-2 bg-primary">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-500">Student Name (As per 10th)</Label>
                    <Input value={profile.name} readOnly className="bg-muted/50 font-bold opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500">Father's Name</Label>
                    <Input value={profile.father} readOnly className="bg-muted/50 font-bold opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500">Date of Birth (DD-MM-YYYY)</Label>
                    <div className="relative">
                       <Input 
                         value={profile.dob} 
                         onChange={e => setProfile({...profile, dob: e.target.value})}
                         className="pl-9 font-bold" 
                         placeholder="15-05-2002"
                       />
                       <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500">Mobile Number</Label>
                    <Input 
                      value={profile.mobile} 
                      onChange={e => setProfile({...profile, mobile: e.target.value})}
                      className="font-bold" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500">Aadhaar Card Number</Label>
                    <div className="relative">
                      <Input 
                        value={profile.aadhaar} 
                        onChange={e => setProfile({...profile, aadhaar: e.target.value})}
                        className="pl-9 font-bold"
                      />
                      <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500">Current Academic Year</Label>
                    <Select value={profile.year} onValueChange={v => setProfile({...profile, year: v})}>
                      <SelectTrigger className="font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year (प्रथम वर्ष)</SelectItem>
                        <SelectItem value="2nd Year">2nd Year (द्वितीय वर्ष)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-500">Permanent Address</Label>
                  <div className="relative">
                    <Input 
                      value={profile.address} 
                      onChange={e => setProfile({...profile, address: e.target.value})}
                      className="pl-9 font-bold"
                    />
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                  <GraduationCap className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Note:</strong> Name, Father's Name, Trade, and Session are verified fields. If there is an error in these details, please contact the ITI Admin office with valid certificates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </main>
  );
}
