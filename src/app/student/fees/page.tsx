
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, ArrowLeft, Download, AlertCircle, User, FileText, Printer, Receipt, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/hooks/use-memo-firebase';

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  mode: string;
  status: string;
  receipt: string;
}

export default function StudentFeesPage() {
  const { toast } = useToast();
  const db = useFirestore();

  const configQuery = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'siteSettings', 'config');
  }, [db]);

  const { data: siteSettings, loading: configLoading } = useDoc(configQuery);

  const [profile, setProfile] = useState<any>({
    name: 'Rahul Kumar',
    father: 'Shri Suresh Kumar',
    rollNo: '2023/MP/ELEC/042',
    trade: 'Electrician'
  });
  
  const [feeStatus] = useState({
    total: 24000,
    paid: 12500,
    pending: 11500,
    dueDate: '2024-05-30'
  });

  const [history] = useState<PaymentHistory[]>([
    { id: '1', date: '2023-08-15', amount: 12000, mode: 'Admission Fee', status: 'Success', receipt: 'REC-2023-1021' },
    { id: '2', date: '2023-12-10', amount: 500, mode: 'Exam Fee', status: 'Success', receipt: 'REC-2023-1055' },
  ]);

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentHistory | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('mpiti_student_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handlePay = () => {
    toast({
      title: "Redirecting to Payment Gateway",
      description: "Connecting to secure UPI interface...",
    });
  };

  const openReceipt = (payment: PaymentHistory) => {
    setSelectedReceipt(payment);
    setIsReceiptOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const logoUrl = siteSettings?.logo || PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;
  const stampUrl = siteSettings?.stamp || PlaceHolderImages.find(img => img.id === 'iti-stamp')?.imageUrl;

  const ReceiptCard = ({ payment }: { payment: any }) => (
    <div className="receipt-slip bg-white border-b-2 border-dashed border-slate-400 p-[0.8cm] w-[21cm] h-[9cm] overflow-hidden flex flex-col relative shrink-0 box-border">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none grayscale">
        {logoUrl && <img src={logoUrl} alt="watermark" className="w-[12cm] h-[12cm] object-contain" />}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <header className="text-center border-b-2 border-slate-900 pb-2 mb-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tight mb-1">Maharana Pratap ITI Rankhandi</h2>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">OFFICIAL FEE RECEIPT - {payment?.receipt}</p>
        </header>

        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-2">
          <div className="flex flex-col border-b border-slate-200 pb-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Candidate Name</span>
            <span className="text-lg font-bold text-slate-900 uppercase">{profile.name}</span>
          </div>
          <div className="flex flex-col border-b border-slate-200 pb-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Father's Name</span>
            <span className="text-lg font-bold text-slate-800 uppercase">{profile.father}</span>
          </div>
          <div className="flex flex-col border-b border-slate-200 pb-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Roll / Registration No.</span>
            <span className="text-md font-bold text-slate-900">{profile.rollNo}</span>
          </div>
          <div className="flex flex-col border-b border-slate-200 pb-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Payment Date</span>
            <span className="text-md font-bold text-slate-900">{payment?.date}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Payment Details</span>
            <span className="text-md font-bold text-slate-700 italic">{payment?.mode}</span>
          </div>
          <div className="bg-slate-900 text-white px-6 py-2 rounded-lg flex flex-col items-end">
            <span className="text-[8px] uppercase font-bold opacity-60 mb-0.5">Amount Paid</span>
            <span className="text-3xl font-black">₹{payment?.amount.toLocaleString()}</span>
          </div>
        </div>

        <footer className="mt-auto flex justify-between items-end pt-2">
          <div className="text-[8px] text-slate-400 font-medium text-left">
            <p>Maharana Pratap ITI Rankhandi</p>
            <p>Digital Portal generated receipt.</p>
          </div>
          <div className="relative flex flex-col items-center">
            {stampUrl && (
              <div className="absolute -top-12 -right-4 w-24 h-24 opacity-40 mix-blend-multiply rotate-[-12deg] pointer-events-none">
                <img src={stampUrl} alt="stamp" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="w-32 h-[1px] bg-slate-900 mb-1"></div>
            <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Authorized Signatory</p>
          </div>
        </footer>
      </div>
    </div>
  );

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
      <div className="container mx-auto px-4 py-12 print:hidden">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline text-4xl text-primary font-bold">Fee Ledger</h1>
              <p className="text-muted-foreground">View your payments and download professional receipts (21cm x 9cm)</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/student/dashboard" className="gap-2"><ArrowLeft className="w-4 h-4"/> Dashboard</Link>
            </Button>
          </header>

          <Card className="mb-8 border-none shadow-sm bg-primary text-primary-foreground overflow-hidden">
             <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/20 rounded-xl"><User className="w-8 h-8" /></div>
                   <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight">{profile.name}</h2>
                      <p className="text-sm opacity-80 font-bold">Roll: {profile.rollNo} | Father: {profile.father}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold opacity-60">Pending Balance</p>
                  <p className="text-2xl font-black">₹{feeStatus.pending.toLocaleString()}</p>
                </div>
             </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Transaction Records</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-bold">Date</TableHead>
                        <TableHead className="font-bold">Mode</TableHead>
                        <TableHead className="font-bold">Amount</TableHead>
                        <TableHead className="text-right font-bold">Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell className="text-xs font-medium">{h.date}</TableCell>
                          <TableCell className="text-sm font-bold">{h.mode}</TableCell>
                          <TableCell className="font-black text-green-600">₹{h.amount}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-primary hover:bg-primary/5 gap-1"
                              onClick={() => openReceipt(h)}
                            >
                              <Printer className="w-3 h-3"/> View Receipt
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-secondary text-white relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Receipt className="w-20 h-20 rotate-[-15deg]" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">Pay Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handlePay} className="w-full bg-white text-secondary hover:bg-white/90 font-black h-12">Pay Now</Button>
                  <p className="text-[10px] text-white/70 italic text-center">Note: Online records update in 48h.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-[22cm] p-0 border-none bg-transparent shadow-none">
          <div className="bg-white p-6 rounded-xl shadow-2xl print:shadow-none print:p-0 flex flex-col items-center">
             <div className="flex justify-between items-center w-full mb-4 print:hidden">
               <DialogTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Receipt Preview (21cm x 9cm)</DialogTitle>
               <div className="flex gap-2">
                 <Button onClick={handlePrint} size="sm" className="gap-2 bg-primary h-8"><Printer className="w-3 h-3"/> Print Now</Button>
                 <Button onClick={() => setIsReceiptOpen(false)} variant="ghost" size="icon" className="h-8 w-8"><X className="w-4 h-4"/></Button>
               </div>
             </div>
             
             <div id="receipts-wrapper" className="flex flex-col">
                <ReceiptCard payment={selectedReceipt} />
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
          }
          body * {
            visibility: hidden;
          }
          #receipts-wrapper, #receipts-wrapper * {
            visibility: visible;
          }
          #receipts-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 21cm !important;
            height: 9cm !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            z-index: 999999 !important;
          }
          .receipt-slip {
            width: 21cm !important;
            height: 9cm !important;
            display: flex !important;
            flex-direction: column !important;
            page-break-inside: avoid !important;
            page-break-after: always !important;
            border-bottom: 2px dashed #999 !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0.8cm !important;
          }
        }
      `}</style>
    </main>
  );
}
