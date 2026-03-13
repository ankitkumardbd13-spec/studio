"use client";

import React from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function IDCardPage() {
  const studentPhoto = PlaceHolderImages.find(img => img.id === 'student-1')?.imageUrl;
  const itiStamp = PlaceHolderImages.find(img => img.id === 'iti-stamp')?.imageUrl;
  const logoUrl = PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl flex justify-between items-center mb-8">
           <Button variant="ghost" asChild>
             <Link href="/student/dashboard" className="gap-2"><ArrowLeft className="w-4 h-4"/> Back to Dashboard</Link>
           </Button>
           <div className="flex gap-2">
             <Button variant="outline" className="gap-2"><Printer className="w-4 h-4"/> Print Card</Button>
             <Button className="bg-primary text-white gap-2 shadow-lg"><Download className="w-4 h-4"/> Download PDF</Button>
           </div>
        </div>

        {/* ID CARD COMPONENT */}
        <div className="relative w-full max-w-sm aspect-[5.5/8.5] md:aspect-[8.5/5.5] bg-white rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden flex flex-col md:flex-row print:shadow-none print:border-slate-300">
           
           {/* Header / Sidebar Section */}
           <div className="bg-primary p-6 md:w-1/3 flex flex-col items-center justify-center text-center text-white relative z-10">
              <div className="flex flex-col items-center gap-2 mb-6">
                <div className="relative w-16 h-16 bg-white rounded-full p-2 shadow-md">
                   {logoUrl && <Image src={logoUrl} alt="Logo" fill className="object-contain p-1" />}
                </div>
                <div>
                  <h2 className="font-headline text-lg leading-tight font-bold">Maharana Pratap ITI</h2>
                  <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Saharanpur, UP</p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col items-center gap-2">
                {/* Circular Student Photo */}
                <div className="w-28 h-28 border-4 border-white rounded-full overflow-hidden bg-muted relative shadow-xl">
                  {studentPhoto && <Image src={studentPhoto} alt="Student" fill className="object-cover" />}
                </div>
                <div className="text-[10px] font-bold mt-2 text-white bg-white/20 px-4 py-1 rounded-full uppercase tracking-tighter">
                  Student Identity Card
                </div>
              </div>
           </div>

           {/* Content Section with Watermark */}
           <div className="flex-1 p-8 bg-[#FAFAF0] flex flex-col justify-between relative overflow-hidden">
              
              {/* Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-30deg]">
                {logoUrl && <img src={logoUrl} alt="Watermark" className="w-[300px] grayscale" />}
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-primary">Rahul Kumar</h3>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight">ROLL NO: 2023/MP/ELEC/042</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                   <div>
                     <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Father's Name</p>
                     <p className="font-bold text-slate-900 border-b border-slate-200 pb-0.5">Shri Suresh Kumar</p>
                   </div>
                   <div>
                     <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Date of Birth</p>
                     <p className="font-bold text-slate-900 border-b border-slate-200 pb-0.5">15/05/2002</p>
                   </div>
                   <div>
                     <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Trade</p>
                     <p className="font-bold text-slate-900 border-b border-slate-200 pb-0.5">Electrician</p>
                   </div>
                   <div>
                     <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Academic Year</p>
                     <p className="font-bold text-slate-900 border-b border-slate-200 pb-0.5">First Year</p>
                   </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-primary/20 relative z-10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Valid Session</p>
                    <p className="font-bold text-secondary text-lg">2023 - 2025</p>
                  </div>
                  
                  {/* Circular Stamp Placed Properly */}
                  <div className="relative">
                    <div className="absolute -top-14 -right-2 w-20 h-20 opacity-80 -rotate-12 pointer-events-none">
                      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-primary/30 p-1 bg-white/5 backdrop-blur-[1px]">
                        {itiStamp ? (
                          <Image src={itiStamp} alt="Official Stamp" fill className="object-contain rounded-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] rounded-full text-center p-1 text-primary italic font-bold">
                            Official Seal
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-8 border-b border-primary w-28 mx-auto mb-1"></div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Principal's Signature</p>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground max-w-md text-center bg-white p-4 rounded-xl border shadow-sm">
          <strong>Note:</strong> This is a digitally generated ID card verified by Maharana Pratap ITI Saharanpur. The background watermark, circular student photo, and circular official stamp are security features. For physical use, print on standard PVC card material.
        </p>
      </div>
    </main>
  );
}
