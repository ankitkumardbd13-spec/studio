
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
             <Button className="bg-primary text-white gap-2"><Download className="w-4 h-4"/> Download PDF</Button>
           </div>
        </div>

        {/* ID CARD COMPONENT */}
        <div className="relative w-full max-w-sm aspect-[5.5/8.5] md:aspect-[8.5/5.5] bg-white rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden flex flex-col md:flex-row">
           {/* Top/Left Section: Header */}
           <div className="bg-primary p-6 md:w-1/3 flex flex-col items-center justify-center text-center text-white">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 p-2 shadow-lg relative overflow-hidden">
                 {logoUrl ? (
                   <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" />
                 ) : (
                   <div className="text-primary font-black text-2xl">MPITI</div>
                 )}
              </div>
              <h2 className="font-headline text-lg leading-tight mb-2">Maharana Pratap ITI</h2>
              <p className="text-[10px] opacity-80 uppercase tracking-widest">Saharanpur, UP</p>
              
              <div className="mt-8 flex flex-col items-center gap-2">
                <div className="w-24 h-24 border-2 border-white rounded-lg overflow-hidden bg-muted relative">
                  {studentPhoto && <Image src={studentPhoto} alt="Student" fill className="object-cover" />}
                </div>
                <div className="text-xs font-bold mt-2 text-white">STUDENT</div>
              </div>
           </div>

           {/* Content Section */}
           <div className="flex-1 p-8 bg-cream flex flex-col justify-between relative">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-primary">Rahul Kumar</h3>
                    <p className="text-xs text-muted-foreground">Roll No: 2023/MP/ELEC/042</p>
                  </div>
                  <div className="w-16 h-16 relative opacity-80">
                    {itiStamp ? (
                      <Image src={itiStamp} alt="Official Stamp" fill className="object-contain" />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center text-[8px] border-2 border-primary/40 rounded-full text-center p-1 text-primary italic font-bold">
                        Official Seal
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                   <div>
                     <p className="text-[10px] text-muted-foreground uppercase">Father's Name</p>
                     <p className="font-bold text-slate-900">Shri Suresh Kumar</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-muted-foreground uppercase">Date of Birth</p>
                     <p className="font-bold text-slate-900">15/05/2002</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-muted-foreground uppercase">Trade</p>
                     <p className="font-bold text-slate-900">Electrician</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-muted-foreground uppercase">Year</p>
                     <p className="font-bold text-slate-900">First Year</p>
                   </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-dashed border-primary/20">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Validity Session</p>
                    <p className="font-bold text-secondary">2023 - 2025</p>
                  </div>
                  <div className="text-center">
                    <div className="h-8 border-b border-primary w-24 mx-auto mb-1"></div>
                    <p className="text-[10px] text-muted-foreground uppercase">Principal Signature</p>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground max-w-md text-center">
          This is a digitally generated ID card. For physical use, please print on a 300gsm card. The official logo and blue stamp of Maharana Pratap ITI Saharanpur are included digitally.
        </p>
      </div>
    </main>
  );
}
