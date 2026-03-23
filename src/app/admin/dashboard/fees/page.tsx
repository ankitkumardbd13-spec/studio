"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { collection, addDoc, getDocs, query, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { Loader2, Download, Plus, BellRing, Search } from 'lucide-react';
import { downloadExcel } from '@/lib/excel';

export default function FeesManagementPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  
  const [fees, setFees] = useState<any[]>([]);
  const [studentsCache, setStudentsCache] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [firestore]);

  useEffect(() => {
    if (studentId && studentsCache[studentId]) {
      const student = studentsCache[studentId];
      const trade = student.trade?.toLowerCase() || '';
      if (trade.includes('electrician') || trade.includes('fitter')) {
        setAmount("36000");
      } else if (trade.includes('hsi') || trade.includes('his')) {
        setAmount("18000");
      }
    }
  }, [studentId, studentsCache]);

  const fetchData = async () => {
    try {
      // Fetch students for mapping names
      const studentsQ = query(collection(firestore, 'students'));
      const stSnap = await getDocs(studentsQ);
      const sCache: Record<string, any> = {};
      stSnap.docs.forEach(d => {
        sCache[d.id] = { id: d.id, ...d.data() };
      });
      setStudentsCache(sCache);

      // Fetch fees
      const q = query(collection(firestore, 'fees'));
      const snapshot = await getDocs(q);
      const feesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          studentDetails: sCache[data.studentId] || null
        };
      });
      
      // Sort by due date normally
      setFees(feesData.sort((a: any, b: any) => {
         const tA = (a.dueDate as unknown as Timestamp)?.toMillis ? (a.dueDate as unknown as Timestamp).toMillis() : new Date(a.dueDate).getTime();
         const tB = (b.dueDate as unknown as Timestamp)?.toMillis ? (b.dueDate as unknown as Timestamp).toMillis() : new Date(b.dueDate).getTime();
         return tB - tA;
      }));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load fees data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFee = async () => {
    if (!studentId || !amount || !dueDate) {
      return toast({ title: "Incomplete", description: "Fill all fields.", variant: "destructive" });
    }
    
    setIsSaving(true);
    try {
      const newFee = {
        studentId,
        amount: parseFloat(amount),
        dueDate: dueDate,
        status: "pending",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(firestore, 'fees'), newFee);
      toast({ title: "Saved", description: "Fee record created." });
      
      setFees(prev => [{ id: docRef.id, ...newFee, studentDetails: studentsCache[studentId] }, ...prev]);
      setStudentId("");
      setAmount("");
      setDueDate("");
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create fee record.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const exportData = fees.map(f => ({
      "Fee ID": f.id,
      "Student Name": f.studentDetails?.name || f.studentId,
      "Roll No": f.studentDetails?.rollNo || "N/A",
      "Amount": f.amount,
      "Due Date": f.dueDate,
      "Status": f.status,
      "Reminder Sent": f.reminderSent ? "Yes" : "No"
    }));
    downloadExcel(exportData, 'fee_records.xlsx', 'Fees');
    toast({ title: "Downloaded", description: "Fee records exported to Excel." });
  };
  
  const handleSendReminder = async (feeId: string) => {
    try {
       await updateDoc(doc(firestore, 'fees', feeId), {
         reminderSent: true,
         updatedAt: Timestamp.now()
       });
       toast({ title: "Reminder Sent", description: "Fee reminder marked as sent." });
       setFees(prev => prev.map(f => f.id === feeId ? { ...f, reminderSent: true } : f));
    } catch (err) {
       toast({ title: "Error", description: "Could not send reminder.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Fee Management</h1>
          <p className="text-muted-foreground mt-1">Manage student fee dues, statuses, and reminders.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="flex gap-2">
          <Download className="w-4 h-4" /> Export to Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Fee Form */}
        <Card className="shadow-md border-t-4 border-t-primary h-fit lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Fee Demand</CardTitle>
            <CardDescription>Assign a fee due to a specific student.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
               <Label>Select Student</Label>
               <select 
                 className="w-full h-10 px-3 py-2 border rounded-md text-sm"
                 value={studentId} 
                 onChange={(e) => setStudentId(e.target.value)}
                 required
               >
                 <option value="">-- Select Student --</option>
                 {Object.values(studentsCache).map((s: any) => (
                   <option key={s.id} value={s.id}>
                     {s.name} ({s.rollNo || 'No Roll No'})
                   </option>
                 ))}
               </select>
               <p className="text-[10px] text-muted-foreground uppercase font-bold">UID: {studentId || 'None Selected'}</p>
            </div>
            <div className="space-y-2">
               <Label>Amount (₹)</Label>
               <Input type="number" placeholder="5000" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
               <Label>Due Date</Label>
               <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <Button onClick={handleAddFee} disabled={isSaving || !studentId} className="w-full bg-primary text-white">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Create Fee Record
            </Button>
          </CardContent>
        </Card>

        {/* Existing Fees List */}
        <Card className="shadow-md lg:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex justify-between">
              Fee Records Overview
            </CardTitle>
          </CardHeader>
          <div className="flex-1 overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                 <tr>
                   <th className="px-4 py-3">Student</th>
                   <th className="px-4 py-3">Amount</th>
                   <th className="px-4 py-3">Due Date</th>
                   <th className="px-4 py-3">Status</th>
                   <th className="px-4 py-3 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {loading ? (
                    <tr><td colSpan={5} className="text-center p-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
                 ) : fees.length === 0 ? (
                    <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">No fee records found.</td></tr>
                 ) : (
                    fees.map(f => (
                      <tr key={f.id} className="border-b hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-primary">
                          {f.studentDetails?.name || "Unknown"}
                          <div className="text-xs text-muted-foreground font-normal">{f.studentDetails?.rollNo || f.studentId}</div>
                        </td>
                        <td className="px-4 py-3">₹{f.amount}</td>
                        <td className="px-4 py-3">{f.dueDate}</td>
                        <td className="px-4 py-3">
                           <span className={`px-2 py-1 rounded text-xs font-semibold ${
                             f.status === 'paid' ? 'bg-green-100 text-green-700' :
                             f.status === 'overdue' ? 'bg-red-100 text-red-700' :
                             'bg-orange-100 text-orange-700'
                           }`}>
                             {f.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                           {f.status !== 'paid' && (
                             <Button 
                               variant="outline" 
                               size="sm" 
                               onClick={() => handleSendReminder(f.id)}
                               disabled={f.reminderSent}
                               className={`h-8 text-xs ${f.reminderSent ? 'text-green-600 border-green-200' : ''}`}
                             >
                               <BellRing className="w-3 h-3 mr-1" /> {f.reminderSent ? 'Sent' : 'Remind'}
                             </Button>
                           )}
                        </td>
                      </tr>
                    ))
                 )}
               </tbody>
             </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
