"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, CheckCircle, XCircle, User, MapPin, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { Download } from 'lucide-react';
import { downloadExcel } from '@/lib/excel';

export default function ApprovalsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStudents();
  }, [firestore]);

  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const q = query(collection(firestore, 'students'), where('status', '==', 'pending'));
      const snapshot = await getDocs(q);
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load pending registrations.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (students.length === 0) return;
    const exportData = students.map(({ photo, ...rest }) => rest);
    downloadExcel(exportData, 'pending_approvals.xlsx', 'Approvals');
  };

  const handleApprove = async (id: string, name: string) => {
    try {
      await updateDoc(doc(firestore, 'students', id), { status: 'approved' });
      toast({ title: "Approved", description: `${name} has been approved and can now login.` });
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not approve student.", variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    if(!confirm("Are you sure you want to reject this registration? It cannot be undone.")) return;
    try {
      // Just delete the doc for a clean rejection or mark 'rejected'
      await deleteDoc(doc(firestore, 'students', id));
      toast({ title: "Rejected", description: "Registration rejected and data removed." });
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not reject student.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Pending Portal Registrations</h1>
          <p className="text-muted-foreground mt-1">Review new student signups for portal access.</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={students.length === 0}><Download className="w-4 h-4 mr-2" /> Export to Excel</Button>
      </div>
      
      {students.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground"><CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />No pending approvals at the moment.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {students.map(student => (
            <Card key={student.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className="bg-slate-100 p-6 flex flex-col items-center justify-center min-w-[150px] border-r border-slate-200">
                    {student.photo ? (
                      <img src={student.photo} alt={student.name} className="w-20 h-24 object-cover rounded shadow mb-3" />
                    ) : (
                      <div className="w-20 h-24 bg-slate-300 rounded shadow mb-3 flex items-center justify-center"><User className="text-white w-8 h-8" /></div>
                    )}
                    <span className="text-xs font-bold text-slate-500">{student.rollNo || 'No Roll No'}</span>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-xl text-primary">{student.name}</h3>
                    <p className="text-sm font-semibold mt-1">Trade: {student.trade} | Session: {student.session}</p>
                    <div className="mt-3 text-sm text-slate-600 space-y-1">
                      <p><strong>Father:</strong> {student.fatherName} | <strong>Mobile:</strong> {student.mobile}</p>
                      <p><strong>Email:</strong> {student.email} | <strong>Aadhaar:</strong> {student.aadhaar}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 flex flex-col gap-3 justify-center min-w-[200px] border-l border-slate-100">
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start gap-2 bg-white"><Eye className="w-4 h-4"/> View Address Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Full Details: {student.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4 text-sm">
                           <div className="grid grid-cols-2 gap-4">
                              <div><Label className="text-muted-foreground text-xs">Category</Label><p className="font-semibold">{student.category}</p></div>
                              <div><Label className="text-muted-foreground text-xs">DOB</Label><p className="font-semibold">{student.dob}</p></div>
                              <div><Label className="text-muted-foreground text-xs">Aadhaar</Label><p className="font-semibold">{student.aadhaar}</p></div>
                              <div><Label className="text-muted-foreground text-xs">WhatsApp</Label><p className="font-semibold text-green-600">{student.whatsApp || 'N/A'}</p></div>
                              <div><Label className="text-muted-foreground text-xs">Email</Label><p className="font-semibold">{student.email}</p></div>
                           </div>
                           <hr/>
                           <div>
                             <h4 className="font-bold flex items-center gap-2 mb-2"><MapPin className="w-4 h-4"/> Address Book</h4>
                             <p><strong>State:</strong> {student.address?.state}</p>
                             <p><strong>District:</strong> {student.address?.district}</p>
                             <p><strong>Tehsil:</strong> {student.address?.tehsil}</p>
                             <p><strong>Pincode:</strong> {student.address?.pincode}</p>
                             <p className="mt-2 text-slate-700 bg-slate-100 p-2 rounded">{student.address?.fullAddress}</p>
                           </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button onClick={() => handleApprove(student.id, student.name)} className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
                      <CheckCircle className="w-4 h-4" /> Approve Login
                    </Button>
                    <Button variant="destructive" onClick={() => handleReject(student.id)} className="w-full gap-2">
                      <XCircle className="w-4 h-4" /> Reject & Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
