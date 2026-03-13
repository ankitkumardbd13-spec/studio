
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Send, GraduationCap, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function AdmissionPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Inquiry Submitted!",
        description: "Our admission counselor will contact you on your WhatsApp/Mobile shortly.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-2xl">
            <CardHeader className="bg-secondary text-white rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl">Admission Inquiry 2024-25</CardTitle>
                  <CardDescription className="text-white/80 font-medium">Interested in joining MPITI? Fill this inquiry form.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal & Contact */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b pb-2 text-primary flex items-center gap-2"><Phone className="w-5 h-5"/> Personal & Contact Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="candidateName">Candidate's Full Name</Label>
                      <Input id="candidateName" placeholder="Enter full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Father's Name</Label>
                      <Input id="parentName" placeholder="Enter father's name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Personal Mobile Number</Label>
                      <Input id="mobile" type="tel" placeholder="+91" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input id="whatsapp" type="tel" placeholder="+91" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherMobile">Father's Mobile Number</Label>
                      <Input id="fatherMobile" type="tel" placeholder="+91" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Trade Interested In</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Trade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electrician">Electrician (2 Years)</SelectItem>
                          <SelectItem value="fitter">Fitter (2 Years)</SelectItem>
                          <SelectItem value="hsi">HSI (Health Sanitary Inspector - 1 Year)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b pb-2 text-primary flex items-center gap-2"><MapPin className="w-5 h-5"/> Address Information</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="state">State Name</Label>
                      <Input id="state" placeholder="e.g. Uttar Pradesh" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tehsil">Tehsil Name</Label>
                      <Input id="tehsil" placeholder="Enter Tehsil" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postOffice">Post Office Name</Label>
                      <Input id="postOffice" placeholder="Enter Post Office" required />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="city">City / Village / Full Address</Label>
                      <Input id="city" placeholder="Complete address detail" required />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white gap-2">
                    {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5" /> Submit Admission Inquiry</>}
                  </Button>
                </div>
                
                <div className="mt-8 p-4 bg-accent/30 rounded-lg flex items-start gap-4">
                  <GraduationCap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-sm">
                    <p className="font-bold text-primary">Already a student?</p>
                    <p className="text-muted-foreground">If you are already admitted to MPITI and want to register for the student portal, please use the <Link href="/signup" className="text-secondary underline font-bold">Portal Registration Form</Link>.</p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
