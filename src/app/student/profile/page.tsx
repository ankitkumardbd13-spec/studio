
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Phone, MapPin, GraduationCap, Save, ArrowLeft, CreditCard, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function StudentProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Rahul Kumar',
    father: 'Shri Suresh Kumar',
    trade: 'Electrician',
    session: '2023-25',
    year: '1st Year',
    mobile: '+91 98765 43210',
    aadhaar: '1234 5678 9012',
    category: 'OBC',
    dob: '2002-05-15',
    address: 'Near Delhi Road, Saharanpur, UP',
    photo: PlaceHolderImages.find(i => i.id === 'student-1')?.imageUrl
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
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
            <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="gap-2">
              {isEditing ? <><Save className="w-4 h-4"/> Save Profile</> : <><User className="w-4 h-4"/> Edit Profile</>}
            </Button>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left: Identity Card */}
            <Card className="md:col-span-1 border-none shadow-lg h-fit">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md mb-4">
                  <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                <Badge className="bg-primary/10 text-primary mt-2">{profile.trade} - {profile.session}</Badge>
                <div className="mt-6 w-full space-y-3 text-left">
                   <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <GraduationCap className="w-4 h-4" /> Roll: 2023/MP/ELEC/042
                   </div>
                   <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <CreditCard className="w-4 h-4" /> Aadhaar: {profile.aadhaar}
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: Details Form */}
            <Card className="md:col-span-2 border-none shadow-lg">
              <CardHeader>
                <CardTitle>Academic & Personal Details</CardTitle>
                <CardDescription>Verified information from your admission record</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={profile.name} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Father's Name</Label>
                    <Input value={profile.father} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input 
                      value={profile.mobile} 
                      onChange={e => setProfile({...profile, mobile: e.target.value})} 
                      readOnly={!isEditing} 
                      className={!isEditing ? "bg-muted/50" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <div className="relative">
                       <Input value={profile.dob} readOnly className="bg-muted/50 pl-9" />
                       <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Permanent Address</Label>
                  <div className="relative">
                    <Input 
                      value={profile.address} 
                      onChange={e => setProfile({...profile, address: e.target.value})} 
                      readOnly={!isEditing} 
                      className={!isEditing ? "bg-muted/50 pl-9" : "pl-9"}
                    />
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={profile.category} readOnly className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Input value={profile.year} readOnly className="bg-muted/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
