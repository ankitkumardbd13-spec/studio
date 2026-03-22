"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { Loader2, Plus, Trash2, BookOpen, BookMarked } from 'lucide-react';

export default function CoursesPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  // Form state
  const [trade, setTrade] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');
  const [hours, setHours] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // List state
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSyllabus();
  }, [firestore]);

  const fetchSyllabus = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, 'syllabus'));
      setSyllabus(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load syllabus.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!trade || !moduleTitle || !moduleDesc || !hours) {
      return toast({ title: 'Incomplete', description: 'Please fill all fields.', variant: 'destructive' });
    }
    setIsSaving(true);
    try {
      const newItem = { trade, moduleTitle, moduleDesc, hours: parseInt(hours), createdAt: Timestamp.now() };
      const ref = await addDoc(collection(firestore, 'syllabus'), newItem);
      setSyllabus(prev => [{ id: ref.id, ...newItem }, ...prev]);
      toast({ title: 'Saved', description: 'Syllabus module added.' });
      setTrade(''); setModuleTitle(''); setModuleDesc(''); setHours('');
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this syllabus module?')) return;
    try {
      await deleteDoc(doc(firestore, 'syllabus', id));
      setSyllabus(prev => prev.filter(s => s.id !== id));
      toast({ title: 'Deleted', description: 'Module removed.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    }
  };

  // Group by trade
  const grouped = syllabus.reduce((acc: Record<string, any[]>, item) => {
    acc[item.trade] = acc[item.trade] || [];
    acc[item.trade].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Syllabus & Courses</h1>
        <p className="text-muted-foreground mt-1">Manage trade-wise syllabus modules visible to students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Module Form */}
        <Card className="shadow-md border-t-4 border-t-primary h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Add Syllabus Module</CardTitle>
            <CardDescription>Add a topic/module to a trade's syllabus.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trade</Label>
              <select
                className="w-full h-10 px-3 py-2 border rounded-md text-sm"
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
              >
                <option value="">-- Select Trade --</option>
                <option value="Electrician">Electrician</option>
                <option value="Fitter">Fitter</option>
                <option value="HSI">HSI</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Module / Topic Title</Label>
              <Input placeholder="e.g. Basic Electricity" value={moduleTitle} onChange={e => setModuleTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Brief description of the topic" value={moduleDesc} onChange={e => setModuleDesc(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Hours</Label>
              <Input type="number" placeholder="e.g. 40" value={hours} onChange={e => setHours(e.target.value)} />
            </div>
            <Button onClick={handleAdd} disabled={isSaving} className="w-full bg-primary text-white">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Add Module
            </Button>
          </CardContent>
        </Card>

        {/* Modules List */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border border-dashed text-center">
              <BookMarked className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No syllabus modules yet.</p>
              <p className="text-slate-400 text-sm">Add modules using the form on the left.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([tradeName, modules]) => (
              <Card key={tradeName} className="shadow-sm">
                <CardHeader className="bg-primary/5 pb-3">
                  <CardTitle className="flex items-center gap-2 text-primary text-lg">
                    <BookOpen className="w-5 h-5" /> {tradeName}
                    <span className="ml-auto text-sm font-normal text-muted-foreground">{modules.length} modules</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {modules.map((mod, i) => (
                    <div key={mod.id} className={`flex items-start gap-4 p-4 ${i !== modules.length - 1 ? 'border-b' : ''}`}>
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-sm">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{mod.moduleTitle}</p>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{mod.moduleDesc}</p>
                        <p className="text-xs text-primary font-semibold mt-1">{mod.hours} Hours</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
                        onClick={() => handleDelete(mod.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
