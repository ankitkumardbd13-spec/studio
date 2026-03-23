"use client";

import React from 'react';
import { useStudent } from '@/hooks/use-student';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download, ShieldCheck, MapPin, Phone, Calendar, Loader2 } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function StudentIDCardPage() {
  const student = useStudent()!;
  const db = useFirestore();

  const configQuery = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'siteSettings', 'config');
  }, [db]);

  const { data: siteSettings, isLoading } = useDoc(configQuery);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Digital ID Card</h1>
          <p className="text-muted-foreground mt-1">Your official institutional identity card. You can print or download this for verification.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="gap-2 bg-primary hover:bg-primary/90">
            <Printer className="w-4 h-4" /> Print ID Card
          </Button>
        </div>
      </div>

      <div className="flex justify-center py-10 print:py-0">
        {/* ID Card UI */}
        <div className="relative w-[400px] h-[600px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-slate-300">
          {/* Header Background */}
          <div className="absolute top-0 left-0 w-full h-40 bg-primary overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
             <div className="absolute top-20 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
          </div>

          {/* Watermark Logo */}
          {siteSettings?.logo && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.05] pointer-events-none z-0">
               <img src={siteSettings.logo} alt="Watermark" className="w-full h-full object-contain grayscale" />
            </div>
          )}

          <div className="relative z-10 px-8 pt-8 text-center">
            <h2 className="text-white font-headline text-xl font-bold leading-tight">MAHARANA PRATAP ITI</h2>
            <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mt-1">Rankhandi, Saharanpur, U.P.</p>
            
            {/* Photo Container */}
            <div className="mt-8 flex justify-center">
              <div className="w-32 h-40 bg-white p-1 rounded-xl shadow-xl border-2 border-white">
                {student.photo ? (
                  <img src={student.photo} alt="Student" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-slate-300 text-xs font-bold uppercase">No Photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Name & Trade */}
            <div className="mt-6">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{student.name}</h3>
              <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary font-black text-xs rounded-full mt-2 uppercase">
                {student.trade}
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-2 text-left">
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Roll Number</p>
                  <p className="text-sm font-bold text-slate-700">{student.rollNo || 'Pending'}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Session</p>
                  <p className="text-sm font-bold text-slate-700">{student.session}</p>
               </div>
               <div className="col-span-2 border-t border-slate-100 pt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Father's Name</p>
                  <p className="text-sm font-bold text-slate-700">{student.fatherName}</p>
               </div>
               <div className="col-span-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Address</p>
                  <p className="text-xs font-bold text-slate-600 leading-tight">
                    {student.address?.fullAddress}, {student.address?.pincode}
                  </p>
               </div>
            </div>

            {/* Footer / QR Area */}
            <div className="mt-10 pt-6 border-t border-dashed border-slate-200 flex items-center justify-between">
               <div className="text-left">
                  <div className="flex items-center gap-1.5 text-green-600 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Verified Student</span>
                  </div>
                  <p className="text-[8px] text-slate-400 font-medium max-w-[120px]">
                    This is a digitally generated identity card for Maharana Pratap ITI Portal access.
                  </p>
               </div>
                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                 {siteSettings?.stamp ? (
                   <img src={siteSettings.stamp} alt="Stamp" className="w-full h-full object-contain mix-blend-multiply opacity-80" />
                 ) : (
                   <div className="text-[8px] font-bold text-slate-300 text-center uppercase leading-none">
                      Seal &<br/>Sign
                   </div>
                 )}
                </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 w-full h-3 bg-primary" />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex gap-4 no-print">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <Printer className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Printing Tip</h4>
          <p className="text-sm text-amber-800/80 leading-relaxed">
            For best results, use a color printer and set your browser print scale to 100%. If you are downloading to mobile, take a clear screenshot of the ID card.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
