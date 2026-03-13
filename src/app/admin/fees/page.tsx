"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, CreditCard, Download, Plus, User, History, Printer, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  mode: string;
  particulars: string;
  receiptNo: string;
}

const INITIAL_MOCK_FEE_DATA = [
  { 
    id: '1', 
    name: 'Amit Tyagi', 
    fatherName: 'Shri Ram Tyagi', 
    rollNo: '2024/ELEC/001', 
    trade: 'Electrician', 
    total: 24000, 
    paid: 24000, 
    pending: 0, 
    status: 'Full Paid',
    history: [
      { id: 'h1', date: '2024-01-10', amount: 12000, mode: 'UPI', particulars: 'Admission Fee', receiptNo: 'REC-2024-001' },
      { id: 'h2', date: '2024-06-15', amount: 12000, mode: 'Cash', particulars: 'Tuition Fee Sem 1', receiptNo: 'REC-2024-045' }
    ]
  },
  { 
    id: '2', 
    name: 'Sonia Verma', 
    fatherName: 'Shri KL Verma', 
    rollNo: '2024/HSI/012', 
    trade: 'HSI', 
    total: 18000, 
    paid: 9000, 
    pending: 9000, 
    status: 'Partial',
    history: [
      { id: 'h3', date: '2024-02-05', amount: 9000, mode: 'UPI', particulars: 'Admission Fee', receiptNo: 'REC-2024-012' }
    ]
  },
];

export default function AdminFeesPage() {
  const { toast } = useToast();
  const [feeData, setFeeData] = useState(INITIAL_MOCK_FEE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isStructureOpen, setIsStructureOpen] = useState(false);
  
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('Cash');
  const [payParticulars, setPayParticulars] = useState('Tuition Fee');

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_site_settings');
    if (saved) setSiteSettings(JSON.parse(saved));
  }, []);

  const logoUrl = siteSettings?.logo || PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;
  const stampUrl = siteSettings?.stamp || PlaceHolderImages.find(img => img.id === 'iti-stamp')?.imageUrl;

  const filteredData = useMemo(() => {
    return feeData.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, feeData]);

  const handleManageFee = (student: any) => {
    setSelectedStudent(student);
    setIsUpdateOpen(true);
  };

  const handleSavePayment = () => {
    if (!payAmount || parseInt(payAmount) <= 0) {
      toast({ variant: 'destructive', title: "Invalid Amount", description: "Please enter a valid payment amount." });
      return;
    }

    const amount = parseInt(payAmount);
    const newPayment: PaymentRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      mode: payMode,
      particulars: payParticulars,
      receiptNo: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    const updatedData = feeData.map(student => {
      if (student.id === selectedStudent.id) {
        const newPaid = student.paid + amount;
        const newPending = student.total - newPaid;
        return {
          ...student,
          paid: newPaid,
          pending: newPending,
          status: newPending <= 0 ? 'Full Paid' : newPaid > 0 ? 'Partial' : 'Pending',
          history: [newPayment, ...student.history]
        };
      }
      return student;
    });

    setFeeData(updatedData);
    setPayAmount('');
    toast({ title: "Payment Recorded", description: `Receipt ${newPayment.receiptNo} generated.` });
  };

  const openReceipt = (payment: PaymentRecord) => {
    setSelectedReceipt(payment);
    setIsReceiptOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const ReceiptCard = ({ payment }: { payment: any }) => (
    <div className="receipt-slip bg-white border border-slate-900 p-8 w-[21cm] h-[9cm] overflow-hidden flex flex-col relative shrink-0">
      {/* LOGO ONLY AS WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none grayscale">
        {logoUrl && <img src={logoUrl} alt="watermark" className="w-[12cm] h-[12cm] object-contain" />}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <header className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h2 className="text-3xl font-black text-slate-900 uppercase leading-none tracking-tight mb-1">Maharana Pratap ITI Saharanpur</h2>
          <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">OFFICIAL FEE RECEIPT - {payment?.receiptNo || payment?.receipt}</p>
        </header>

        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mt-2">
          <div className="flex flex-col border-b border-slate-200 pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Name</span>
            <span className="text-xl font-bold text-slate-900 uppercase">{selectedStudent?.name}</span>
          </div>
          <div className="flex flex-col border-b border-slate-200 pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Father's Name</span>
            <span className="text-xl font-bold text-slate-800 uppercase">{selectedStudent?.fatherName}</span>
          </div>
          <div className="flex flex-col border-b border-slate-200 pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Roll / Registration No.</span>
            <span className="text-lg font-bold text-slate-900">{selectedStudent?.rollNo}</span>
          </div>
          <div className="flex flex-col border-b border-slate-200 pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Date</span>
            <span className="text-lg font-bold text-slate-900">{payment?.date}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Description / Particulars</span>
            <span className="text-lg font-bold text-slate-700 italic">{payment?.particulars || payment?.mode}</span>
          </div>
          <div className="bg-slate-900 text-white px-8 py-4 rounded-lg flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold opacity-60 mb-1">Amount Paid</span>
            <span className="text-4xl font-black">₹{payment?.amount.toLocaleString()}</span>
          </div>
        </div>

        <footer className="mt-auto flex justify-between items-end pt-4">
          <div className="text-[10px] text-slate-400 font-medium">
            <p>Maharana Pratap ITI, Near Delhi Road, Saharanpur, UP</p>
            <p>This is a computer-generated receipt.</p>
          </div>
          <div className="relative flex flex-col items-center">
            {stampUrl && (
              <div className="absolute -top-16 -right-4 w-28 h-28 opacity-40 mix-blend-multiply rotate-[-12deg] pointer-events-none">
                <img src={stampUrl} alt="stamp" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="w-48 h-[1px] bg-slate-900 mb-2"></div>
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Authorized Signatory</p>
          </div>
        </footer>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 print:hidden">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Fee Management</h1>
            <p className="text-muted-foreground">Print 3 standard DL slips (21cm x 9cm) vertically on A4 paper</p>
          </div>
          <div className="flex gap-3">
             <Button onClick={() => setIsStructureOpen(true)} variant="outline" className="gap-2 border-primary text-primary">
               <Plus className="w-4 h-4"/> New Fee Structure
             </Button>
          </div>
        </header>

        <Card className="mb-8 border-none shadow-sm">
          <CardContent className="p-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by Name or Roll Number..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2"><Filter className="w-4 h-4"/> Filter Trade</Button>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Academic Fee Ledger</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Details</TableHead>
                      <TableHead>Trade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell>
                          <div>
                            <p className="font-bold text-slate-900">{f.name}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">Roll: {f.rollNo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] border-primary text-primary">{f.trade}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              f.status === 'Full Paid' ? 'bg-green-50 text-green-600 border-green-200' :
                              f.status === 'Partial' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                              'bg-red-50 text-red-600 border-red-200'
                            }
                          >
                            {f.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">₹{f.total}</TableCell>
                        <TableCell className="font-bold text-green-600">₹{f.paid}</TableCell>
                        <TableCell className="font-bold text-red-600">₹{f.pending}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="text-primary font-bold" onClick={() => handleManageFee(f)}>Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Collection Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm opacity-70">Collected</span>
                    <span className="font-bold">₹7,20,000</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[66%]"></div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Payment Management</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <Tabs defaultValue="record" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="record" className="gap-2"><CreditCard className="w-4 h-4"/> Record Payment</TabsTrigger>
                  <TabsTrigger value="history" className="gap-2"><History className="w-4 h-4"/> History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="record" className="space-y-6 py-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border">
                    <div className="p-3 bg-primary rounded-full text-white"><User className="w-6 h-6"/></div>
                    <div>
                      <p className="font-bold text-slate-900">{selectedStudent.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Roll: {selectedStudent.rollNo}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount Received (₹)</Label>
                      <Input type="number" placeholder="0.00" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Mode</Label>
                      <Input placeholder="Cash / UPI" value={payMode} onChange={e => setPayMode(e.target.value)} />
                    </div>
                  </div>
                  <Button onClick={handleSavePayment} className="w-full bg-green-600 hover:bg-green-700 text-white h-12">Confirm Payment</Button>
                </TabsContent>

                <TabsContent value="history" className="py-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.history.map((h: any) => (
                          <TableRow key={h.id}>
                            <TableCell className="text-xs">{h.date}</TableCell>
                            <TableCell className="font-bold">₹{h.amount}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-primary gap-1" onClick={() => openReceipt(h)}>
                                <Printer className="w-3 h-3"/> View Slip
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </main>

      {/* 3-Slip Stacking Container */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-[22cm] p-0 border-none bg-transparent shadow-none">
          <div className="bg-white p-6 rounded-xl shadow-2xl print:shadow-none print:p-0 flex flex-col items-center">
             <div className="flex justify-between items-center w-full mb-4 print:hidden">
               <DialogTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Print Preview (3 Slips / Full A4 Width)</DialogTitle>
               <div className="flex gap-2">
                 <Button onClick={handlePrint} size="sm" className="gap-2 bg-primary h-8"><Printer className="w-3 h-3"/> Print All</Button>
                 <Button onClick={() => setIsReceiptOpen(false)} variant="ghost" size="icon" className="h-8 w-8"><X className="w-4 h-4"/></Button>
               </div>
             </div>
             
             {/* Receipts Wrapper for Printing */}
             <div id="receipts-wrapper" className="flex flex-col items-center">
                <ReceiptCard payment={selectedReceipt} />
                <ReceiptCard payment={selectedReceipt} />
                <ReceiptCard payment={selectedReceipt} />
             </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
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
            display: flex !important;
            flex-direction: column !important;
            width: 21cm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .receipt-slip {
            width: 21cm !important;
            height: 9cm !important;
            border-bottom: 1px dashed #ccc !important;
            margin: 0 !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
