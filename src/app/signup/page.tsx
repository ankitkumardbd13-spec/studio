
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Upload, Calendar, Info, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Portal Registration Submitted!",
        description: "Admin will verify your admission status and activate your portal access.",
      });
      setIsSubmitting(false);
      router.push('/login');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg flex gap-4">
             <Info className="w-6 h-6 text-primary flex-shrink-0" />
             <p className="text-sm">
               <strong>Important:</strong> This form is for <strong>already admitted</strong> students to register for portal access (DGT/NCVT Syllabus, ID Card, Results).
             </p>
          </div>

          <Card className="border-none shadow-2xl">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <UserPlus className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl">Portal Registration</CardTitle>
                  <CardDescription className="text-primary-foreground/80">Submit your details for verification and portal activation.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b pb-2 text-primary flex items-center gap-2"><Phone className="w-5 h-5"/> 1. Personal & Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Student Full Name</Label>
                      <Input id="fullName" placeholder="As per Admission Record" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <Input id="fatherName" placeholder="As per Admission Record" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personalMobile">Personal Mobile Number</Label>
                      <Input id="personalMobile" type="tel" placeholder="+91" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsappNo">WhatsApp Number</Label>
                      <Input id="whatsappNo" type="tel" placeholder="+91" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherMobile">Father's Mobile Number</Label>
                      <Input id="fatherMobile" type="tel" placeholder="+91" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <div className="relative">
                        <Input id="dob" type="date" required className="pl-10" />
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address (Login ID)</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b pb-2 text-primary">2. Course Information (DGT NCVT)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Trade / Course</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Trade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electrician">Electrician (2 Years)</SelectItem>
                          <SelectItem value="fitter">Fitter (2 Years)</SelectItem>
                          <SelectItem value="hsi">HSI (1 Year)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Academic Session</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Session" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-25">2023-2025</SelectItem>
                          <SelectItem value="2024-26">2024-2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Current Year</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st">First Year</SelectItem>
                          <SelectItem value="2nd">Second Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Passport Photo</Label>
                      <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload className="mx-auto w-6 h-6 mb-2 text-muted-foreground" />
                        <p className="text-xs">Click to upload (JPG/PNG)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold border-b pb-2 text-primary flex items-center gap-2"><MapPin className="w-5 h-5"/> 3. Permanent Address</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stateName">State Name</Label>
                      <Input id="stateName" placeholder="e.g. Uttar Pradesh" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tehsilName">Tehsil Name</Label>
                      <Input id="tehsilName" placeholder="Enter Tehsil" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postOffice">Post Office Name</Label>
                      <Input id="postOffice" placeholder="Enter Post Office" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullAddress">Full Address (Village/Street)</Label>
                      <Input id="fullAddress" placeholder="House No, Village, etc." required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input id="pincode" placeholder="247XXX" required />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg bg-secondary hover:bg-secondary/90 text-white font-bold">
                    {isSubmitting ? "Submitting Registration..." : "Complete Portal Registration"}
                  </Button>
                  <p className="text-center mt-4 text-sm text-muted-foreground">
                    Already registered? <Link href="/login" className="text-primary font-bold hover:underline">Log in here</Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
