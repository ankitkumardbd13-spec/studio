
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, CreditCard, Download, Plus, Save, User, CheckCircle2, Clock, Receipt, Calculator, Printer, History, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  { 
    id: '3', 
    name: 'Vikas Sharma', 
    fatherName: 'Shri OP Sharma', 
    rollNo: '2023/FIT/045', 
    trade: 'Fitter', 
    total: 24000, 
    paid: 5000, 
    pending: 19000, 
    status: 'Pending',
    history: [
      { id: 'h4', date: '2023-08-20', amount: 5000, mode: 'Cash', particulars: 'Registration Fee', receiptNo: 'REC-2023-112' }
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
  
  // New Payment Form State
  const [payAmount, setPayAmount] = useState('');
  const [payMode, setPayMode] = useState('Cash');
  const [payParticulars, setPayParticulars] = useState('Tuition Fee');

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
    toast({
      title: "Payment Recorded",
      description: `Receipt ${newPayment.receiptNo} generated for ${selectedStudent.name}.`,
    });
  };

  const handlePrintReceipt = (payment: PaymentRecord) => {
    toast({
      title: "Generating Receipt",
      description: `Downloading Receipt ${payment.receiptNo} as PDF...`,
    });
  };

  const exportFeeReport = () => {
    const headers = ["Name", "Father Name", "Roll No", "Trade", "Total Fee", "Paid", "Pending", "Status"];
    const rows = filteredData.map(f => [
      `"${f.name}"`, `"${f.fatherName}"`, `"${f.rollNo}"`, `"${f.trade}"`, f.total, f.paid, f.pending, f.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Fee_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Report Exported", description: "Detailed fee status saved to CSV." });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Fee Management</h1>
            <p className="text-muted-foreground">Manage student payments, installments, and receipts</p>
          </div>
          <div className="flex gap-3">
             <Button onClick={() => setIsStructureOpen(true)} variant="outline" className="gap-2 border-primary text-primary">
               <Plus className="w-4 h-4"/> New Fee Structure
             </Button>
             <Button onClick={exportFeeReport} className="gap-2 bg-primary text-white">
               <Download className="w-4 h-4"/> Detailed Report
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
                            <p className="text-[10px] text-muted-foreground font-medium">F/N: {f.fatherName}</p>
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
                    <span className="text-sm opacity-70">Total Receivable</span>
                    <span className="font-bold">₹10,80,000</span>
                 </div>
                 <div className="flex justify-between items-center text-green-400">
                    <span className="text-sm">Collected</span>
                    <span className="font-bold">₹7,20,000</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[66%]"></div>
                 </div>
                 <p className="text-[10px] text-white/50 text-center">Last Updated: Just Now</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
               <CardContent className="pt-6">
                  <h4 className="font-bold text-sm mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast({ title: "Bulk Receipts", description: "Processing 45 pending receipts for print queue..." })}>
                      <Receipt className="w-3 h-3 mr-2" /> Bulk Receipt Print
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-xs" onClick={() => toast({ title: "Waiver Tool", description: "Select students to apply late fee waivers." })}>
                      <Calculator className="w-3 h-3 mr-2" /> Late Fee Waiver
                    </Button>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Structure Dialog */}
        <Dialog open={isStructureOpen} onOpenChange={setIsStructureOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Fee Structure</DialogTitle>
              <DialogDescription>Define base fees for a specific trade and session.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label>Trade / Course</Label>
                 <Input placeholder="e.g. Electrician 2024-26" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Admission Fee</Label>
                   <Input type="number" placeholder="₹" />
                 </div>
                 <div className="space-y-2">
                   <Label>Tuition Fee (Annual)</Label>
                   <Input type="number" placeholder="₹" />
                 </div>
               </div>
               <DialogFooter>
                 <Button className="w-full" onClick={() => { setIsStructureOpen(false); toast({ title: "Structure Created" }); }}>Create Academic Structure</Button>
               </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Manage Fee & History Dialog */}
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Payment Management</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <Tabs defaultValue="record" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="record" className="gap-2"><CreditCard className="w-4 h-4"/> Record Payment</TabsTrigger>
                  <TabsTrigger value="history" className="gap-2"><History className="w-4 h-4"/> Payment History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="record" className="space-y-6 py-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border">
                    <div className="p-3 bg-primary rounded-full text-white"><User className="w-6 h-6"/></div>
                    <div>
                      <p className="font-bold text-slate-900">{selectedStudent.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">Roll No: {selectedStudent.rollNo}</p>
                      <p className="text-[10px] text-muted-foreground">F/N: {selectedStudent.fatherName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount Received (₹)</Label>
                      <Input type="number" placeholder="0.00" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Mode</Label>
                      <Input placeholder="Cash / UPI / Check" value={payMode} onChange={e => setPayMode(e.target.value)} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Particulars (Payment Note)</Label>
                      <Input placeholder="e.g. Sem 2 Tuition Fee" value={payParticulars} onChange={e => setPayParticulars(e.target.value)} />
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Balance Due</p>
                      <p className="text-2xl font-black text-red-700">₹{selectedStudent.pending}</p>
                    </div>
                    <Button onClick={handleSavePayment} className="gap-2 bg-green-600 hover:bg-green-700 text-white h-12">
                      <Save className="w-4 h-4"/> Confirm Payment
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="py-4">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Particulars</TableHead>
                          <TableHead className="text-right">Receipt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStudent.history.length > 0 ? (
                          selectedStudent.history.map((h: any) => (
                            <TableRow key={h.id}>
                              <TableCell className="text-xs">{h.date}</TableCell>
                              <TableCell className="font-bold">₹{h.amount}</TableCell>
                              <TableCell className="text-xs">{h.particulars}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-primary gap-1 h-7 text-[10px]" onClick={() => handlePrintReceipt(h)}>
                                  <Printer className="w-3 h-3"/> Print
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">No old history found.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
