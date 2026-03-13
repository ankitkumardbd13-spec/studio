"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Printer, Download, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function IDCardPage() {
  const studentPhoto = PlaceHolderImages.find(img => img.id === 'student-1')?.imageUrl;
  const itiStamp = PlaceHolderImages.find(img => img.id === 'iti-stamp')?.imageUrl;
  const logoUrl = PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;

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
           <div className="bg-primary p-8 md:w-[220px] flex flex-col items-center justify-between text-center text-white relative z-10">
              <div className="space-y-4">
                <div className="relative w-20 h-20 bg-white rounded-full p-2 mx-auto shadow-xl flex items-center justify-center">
                   {logoUrl && <Image src={logoUrl} alt="Logo" width={60} height={60} className="object-contain" />}
                </div>
                <div>
                  <h2 className="font-headline text-xl leading-tight font-bold tracking-tight">MPITI</h2>
                  <p className="text-[9px] opacity-70 uppercase tracking-[0.2em] font-bold">Saharanpur</p>
                </div>
              </div>
              
              <div className="my-8">
                {/* Circular Student Photo */}
                <div className="w-32 h-32 border-4 border-white/50 rounded-full overflow-hidden bg-white/10 relative shadow-2xl mx-auto">
                  {studentPhoto && (
                    <Image 
                      src={studentPhoto} 
                      alt="Student" 
                      fill 
                      className="object-cover"
                      data-ai-hint="student portrait"
                    />
                  )}
                </div>
              </div>

              <div className="bg-white/15 px-4 py-1.5 rounded-full border border-white/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap">
                  Identity Card
                </p>
              </div>
           </div>

           {/* Right Content Section */}
           <div className="flex-1 p-8 bg-card relative flex flex-col justify-between min-h-[400px]">
              
              {/* Subtle Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none rotate-[-15deg]">
                {logoUrl && <img src={logoUrl} alt="Watermark" className="w-72 grayscale" />}
              </div>

              <div className="relative z-10">
                <header className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-headline font-black text-slate-900 mb-1">RAHUL KUMAR</h1>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Roll: 2023/MP/ELEC/042
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="text-primary w-6 h-6 opacity-20" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Father's Name</p>
                     <p className="font-bold text-slate-800 text-sm">Shri Suresh Kumar</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Date of Birth</p>
                     <p className="font-bold text-slate-800 text-sm">15 May 2002</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Trade</p>
                     <p className="font-bold text-primary font-bold text-sm">Electrician</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Academic Year</p>
                     <p className="font-bold text-slate-800 text-sm">First Year</p>
                   </div>
                </div>
              </div>

              {/* Bottom Section: Session & Authenticated Stamp */}
              <div className="relative z-10 pt-8 mt-8 border-t border-slate-100 flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Valid Session</p>
                  <p className="font-black text-2xl text-secondary">2023 - 2025</p>
                </div>
                
                <div className="relative flex flex-col items-center">
                  {/* Official Circular Stamp Overlay */}
                  <div className="absolute -top-16 -right-2 w-24 h-24 pointer-events-none group">
                    <div className="relative w-full h-full rounded-full border-2 border-primary/20 p-1.5 bg-white/10 backdrop-blur-[1px] shadow-sm rotate-[-12deg]">
                      {itiStamp ? (
                        <Image 
                          src={itiStamp} 
                          alt="Official Stamp" 
                          fill 
                          className="object-contain p-1 opacity-90" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] rounded-full text-center p-1 text-primary italic font-bold border-2 border-dashed border-primary/40 uppercase">
                          Official Seal
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Principal Signature Line */}
                  <div className="text-center mt-4">
                    <div className="h-[1px] bg-slate-400 w-32 mx-auto mb-1"></div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Principal</p>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Security Note */}
        <div className="mt-12 max-w-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm text-xs font-bold text-primary">
            <ShieldCheck className="w-4 h-4" /> Digtally Verified Document
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This identity card is an official digital record of <strong>Maharana Pratap ITI Saharanpur</strong>. 
            Features circular photo authentication, background branding watermark, and official circular institute seal. 
            Misuse of this digital ID is a punishable offense under DGT/NCVT guidelines.
          </p>
        </div>
      </div>
    </main>
  );
}
