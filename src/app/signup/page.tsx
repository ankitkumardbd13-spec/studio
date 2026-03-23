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
import { UserPlus, Upload, Calendar, Info, MapPin, Phone, GraduationCap, CreditCard, Mail } from 'lucide-react';
import Link from 'next/link';

import { compressImage } from '@/lib/image-compress';
import { useAuth, useFirestore } from '@/firebase/provider';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    aadhaar: '',
    category: '',
    personalMobile: '',
    whatsAppMobile: '',
    email: '',
    dob: '',
    trade: '',
    session: '',
    rollNo: '',
    state: '',
    district: '',
    tehsil: '',
    pincode: '',
    fullAddress: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await compressImage(e.target.files[0], 30);
        setPhotoBase64(compressed);
        toast({ title: "Photo attached", description: "Image compressed successfully." });
      } catch (err) {
        toast({ title: "Upload Failed", description: "Could not process image.", variant: "destructive" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!photoBase64) {
      toast({ title: "Photo required", description: "Please upload your passpost size photo.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. Create Auth Account using Email and DOB (without hyphens maybe? Form format is 'YYYY-MM-DD'. Let's convert to DDMMYYYY)
      const dobFormatted = formData.dob.split('-').reverse().join(''); 
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, dobFormatted);
      
      const uid = userCredential.user.uid;

      // 2. Save document to students collection
      await setDoc(doc(firestore, 'students', uid), {
        id: uid,
        name: formData.fullName,
        fatherName: formData.fatherName,
        aadhaar: formData.aadhaar,
        category: formData.category,
        mobile: formData.personalMobile,
        whatsApp: formData.whatsAppMobile,
        email: formData.email,
        dob: formData.dob,
        trade: formData.trade,
        session: formData.session,
        rollNo: formData.rollNo,
        address: {
          state: formData.state,
          district: formData.district,
          tehsil: formData.tehsil,
          pincode: formData.pincode,
          fullAddress: formData.fullAddress
        },
        photo: photoBase64,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // 3. Sign out immediately so they aren't logged in with unapproved access
      await auth.signOut();

      toast({
        title: "Registration Submitted!",
        description: "Your portal registration is under review. You can login once approved by admin.",
      });

      router.push('/login');
    } catch (error: any) {
      console.error("Signup error", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg flex gap-4 shadow-sm">
             <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
             <p className="text-sm font-medium">
               <strong className="text-primary">Important Notice:</strong> This form is for <span className="underline decoration-primary font-bold">already admitted</span> students of Maharana Pratap ITI to register for their digital portal access. Your password will be your Date of Birth in DDMMYYYY format.
             </p>
          </div>

          <Card className="border-none shadow-2xl overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl shadow-inner">
                  <UserPlus className="w-10 h-10" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl md:text-4xl">Portal Registration</CardTitle>
                  <CardDescription className="text-primary-foreground/90 text-md md:text-lg font-medium mt-1">Verify your enrollment to access syllabus, results & ID card.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* 1. Student Identity */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold border-b-2 border-slate-100 pb-3 text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-8 bg-primary rounded-full" /> 1. Student Identity
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-700 font-bold">Student Full Name</Label>
                      <Input id="fullName" placeholder="As per DGT/10th Certificate" required value={formData.fullName} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fatherName" className="text-slate-700 font-bold">Father's Name</Label>
                      <Input id="fatherName" placeholder="Full name of Father" required value={formData.fatherName} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700 font-bold">Email Address</Label>
                      <div className="relative">
                        <Input id="email" type="email" placeholder="student@example.com" required value={formData.email} onChange={handleChange} className="h-11 pl-11" />
                        <Mail className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personalMobile" className="text-slate-700 font-bold">Personal Mobile Number</Label>
                      <div className="relative">
                        <Input id="personalMobile" type="tel" placeholder="10 Digit Number" required value={formData.personalMobile} onChange={handleChange} className="h-11 pl-11" />
                        <Phone className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="whatsAppMobile" className="text-slate-700 font-bold">WhatsApp Number</Label>
                    <div className="relative">
                      <Input id="whatsAppMobile" type="tel" placeholder="WhatsApp Number" required value={formData.whatsAppMobile} onChange={handleChange} className="h-11 pl-11" />
                      <Phone className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-slate-700 font-bold">Date of Birth</Label>
                      <div className="relative">
                        <Input id="dob" type="date" required value={formData.dob} onChange={handleChange} className="h-11 pl-11" />
                        <Calendar className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar" className="text-slate-700 font-bold">Aadhaar Card Number</Label>
                      <div className="relative">
                        <Input id="aadhaar" placeholder="12 Digit Number" required maxLength={12} value={formData.aadhaar} onChange={handleChange} className="h-11 pl-11" />
                        <CreditCard className="absolute left-3.5 top-3 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Category</Label>
                      <Select required value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                        <SelectTrigger className="h-11">
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
                  </div>
                </div>

                {/* 2. Address Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold border-b-2 border-slate-100 pb-3 text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-8 bg-accent rounded-full" /> 2. Address Details
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2 lg:col-span-1">
                      <Label htmlFor="state" className="text-slate-700 font-bold">State</Label>
                      <Input id="state" placeholder="e.g. Uttar Pradesh" required value={formData.state} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                      <Label htmlFor="district" className="text-slate-700 font-bold">District</Label>
                      <Input id="district" placeholder="e.g. Saharanpur" required value={formData.district} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                      <Label htmlFor="tehsil" className="text-slate-700 font-bold">Tehsil</Label>
                      <Input id="tehsil" placeholder="e.g. Nakur" required value={formData.tehsil} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2 lg:col-span-1">
                      <Label htmlFor="pincode" className="text-slate-700 font-bold">Pincode</Label>
                      <Input id="pincode" placeholder="e.g. 247001" required value={formData.pincode} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2 md:col-span-2 lg:col-span-4">
                      <Label htmlFor="fullAddress" className="text-slate-700 font-bold">Full Address (Village/City/Street)</Label>
                      <Input id="fullAddress" placeholder="Complete address detail" required value={formData.fullAddress} onChange={handleChange} className="h-11" />
                    </div>
                  </div>
                </div>

                {/* 3. Course Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold border-b-2 border-slate-100 pb-3 text-slate-900 flex items-center gap-2">
                    <div className="w-2 h-8 bg-secondary rounded-full" /> 3. Academic Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rollNo" className="text-slate-700 font-bold">Institute Roll No. / Reg No.</Label>
                      <Input id="rollNo" placeholder="Enrollment or Roll Number" required value={formData.rollNo} onChange={handleChange} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Trade</Label>
                      <Select required value={formData.trade} onValueChange={(v) => handleSelectChange('trade', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Choose Trade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electrician">Electrician (2 Years)</SelectItem>
                          <SelectItem value="Fitter">Fitter (2 Years)</SelectItem>
                          <SelectItem value="HSI">HSI (1 Year)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-bold">Academic Session</Label>
                      <Select required value={formData.session} onValueChange={(v) => handleSelectChange('session', v)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select Session" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2022-24">2022 - 2024</SelectItem>
                          <SelectItem value="2023-25">2023 - 2025</SelectItem>
                          <SelectItem value="2024-26">2024 - 2026</SelectItem>
                          <SelectItem value="2025-27">2025 - 2027</SelectItem>
                          <SelectItem value="2026-28">2026 - 2028</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2 mt-4">
                      <Label className="text-slate-700 font-bold">Upload Passport Photo (Max 30KB)</Label>
                      <label className={`block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${photoBase64 ? 'border-green-500 bg-green-50' : 'border-primary/20 hover:bg-primary/5'}`}>
                        <input type="file" accept="image/jpeg, image/png" onChange={handlePhotoUpload} className="hidden" />
                        
                        {photoBase64 ? (
                           <div className="flex flex-col items-center">
                             <img src={photoBase64} alt="Preview" className="w-20 h-24 object-cover rounded shadow mb-3" />
                             <p className="font-bold text-green-700">Photo Ready</p>
                             <p className="text-xs text-green-600/80 mt-1">Click to change photo</p>
                           </div>
                        ) : (
                          <div className="py-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <p className="font-bold text-slate-700">Click to Select Photo</p>
                            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">Image will be automatically compressed to under 30KB. Use clear face photo with white background.</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 text-white font-black shadow-xl transition-transform hover:scale-[1.01] active:scale-[0.99] gap-3">
                    {isSubmitting ? "Processing Registration..." : <><GraduationCap className="w-6 h-6" /> Submit Portal Registration</>}
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