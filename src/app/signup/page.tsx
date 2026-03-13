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
import { UserPlus, Upload, Calendar, Info, MapPin, Phone, GraduationCap, CreditCard, Layers } from 'lucide-react';
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
          <div className="mb-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg flex gap-4 shadow-sm">
             <Info className="w-6 h-6 text-primary flex-shrink-0" />
             <p className="text-sm font-medium">
               <strong className="text-primary">Important Notice:</strong> This form is for <span className="underline decoration-primary font-bold">already admitted</span> students of Maharana Pratap ITI to register for their digital portal access.
             </p>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl shadow-inner">
                  <UserPlus className="w-10 h-10" />
                </div>
                <div>
                  <CardTitle className="font-headline text-4xl">Portal Registration</CardTitle>
                  <CardDescription className="text-primary-foreground/90 text-lg font-medium">Verify your enrollment to access results & assignments.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold border-b-2 border-slate-100 pb-3 text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-8 bg-primary rounded-full" /> 1. Student Identity
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-700 font-bold">Student Full Name</Label>
                      <Input id="fullName" placeholder="As per DGT/10th Certificate" required className="h-12 border-slate-300 focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName" className="text-slate-700 font-bold">Father's Name</Label>
                      <Input id="fatherName" placeholder="Full name of Father" required className="h-12 border-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar" className="text-slate-700 font-bold">Aadhaar Card Number</Label>
                      <div className="relative">
                        <Input id="aadhaar" placeholder="12 Digit Number" required maxLength={14} className="h-12 pl-12 border-slate-300" />
                        <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Category</Label>
                      <Select required>
                        <SelectTrigger className="h-12 border-slate-300">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General">General</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="EWS">EWS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personalMobile" className="text-slate-700 font-bold">Mobile Number</Label>
                      <div className="relative">
                        <Input id="personalMobile" type="tel" placeholder="10 Digit Number" required className="h-12 pl-12 border-slate-300" />
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-slate-700 font-bold">Date of Birth</Label>
                      <div className="relative">
                        <Input id="dob" type="date" required className="h-12 pl-12 border-slate-300" />
                        <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold border-b-2 border-slate-100 pb-3 text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-8 bg-secondary rounded-full" /> 2. Course Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Select Your Trade</Label>
                      <Select required>
                        <SelectTrigger className="h-12 border-slate-300 text-lg font-bold">
                          <SelectValue placeholder="Choose Trade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electrician" className="font-bold py-3">Electrician (2 Years)</SelectItem>
                          <SelectItem value="fitter" className="font-bold py-3">Fitter (2 Years)</SelectItem>
                          <SelectItem value="hsi" className="font-bold py-3">HSI (1 Year)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Academic Session</Label>
                      <Select required>
                        <SelectTrigger className="h-12 border-slate-300 text-lg font-bold">
                          <SelectValue placeholder="Select Session" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023-25" className="font-bold py-3">2023 - 2025</SelectItem>
                          <SelectItem value="2024-26" className="font-bold py-3">2024 - 2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-slate-700 font-bold">Upload Passport Photo</Label>
                      <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center cursor-pointer hover:bg-primary/5 transition-all group">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="font-bold text-slate-700">Click to Upload JPG/PNG</p>
                        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">Recommended: Clear face photo with white background</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-16 text-xl bg-secondary hover:bg-secondary/90 text-white font-black shadow-xl transition-transform hover:scale-[1.01] active:scale-[0.99] gap-3">
                    {isSubmitting ? "Processing Registration..." : <><GraduationCap className="w-6 h-6" /> Complete Portal Registration</>}
                  </Button>
                  <p className="text-center mt-6 text-slate-600 font-medium">
                    Already registered? <Link href="/login" className="text-primary font-bold hover:underline decoration-2">Log in to Student Dashboard</Link>
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