
"use client";

import React, { useState, useMemo } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, CreditCard, Download, Plus, Save, User, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const MOCK_FEE_DATA = [
  { id: '1', name: 'Amit Tyagi', trade: 'Electrician', total: 24000, paid: 24000, pending: 0, status: 'Full Paid' },
  { id: '2', name: 'Sonia Verma', trade: 'HSI', total: 18000, paid: 9000, pending: 9000, status: 'Partial' },
  { id: '3', name: 'Vikas Sharma', trade: 'Fitter', total: 24000, paid: 5000, pending: 19000, status: 'Pending' },
];

export default function AdminFeesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_FEE_DATA.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
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

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Fee Management</h1>
            <p className="text-muted-foreground">Manage student payments, installments, and receipts</p>
          </div>
          <Button className="gap-2"><Plus className="w-4 h-4"/> Add New Structure</Button>
        </header>

        <Card className="mb-8 border-none shadow-sm">
          <CardContent className="p-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search student by name..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2"><Filter className="w-4 h-4"/> Filters</Button>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Recent Records</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Trade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-bold">{f.name}</TableCell>
                        <TableCell>{f.trade}</TableCell>
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
                        <TableCell className="font-bold">₹{f.paid}</TableCell>
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
          </div>
        </div>

        {/* Update Fee Dialog */}
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Fee Record</DialogTitle>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="p-2 bg-primary rounded-full text-white"><User className="w-6 h-6"/></div>
                  <div>
                    <p className="font-bold">{selectedStudent.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedStudent.trade}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Payment Amount</Label>
                    <Input type="number" placeholder="Enter Amount" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Mode</Label>
                    <Input placeholder="Cash / Online / Check" />
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Current Balance Due</p>
                  <p className="text-2xl font-black text-red-600">₹{selectedStudent.pending}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleSaveFee} className="w-full gap-2"><Save className="w-4 h-4"/> Record Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
