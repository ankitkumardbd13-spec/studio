"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { collection, query, getDocs, orderBy, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { Loader2, Download, FileText, User, Calendar, BookOpen, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

export default function ManualSubmissionsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [firestore]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const q = query(collection(firestore, 'manual_submissions'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load submissions.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission record?")) return;
    try {
      await deleteDoc(doc(firestore, 'manual_submissions', id));
      setSubmissions(prev => prev.filter(s => s.id !== id));
      toast({ title: "Deleted", description: "Submission record removed." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to delete submission.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Manual Assignment Submissions</h1>
        <p className="text-muted-foreground mt-1">Review files uploaded by students for their assignments.</p>
      </div>

      {submissions.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No submissions found yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((sub) => (
            <Card key={sub.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{sub.studentName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <User className="w-3 h-3" /> Roll: {sub.rollNo} | Trade: {sub.trade}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          <BookOpen className="w-3 h-3" /> {sub.subject}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <Calendar className="w-3 h-3" /> 
                          {sub.timestamp ? format(sub.timestamp.toDate(), 'PPP p') : 'No Date'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none gap-2 h-10" asChild>
                      <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" /> View File
                      </a>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(sub.id)} className="h-10 w-10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {sub.fileName && (
                  <p className="mt-4 text-xs text-muted-foreground border-t pt-2 italic">
                    File Name: {sub.fileName}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
