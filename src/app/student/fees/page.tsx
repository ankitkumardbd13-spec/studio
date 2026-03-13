"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, ArrowLeft, Download, AlertCircle, Phone, User, FileText, Printer, Receipt, X } from 'lucide-react';
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

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_student_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handlePay = () => {
    toast({
      title: "Redirecting to Payment Gateway",
      description: "Please do not close this window while we connect to secure UPI...",
    });
  };

  const openReceipt = (payment: PaymentHistory) => {
    setSelectedReceipt(payment);
    setIsReceiptOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const logoUrl = PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;
  const stampUrl = PlaceHolderImages.find(img => img.id === 'iti-stamp')?.imageUrl;

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12 print:hidden">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline text-4xl text-primary font-bold">Fee & Payment Portal</h1>
              <p className="text-muted-foreground">Detailed financial record for Maharana Pratap ITI</p>
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
                      <p className="text-sm opacity-80 font-bold">Roll No: {profile.rollNo} | Father: {profile.father}</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="text-center px-6 border-l border-white/20">
                      <p className="text-[10px] uppercase font-bold opacity-60">Session</p>
                      <p className="font-bold">2023-25</p>
                   </div>
                   <div className="text-center px-6 border-l border-white/20">
                      <p className="text-[10px] uppercase font-bold opacity-60">Trade</p>
                      <p className="font-bold">{profile.trade}</p>
                   </div>
                </div>
             </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Academic Fee</p>
                <p className="text-3xl font-black">₹{feeStatus.total.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-green-600 uppercase mb-1">Total Amount Paid</p>
                <p className="text-3xl font-black text-green-700">₹{feeStatus.paid.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-red-50">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-red-600 uppercase mb-1">Balance Due</p>
                <p className="text-3xl font-black text-red-700">₹{feeStatus.pending.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Transaction History</CardTitle>
                    <CardDescription>All your historical payments are listed here.</CardDescription>
                  </div>
                  <Printer className="w-5 h-5 text-muted-foreground opacity-30" />
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-bold">Date</TableHead>
                        <TableHead className="font-bold">Particulars</TableHead>
                        <TableHead className="font-bold">Receipt No</TableHead>
                        <TableHead className="font-bold">Amount</TableHead>
                        <TableHead className="text-right font-bold">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell className="text-xs font-medium">{h.date}</TableCell>
                          <TableCell className="text-sm font-bold text-slate-700">{h.mode}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px] font-bold">{h.receipt}</Badge>
                          </TableCell>
                          <TableCell className="font-black text-green-600">₹{h.amount}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-primary hover:bg-primary/5 gap-1"
                              onClick={() => openReceipt(h)}
                            >
                              <Download className="w-3 h-3"/> Receipt
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="p-6 bg-white rounded-xl shadow-sm border flex items-start gap-4">
                <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Important Note on Manual Payments</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">If you have paid your fees via Cash or Cheque at the office, please allow 24-48 hours for it to reflect in your portal history. Keep your physical receipt safe.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-secondary text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Receipt className="w-20 h-20 rotate-[-15deg]" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><CreditCard className="w-5 h-5"/> Pay Balance Online</CardTitle>
                  <CardDescription className="text-white/80">Submit your pending fees securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                    <p className="text-[10px] font-bold uppercase opacity-60">Next Installment Due</p>
                    <p className="text-2xl font-black">₹{feeStatus.pending.toLocaleString()}</p>
                    <p className="text-[10px] mt-2 flex items-center gap-1 font-bold"><Clock className="w-3 h-3"/> Deadline: {feeStatus.dueDate}</p>
                  </div>
                  <Button onClick={handlePay} className="w-full bg-white text-secondary hover:bg-white/90 font-black h-12 shadow-xl">Pay Via UPI / Cards</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Landscape Receipt Dialog - A6 Size (1/4 A4) */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-[600px] p-0 border-none bg-transparent shadow-none">
          <div className="bg-white p-6 rounded-xl shadow-2xl print:shadow-none print:p-0 relative overflow-hidden">
             <div className="flex justify-between items-center mb-4 print:hidden">
               <DialogTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Fees Slip Preview</DialogTitle>
               <div className="flex gap-2">
                 <Button onClick={handlePrint} size="sm" className="gap-2 bg-primary"><Printer className="w-3 h-3"/> Print Slip</Button>
                 <Button onClick={() => setIsReceiptOpen(false)} variant="ghost" size="icon" className="h-8 w-8"><X className="w-4 h-4"/></Button>
               </div>
             </div>
             
             {/* Printable Area - Landscape A6 (Approx 148mm x 105mm) */}
             <div id="receipt-printable" className="bg-white border-2 border-slate-900 p-6 w-full h-[380px] overflow-hidden flex flex-col relative print:border-2 print:m-0">
                {/* Center Watermark Logo ONLY */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none grayscale">
                   {logoUrl && <img src={logoUrl} alt="logo" className="w-[300px] h-[300px] object-contain" />}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <header className="text-center border-b-2 border-slate-900 pb-2 mb-4">
                    <h2 className="text-xl font-black text-slate-900 uppercase leading-none tracking-tighter">Maharana Pratap ITI Saharanpur</h2>
                    <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase">DGT / NCVT Govt. Recognized Institute | Uttar Pradesh</p>
                  </header>

                  <div className="flex justify-between text-[11px] font-bold mb-4">
                     <div className="bg-slate-900 text-white px-3 py-1 rounded-sm uppercase tracking-widest">Fee Payment Slip</div>
                     <div className="text-right leading-tight">
                        <p>Slip No: <span className="font-black">{selectedReceipt?.receipt}</span></p>
                        <p>Date: <span className="font-black">{selectedReceipt?.date}</span></p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 flex-1">
                     <div className="space-y-2">
                        <div className="grid grid-cols-[80px_1fr] gap-x-2 text-[11px]">
                           <span className="text-slate-500 font-medium">Student:</span>
                           <span className="font-black text-slate-900 uppercase border-b border-slate-200">{profile.name}</span>
                           
                           <span className="text-slate-500 font-medium">Father:</span>
                           <span className="font-black text-slate-900 uppercase border-b border-slate-200">{profile.father}</span>
                           
                           <span className="text-slate-500 font-medium">Roll No:</span>
                           <span className="font-black text-slate-900 border-b border-slate-200">{profile.rollNo}</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="grid grid-cols-[80px_1fr] gap-x-2 text-[11px]">
                           <span className="text-slate-500 font-medium">Trade:</span>
                           <span className="font-black text-slate-900 border-b border-slate-200 uppercase">{profile.trade}</span>
                           
                           <span className="text-slate-500 font-medium">Particulars:</span>
                           <span className="font-black text-slate-900 border-b border-slate-200 italic">{selectedReceipt?.mode}</span>
                        </div>
                        <div className="mt-4 p-3 bg-slate-50 border-2 border-slate-900 rounded-md flex justify-between items-center">
                           <span className="text-[10px] font-black uppercase">Amount:</span>
                           <span className="text-2xl font-black text-slate-900">₹{selectedReceipt?.amount.toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <footer className="mt-auto pt-4 flex justify-between items-end">
                     <div className="text-center">
                        <div className="w-28 h-[1px] bg-slate-400 mb-1"></div>
                        <p className="text-[9px] font-bold uppercase text-slate-400">Payer Signature</p>
                     </div>
                     
                     <div className="relative flex flex-col items-center">
                        {stampUrl && (
                          <div className="absolute -top-16 -right-2 w-24 h-24 opacity-70 mix-blend-multiply rotate-[-12deg]">
                             <img src={stampUrl} alt="stamp" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="w-28 h-[1px] bg-slate-900 mb-1"></div>
                        <p className="text-[10px] font-black uppercase text-slate-900">Accountant / Principal</p>
                     </div>
                  </footer>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-printable, #receipt-printable * {
            visibility: visible;
          }
          #receipt-printable {
            position: relative;
            display: block;
            width: 148mm !important;
            height: 105mm !important;
            border: 2px solid black !important;
            padding: 10mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
          /* Custom layout to fit 4 per page */
          @page {
            size: A4 landscape;
            margin: 0;
          }
          html, body {
            width: 297mm;
            height: 210mm;
          }
          #receipt-printable {
            float: left;
            box-sizing: border-box;
          }
        }
      `}</style>
    </main>
  );
}

