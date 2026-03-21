"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, User, Ban, Trash2, Eye, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { Download } from 'lucide-react';
import { downloadExcel } from '@/lib/excel';

export default function StudentsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [firestore]);

  const fetchStudents = async () => {
    try {
      // Fetch both approved and blocked students so admin can unblock them if needed later
      const q = query(collection(firestore, 'students'), where('status', 'in', ['approved', 'blocked']));
      const snapshot = await getDocs(q);
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load students.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (students.length === 0) return;
    const exportData = students.map(({ photo, ...rest }) => rest);
    downloadExcel(exportData, 'students_record.xlsx', 'Students');
  };

  const handleBlock = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'blocked' ? 'approved' : 'blocked';
    try {
      await updateDoc(doc(firestore, 'students', id), { status: newStatus });
      toast({ title: newStatus === 'blocked' ? "Student Blocked" : "Student Unblocked", description: `Student is now ${newStatus}.` });
      setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: `Could not ${newStatus} student.`, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to permanently delete this student's portal registration?")) return;
    try {
      await deleteDoc(doc(firestore, 'students', id));
      toast({ title: "Deleted", description: "Student registration deleted." });
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not delete student.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Manage Students</h1>
          <p className="text-muted-foreground mt-1">View registered students, manage their portal access, or delete records.</p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={students.length === 0}><Download className="w-4 h-4 mr-2" /> Export to Excel</Button>
      </div>
      
      {students.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No approved students found.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {students.map(student => (
            <Card key={student.id} className={`overflow-hidden border-2 ${student.status === 'blocked' ? 'border-red-300 bg-red-50/50' : 'border-transparent'}`}>
              <CardHeader className="flex flex-row items-center gap-4 pb-0 pt-6">
                <div className="bg-primary/10 p-1 rounded-full border border-primary/20">
                  {student.photo ? (
                    <img src={student.photo} alt="Student" className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-slate-400" /></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    {student.status === 'blocked' && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-1 rounded tracking-wide uppercase">Blocked</span>}
                  </div>
                  <p className="text-sm text-primary font-bold">{student.trade} ({student.session})</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Roll No: {student.rollNo || 'N/A'}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-6">
                <div className="text-sm space-y-1 text-slate-600 mb-4">
                  <p><strong>Father:</strong> {student.fatherName}</p>
                  <p><strong>Mobile:</strong> {student.mobile}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                </div>
                
                <div className="flex gap-2 mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs bg-white"><Eye className="w-3 h-3 mr-1"/> View Full Profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Full Details: {student.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4 text-sm">
                         <div className="flex gap-4 items-center">
                           {student.photo && <img src={student.photo} className="w-24 h-32 object-cover rounded shadow border" alt="Profile" />}
                           <div className="space-y-1">
                             <p><strong>Roll No:</strong> {student.rollNo}</p>
                             <p><strong>Trade:</strong> {student.trade}</p>
                             <p><strong>Session:</strong> {student.session}</p>
                             <p><strong>Category:</strong> {student.category}</p>
                           </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div><Label className="text-muted-foreground text-xs">Father's Name</Label><p className="font-semibold">{student.fatherName}</p></div>
                            <div><Label className="text-muted-foreground text-xs">DOB</Label><p className="font-semibold">{student.dob}</p></div>
                            <div><Label className="text-muted-foreground text-xs">Aadhaar</Label><p className="font-semibold">{student.aadhaar}</p></div>
                            <div><Label className="text-muted-foreground text-xs">Mobile</Label><p className="font-semibold">{student.mobile}</p></div>
                            <div className="col-span-2"><Label className="text-muted-foreground text-xs">Email</Label><p className="font-semibold">{student.email}</p></div>
                         </div>
                         <hr/>
                         <div>
                           <h4 className="font-bold flex items-center gap-2 mb-2"><MapPin className="w-4 h-4"/> Address Details</h4>
                           <p><strong>State:</strong> {student.address?.state}</p>
                           <p><strong>District:</strong> {student.address?.district}</p>
                           <p><strong>Tehsil:</strong> {student.address?.tehsil}</p>
                           <p><strong>Pincode:</strong> {student.address?.pincode}</p>
                           <p className="mt-2 text-slate-700 bg-slate-100 p-2 rounded">{student.address?.fullAddress}</p>
                         </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button 
                    variant={student.status === 'blocked' ? "outline" : "secondary"}
                    size="sm" 
                    onClick={() => handleBlock(student.id, student.status)}
                    className="flex-1 text-xs"
                  >
                    <Ban className="w-3 h-3 mr-1" /> {student.status === 'blocked' ? 'Unblock' : 'Block Access'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(student.id)}
                    className="flex-1 text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
