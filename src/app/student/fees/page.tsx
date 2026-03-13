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

  const logoUrl = siteSettings?.logo || PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;
  const stampUrl = siteSettings?.stamp || PlaceHolderImages.find(img => img.id === 'iti-stamp')?.imageUrl;

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
                              <Download className="w-3 h-3"/> View Slip
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

      {/* Vertical Receipt Dialog - 90mm x 200mm */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-[400px] p-0 border-none bg-transparent shadow-none">
          <div className="bg-white p-6 rounded-xl shadow-2xl print:shadow-none print:p-0 flex flex-col items-center">
             <div className="flex justify-between items-center w-full mb-4 print:hidden">
               <DialogTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Fees Receipt</DialogTitle>
               <div className="flex gap-2">
                 <Button onClick={handlePrint} size="sm" className="gap-2 bg-primary h-8"><Printer className="w-3 h-3"/> Print</Button>
                 <Button onClick={() => setIsReceiptOpen(false)} variant="ghost" size="icon" className="h-8 w-8"><X className="w-4 h-4"/></Button>
               </div>
             </div>
             
             {/* Printable Area - Vertical 90mm x 200mm */}
             <div id="receipt-printable" className="bg-white border-2 border-slate-900 p-4 w-[90mm] h-[200mm] overflow-hidden flex flex-col relative print:border-2 print:m-0">
                {/* LOGO ONLY AS WATERMARK */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none grayscale">
                   {logoUrl && <img src={logoUrl} alt="watermark" className="w-64 h-64 object-contain" />}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <header className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                    <h2 className="text-lg font-black text-slate-900 uppercase leading-none tracking-tighter">Maharana Pratap ITI</h2>
                    <p className="text-[8px] font-bold text-slate-600 mt-1 uppercase">Saharanpur, Uttar Pradesh</p>
                    <p className="text-[7px] text-slate-500 font-bold">DGT / NCVT GOVT. RECOGNIZED</p>
                  </header>

                  <div className="bg-slate-900 text-white text-center py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest mb-4">
                    Fees Payment Receipt
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex justify-between items-center text-[9px] font-bold pb-2 border-b border-dashed border-slate-300">
                      <span>NO: {selectedReceipt?.receipt}</span>
                      <span>DATE: {selectedReceipt?.date}</span>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[7px] font-bold text-slate-400 uppercase">Candidate Name</span>
                        <span className="text-[11px] font-black text-slate-900 uppercase">{profile.name}</span>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <span className="text-[7px] font-bold text-slate-400 uppercase">Father's Name</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase">{profile.father}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[7px] font-bold text-slate-400 uppercase">Roll No</span>
                          <span className="text-[10px] font-black text-slate-900">{profile.rollNo}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[7px] font-bold text-slate-400 uppercase">Trade</span>
                          <span className="text-[10px] font-black text-slate-900 uppercase">{profile.trade}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5 pt-2 border-t border-slate-100">
                        <span className="text-[7px] font-bold text-slate-400 uppercase">Particulars</span>
                        <span className="text-[10px] font-bold text-slate-800 italic">{selectedReceipt?.mode}</span>
                      </div>

                      <div className="mt-6 p-4 border-2 border-slate-900 rounded-md bg-slate-50 flex flex-col items-center">
                        <span className="text-[8px] font-black uppercase text-slate-500 mb-1">Total Amount Received</span>
                        <span className="text-2xl font-black text-slate-900">₹{selectedReceipt?.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <footer className="mt-auto pt-4 flex flex-col gap-6">
                     <div className="flex justify-between items-end">
                        <div className="text-center">
                           <div className="w-20 h-[1px] bg-slate-300 mb-1"></div>
                           <p className="text-[7px] font-bold uppercase text-slate-400">Payer</p>
                        </div>
                        
                        <div className="relative flex flex-col items-center">
                           {stampUrl && (
                             <div className="absolute -top-12 -right-2 w-16 h-16 opacity-60 mix-blend-multiply rotate-[-10deg]">
                                <img src={stampUrl} alt="stamp" className="w-full h-full object-contain" />
                             </div>
                           )}
                           <div className="w-24 h-[1px] bg-slate-900 mb-1"></div>
                           <p className="text-[8px] font-black uppercase text-slate-900">Accountant</p>
                        </div>
                     </div>
                     <p className="text-center text-[6px] text-slate-400 font-medium">Maharana Pratap ITI Saharanpur.</p>
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
            position: absolute;
            left: 0;
            top: 0;
            display: block !important;
            width: 90mm !important;
            height: 200mm !important;
            border: 2px solid black !important;
            padding: 5mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
          @page {
            size: 90mm 200mm;
            margin: 0;
          }
        }
      `}</style>
    </main>
  );
}
