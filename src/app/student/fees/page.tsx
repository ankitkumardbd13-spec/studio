"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, ArrowLeft, Download, AlertCircle, User, FileText, Printer, Receipt, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('mpiti_student_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    const savedSite = localStorage.getItem('mpiti_site_settings');
    if (savedSite) {
      setSiteSettings(JSON.parse(savedSite));
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
    <div className="receipt-slip bg-white border-2 border-slate-900 p-2 w-[7cm] h-[3.5cm] overflow-hidden flex flex-col relative">
      {/* LOGO ONLY AS WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none grayscale">
        {logoUrl && <img src={logoUrl} alt="watermark" className="w-20 h-20 object-contain" />}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <header className="text-center border-b border-slate-900 pb-0.5 mb-1">
          <h2 className="text-[10px] font-black text-slate-900 uppercase leading-none tracking-tighter">Maharana Pratap ITI</h2>
          <p className="text-[5px] font-bold text-slate-500 uppercase">NO: {payment?.receipt}</p>
        </header>

        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5">
          <div className="flex flex-col">
            <span className="text-[4px] font-bold text-slate-400 uppercase">Candidate</span>
            <span className="text-[7px] font-black text-slate-900 uppercase truncate">{profile.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[4px] font-bold text-slate-400 uppercase">Father</span>
            <span className="text-[6px] font-black text-slate-800 uppercase truncate">{profile.father}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[4px] font-bold text-slate-400 uppercase">Roll No</span>
            <span className="text-[6px] font-bold text-slate-900">{profile.rollNo}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[4px] font-bold text-slate-400 uppercase">Date</span>
            <span className="text-[6px] font-bold text-slate-900">{payment?.date}</span>
          </div>
        </div>

        <div className="mt-1 flex justify-between items-center border-t border-dashed border-slate-300 pt-1">
          <div className="flex flex-col">
            <span className="text-[4px] font-bold text-slate-400 uppercase">Details</span>
            <span className="text-[6px] font-bold text-slate-700 italic">{payment?.mode}</span>
          </div>
          <div className="bg-slate-900 text-white px-2 py-0.5 rounded-sm">
            <span className="text-[9px] font-black">₹{payment?.amount.toLocaleString()}</span>
          </div>
        </div>

        <footer className="mt-auto flex justify-between items-end">
          <p className="text-[4px] text-slate-400">MPITI SAHARANPUR</p>
          <div className="relative">
            {stampUrl && (
              <div className="absolute -top-4 -right-1 w-6 h-6 opacity-40 mix-blend-multiply rotate-[-10deg]">
                <img src={stampUrl} alt="stamp" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="w-12 h-[0.5px] bg-slate-900 mb-0.5"></div>
            <p className="text-[5px] font-black text-slate-900 uppercase">Auth. Sign</p>
          </div>
        </footer>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12 print:hidden">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline text-4xl text-primary font-bold">Fee Ledger</h1>
              <p className="text-muted-foreground">View your payments and download micro-receipts (7x3.5cm)</p>
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
                        <TableHead className="text-right font-bold">Slip</TableHead>
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
                              <Download className="w-3 h-3"/> Get Slip
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
                  <p className="text-[10px] text-white/70 italic text-center">Note: Cash payments take 48h to reflect.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Tiny Receipt Dialog - 3 slips stacked */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-[450px] p-0 border-none bg-transparent shadow-none">
          <div className="bg-white p-6 rounded-xl shadow-2xl print:shadow-none print:p-0 flex flex-col items-center">
             <div className="flex justify-between items-center w-full mb-4 print:hidden">
               <DialogTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fee Slip Preview (3 Stacked)</DialogTitle>
               <div className="flex gap-2">
                 <Button onClick={handlePrint} size="sm" className="gap-2 bg-primary h-8"><Printer className="w-3 h-3"/> Print</Button>
                 <Button onClick={() => setIsReceiptOpen(false)} variant="ghost" size="icon" className="h-8 w-8"><X className="w-4 h-4"/></Button>
               </div>
             </div>
             
             {/* Printable Area - 3 stacked slips */}
             <div id="receipts-wrapper" className="bg-white p-0 flex flex-col items-center gap-2 print:m-0 print:p-0">
                <ReceiptCard payment={selectedReceipt} />
                <ReceiptCard payment={selectedReceipt} />
                <ReceiptCard payment={selectedReceipt} />
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipts-wrapper, #receipts-wrapper * {
            visibility: visible;
          }
          #receipts-wrapper {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            display: flex !important;
            flex-direction: column !important;
            gap: 2mm !important;
            width: 7cm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .receipt-slip {
            width: 7cm !important;
            height: 3.5cm !important;
            border: 1px solid black !important;
            margin: 0 !important;
            page-break-inside: avoid;
          }
          @page {
            size: A4;
            margin: 5mm;
          }
        }
      `}</style>
    </main>
  );
}
