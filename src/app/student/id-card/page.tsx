
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Printer, Download, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/hooks/use-memo-firebase';

export default function IDCardPage() {
  const db = useFirestore();
  
  const configQuery = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'siteSettings', 'config');
  }, [db]);

  const { data: siteSettings, isLoading: configLoading } = useDoc(configQuery);

  const [profile, setProfile] = useState<any>({
    name: 'RAHUL KUMAR',
    father: 'Shri Suresh Kumar',
    trade: 'Electrician',
    session: '2023 - 2025',
    year: 'First Year',
    rollNo: '2023/MP/ELEC/042',
    dob: '15-05-2002',
    photo: PlaceHolderImages.find(img => img.id === 'student-1')?.imageUrl
  });

  useEffect(() => {
    // Load student's custom profile data from local session
    const savedProfile = localStorage.getItem('mpiti_student_profile');
    if (savedProfile) {
      setProfile(prev => ({ ...prev, ...JSON.parse(savedProfile) }));
    }
  }, []);

  const itiStamp = siteSettings?.stamp || PlaceHolderImages.find(img => img.id === 'iti-stamp')?.imageUrl;
  const logoUrl = siteSettings?.logo || PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;

  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        {/* Actions Header */}
        <div className="w-full max-w-2xl flex justify-between items-center mb-8">
           <Button variant="ghost" asChild>
             <Link href="/student/dashboard" className="gap-2 text-muted-foreground hover:text-primary">
               <ArrowLeft className="w-4 h-4"/> Back to Dashboard
             </Link>
           </Button>
           <div className="flex gap-3">
             <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5">
               <Printer className="w-4 h-4"/> Print Card
             </Button>
             <Button className="bg-primary text-white gap-2 shadow-lg">
               <Download className="w-4 h-4"/> Download PDF
             </Button>
           </div>
        </div>

        {/* ID CARD COMPONENT */}
        <div className="relative w-full max-w-[400px] md:max-w-[650px] bg-white rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col md:flex-row print:shadow-none print:border-slate-300">
           
           {/* Left Sidebar: Branding & Photo */}
           <div className="bg-primary p-8 md:w-[240px] flex flex-col items-center justify-between text-center text-white relative z-10 border-r border-white/10">
              <div className="space-y-4 w-full">
                {/* Logo at the very top */}
                <div className="relative w-20 h-20 bg-white rounded-2xl p-2 mx-auto shadow-xl flex items-center justify-center">
                   {logoUrl && (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                   )}
                </div>
                <div className="mt-2">
                  <h2 className="font-headline text-2xl leading-tight font-bold tracking-tight">MPITI</h2>
                  <p className="text-[10px] opacity-70 uppercase tracking-[0.2em] font-bold">Saharanpur</p>
                </div>
              </div>
              
              <div className="my-8">
                {/* Circular Student Photo */}
                <div className="w-36 h-36 border-4 border-white/50 rounded-full overflow-hidden bg-white shadow-2xl mx-auto flex items-center justify-center">
                  {profile.photo && (
                    <img 
                      src={profile.photo} 
                      alt="Student" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="bg-white/15 px-6 py-2 rounded-full border border-white/20">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white whitespace-nowrap">
                  Identity Card
                </p>
              </div>
           </div>

           {/* Right Content Section */}
           <div className="flex-1 p-10 bg-card relative flex flex-col justify-between min-h-[450px]">
              
              {/* Subtle Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-15deg]">
                {logoUrl && <img src={logoUrl} alt="Watermark" className="w-80 h-80 object-contain grayscale" />}
              </div>

              <div className="relative z-10">
                <header className="flex justify-between items-start mb-10">
                  <div>
                    <h1 className="text-4xl font-headline font-black text-slate-900 mb-1 uppercase">{profile.name}</h1>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-secondary/10 text-secondary px-3 py-1 rounded-md font-bold uppercase tracking-wider">
                        Roll: {profile.rollNo}
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="text-primary w-8 h-8 opacity-20" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Father's Name</p>
                     <p className="font-bold text-slate-800 text-base">{profile.father}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Date of Birth</p>
                     <p className="font-bold text-slate-800 text-base">{profile.dob}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Trade</p>
                     <p className="font-bold text-primary text-base">{profile.trade}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Academic Year</p>
                     <p className="font-bold text-slate-800 text-base">{profile.year}</p>
                   </div>
                </div>
              </div>

              {/* Bottom Section: Session & Authenticated Stamp */}
              <div className="relative z-10 pt-8 mt-10 border-t border-slate-100 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Valid Session</p>
                  <p className="font-black text-3xl text-secondary">{profile.session}</p>
                </div>
                
                <div className="relative flex flex-col items-center">
                  {/* Official Circular Stamp Overlay */}
                  <div className="absolute -top-20 -right-4 w-32 h-32 pointer-events-none">
                    {itiStamp && (
                      <div className="relative w-full h-full rounded-full overflow-hidden p-1 bg-transparent flex items-center justify-center rotate-[-15deg]">
                        <img 
                          src={itiStamp} 
                          alt="Official Stamp" 
                          className="w-full h-full object-contain mix-blend-multiply opacity-90" 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Principal Signature Line */}
                  <div className="text-center mt-6">
                    <div className="h-[1px] bg-slate-400 w-40 mx-auto mb-2"></div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Principal / प्रधानाचार्य</p>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Security Note */}
        <div className="mt-12 max-w-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border shadow-sm text-xs font-bold text-primary">
            <ShieldCheck className="w-4 h-4" /> Digtally Verified Document
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            This identity card is an official digital record of <strong>Maharana Pratap ITI Saharanpur</strong>. 
            Features circular photo authentication, background branding watermark, and official circular institute seal. 
            Misuse of this digital ID is a punishable offense under DGT/NCVT guidelines.
          </p>
        </div>
      </div>
    </main>
  );
}
