
"use client";

import React, { useState, useMemo } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, CreditCard, Download, Plus, Save, User, CheckCircle2, Clock, Receipt, Calculator } from 'lucide-react';
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

const MOCK_FEE_DATA = [
  { id: '1', name: 'Amit Tyagi', fatherName: 'Shri Ram Tyagi', rollNo: '2024/ELEC/001', trade: 'Electrician', total: 24000, paid: 24000, pending: 0, status: 'Full Paid' },
  { id: '2', name: 'Sonia Verma', fatherName: 'Shri KL Verma', rollNo: '2024/HSI/012', trade: 'HSI', total: 18000, paid: 9000, pending: 9000, status: 'Partial' },
  { id: '3', name: 'Vikas Sharma', fatherName: 'Shri OP Sharma', rollNo: '2023/FIT/045', trade: 'Fitter', total: 24000, paid: 5000, pending: 19000, status: 'Pending' },
];

export default function AdminFeesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isStructureOpen, setIsStructureOpen] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_FEE_DATA.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleUpdateFee = (student: any) => {
    setSelectedStudent(student);
    setIsUpdateOpen(true);
  };

  const handleSaveFee = () => {
    setIsUpdateOpen(false);
    toast({
      title: "Fee Record Updated",
      description: `Payment recorded for ${selectedStudent.name}.`,
    });
  };

  const handleSaveStructure = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStructureOpen(false);
    toast({
      title: "Fee Structure Saved",
      description: "New academic fee structure has been applied to the trade.",
    });
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
          <Button onClick={() => setIsStructureOpen(true)} className="gap-2 bg-secondary hover:bg-secondary/90 text-white">
            <Plus className="w-4 h-4"/> Create New Fee Structure
          </Button>
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
            <Button variant="outline" className="gap-2"><Filter className="w-4 h-4"/> Filters</Button>
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
                            <p className="text-[10px] text-muted-foreground font-bold">Roll: {f.rollNo}</p>
                            <p className="text-[10px] text-muted-foreground">F/N: {f.fatherName}</p>
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
                          <Button size="sm" variant="ghost" className="text-primary font-bold" onClick={() => handleUpdateFee(f)}>Manage</Button>
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
                 <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10 mt-4"><Download className="w-4 h-4 mr-2"/> Detailed Report</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
               <CardContent className="pt-6">
                  <h4 className="font-bold text-sm mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-xs"><Receipt className="w-3 h-3 mr-2" /> Bulk Receipt Print</Button>
                    <Button variant="outline" className="w-full justify-start text-xs"><Calculator className="w-3 h-3 mr-2" /> Late Fee Waiver</Button>
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
            <form onSubmit={handleSaveStructure} className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label>Trade / Course</Label>
                 <Input placeholder="e.g. Electrician 2024-26" required />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Admission Fee</Label>
                   <Input type="number" placeholder="₹" required />
                 </div>
                 <div className="space-y-2">
                   <Label>Tuition Fee (Annual)</Label>
                   <Input type="number" placeholder="₹" required />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label>Examination Fee</Label>
                 <Input type="number" placeholder="₹" />
               </div>
               <DialogFooter>
                 <Button type="submit" className="w-full">Create Academic Structure</Button>
               </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Update Fee Dialog */}
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="p-2 bg-primary rounded-full text-white"><User className="w-6 h-6"/></div>
                  <div>
                    <p className="font-bold text-slate-900">{selectedStudent.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold">Roll No: {selectedStudent.rollNo}</p>
                    <p className="text-[10px] text-muted-foreground">F/N: {selectedStudent.fatherName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount Received</Label>
                    <Input type="number" placeholder="Enter Amount" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Mode</Label>
                    <Input placeholder="Cash / UPI / Check" />
                  </div>
                </div>

                <div className="p-4 bg-red-50 border-2 border-dashed border-red-200 rounded-lg text-center">
                  <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Balance Amount Due</p>
                  <p className="text-3xl font-black text-red-700">₹{selectedStudent.pending}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleSaveFee} className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4"/> Confirm & Generate Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
