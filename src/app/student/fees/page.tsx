
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, ArrowLeft, Download, CheckCircle2, Clock, AlertCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function StudentFeesPage() {
  const { toast } = useToast();
  
  const [feeStatus] = useState({
    total: 24000,
    paid: 12000,
    pending: 12000,
    dueDate: '2024-05-30'
  });

  const history = [
    { id: '1', date: '2023-08-15', amount: 12000, mode: 'Online', status: 'Success', receipt: 'REC-1021' },
    { id: '2', date: '2023-12-10', amount: 500, mode: 'Exam Fee', status: 'Success', receipt: 'REC-1055' },
  ];

  const handlePay = () => {
    toast({
      title: "Redirecting to Payment Gateway",
      description: "Please do not close this window...",
    });
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="font-headline text-4xl text-primary font-bold">Fee Management</h1>
              <p className="text-muted-foreground">View your academic fees and payment history</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/student/dashboard" className="gap-2"><ArrowLeft className="w-4 h-4"/> Dashboard</Link>
            </Button>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Total Fee (Session)</p>
                <p className="text-3xl font-black">₹{feeStatus.total.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-green-600 uppercase mb-1">Total Paid</p>
                <p className="text-3xl font-black text-green-700">₹{feeStatus.paid.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-amber-50">
              <CardContent className="pt-6">
                <p className="text-xs font-bold text-amber-600 uppercase mb-1">Due Amount</p>
                <p className="text-3xl font-black text-amber-700">₹{feeStatus.pending.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((h) => (
                        <TableRow key={h.id}>
                          <TableCell className="text-sm">{h.date}</TableCell>
                          <TableCell>
                            <span className="font-bold text-xs">{h.receipt}</span>
                          </TableCell>
                          <TableCell className="font-bold">₹{h.amount}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="text-primary"><Download className="w-4 h-4"/></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><CreditCard className="w-5 h-5"/> Pay Online</CardTitle>
                  <CardDescription className="text-white/80">Secure payment via UPI or Cards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p className="text-xs font-bold uppercase opacity-60">Upcoming Due</p>
                    <p className="text-xl font-bold">₹{feeStatus.pending.toLocaleString()}</p>
                    <p className="text-[10px] mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/> Due Date: {feeStatus.dueDate}</p>
                  </div>
                  <Button onClick={handlePay} className="w-full bg-white text-primary hover:bg-white/90 font-bold">Pay Now</Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardContent className="pt-6 space-y-4">
                  <h4 className="font-bold text-sm">Need Help?</h4>
                  <p className="text-xs text-muted-foreground">For any fee related discrepancy, please contact the Account Office.</p>
                  <div className="flex items-center gap-3 text-xs font-bold text-primary">
                    <Phone className="w-4 h-4" /> +91 98765 43210
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
