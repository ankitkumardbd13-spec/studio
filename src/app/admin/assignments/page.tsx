"use client";

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Calendar, Clock, Wand2, FileText, CheckCircle2, Loader2, Save, X, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAssignmentAndMockTest } from '@/ai/flows/admin-assignment-mock-test-generator';

interface Question {
  id: string;
  text: string;
  type: 'subjective' | 'objective';
  options?: string[];
  correctAnswer?: string;
}

interface Assignment {
  id: string;
  title: string;
  trade: string;
  year: number;
  deadlineDate: string;
  deadlineTime: string;
  durationMinutes: number;
  questions: Question[];
  createdAt: string;
}

export default function AdminAssignmentsPage() {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [trade, setTrade] = useState('Electrician');
  const [year, setYear] = useState('1');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_assignments');
    if (saved) setAssignments(JSON.parse(saved));
  }, []);

  const handleSaveAssignment = () => {
    if (!title || !deadlineDate || questions.length === 0) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill title, deadline and add questions.' });
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title,
      trade,
      year: parseInt(year),
      deadlineDate,
      deadlineTime,
      durationMinutes,
      questions,
      createdAt: new Date().toISOString()
    };

    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    localStorage.setItem('mpiti_assignments', JSON.stringify(updated));
    resetForm();
    setIsAdding(false);
    toast({ title: 'Assignment Created', description: 'Students can now view this on their dashboard.' });
  };

  const resetForm = () => {
    setTitle('');
    setDeadlineDate('');
    setQuestions([]);
    setDurationMinutes(60);
  };

  const handleAIInvite = async () => {
    if (!title) {
      toast({ title: 'Provide a Topic', description: 'Please enter a title/topic for AI to generate questions.' });
      return;
    }
    setLoadingAI(true);
    try {
      const result = await generateAssignmentAndMockTest({
        trade,
        year: parseInt(year),
        topic: title
      });

      const aiQuestions: Question[] = result.questions.map(q => ({
        id: Math.random().toString(),
        text: q.text,
        type: q.type,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
      
      setQuestions([...questions, ...aiQuestions]);
      toast({ title: 'AI Generation Complete', description: `Generated ${aiQuestions.length} technical questions (Minimum 20 requested).` });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate questions at this time.' });
    } finally {
      setLoadingAI(false);
    }
  };

  const addQuestion = (type: 'subjective' | 'objective') => {
    const newQ: Question = {
      id: Math.random().toString(),
      text: '',
      type,
      options: type === 'objective' ? ['', '', '', ''] : undefined
    };
    setQuestions([...questions, newQ]);
  };

  const deleteAssignment = (id: string) => {
    const updated = assignments.filter(a => a.id !== id);
    setAssignments(updated);
    localStorage.setItem('mpiti_assignments', JSON.stringify(updated));
    toast({ title: 'Deleted', description: 'Assignment removed.' });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Assignment Manager</h1>
            <p className="text-muted-foreground">Create 20+ question tests with AI and time limits</p>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
            {isAdding ? <><X className="w-4 h-4"/> Cancel</> : <><Plus className="w-4 h-4"/> New Assignment</>}
          </Button>
        </header>

        {isAdding ? (
          <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-4">
            <Card className="lg:col-span-1 border-none shadow-lg h-fit">
              <CardHeader>
                <CardTitle>Details & Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Assignment Title / Topic</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Electrical Safety Quiz" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Trade</Label>
                    <Select onValueChange={setTrade} defaultValue={trade}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electrician">Electrician</SelectItem>
                        <SelectItem value="Fitter">Fitter</SelectItem>
                        <SelectItem value="HSI">HSI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select onValueChange={setYear} defaultValue={year}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Test Duration (Minutes)</Label>
                  <div className="relative">
                    <Input type="number" value={durationMinutes} onChange={e => setDurationMinutes(parseInt(e.target.value))} className="pl-9" />
                    <Timer className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Deadline Date</Label>
                    <div className="relative">
                      <Input type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} className="pl-9" />
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Deadline Time</Label>
                    <div className="relative">
                      <Input type="time" value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)} className="pl-9" />
                      <Clock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <Separator />
                <Button onClick={handleAIInvite} disabled={loadingAI} variant="outline" className="w-full border-primary text-primary gap-2 h-12">
                  {loadingAI ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                  Generate 20 AI Questions
                </Button>
                <Button onClick={handleSaveAssignment} className="w-full bg-primary text-white gap-2 h-12">
                   <Save className="w-4 h-4" /> Save & Publish
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="font-bold text-lg">Question List ({questions.length}/20+)</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => addQuestion('subjective')}>+ Subjective</Button>
                  <Button size="sm" variant="outline" onClick={() => addQuestion('objective')}>+ MCQ</Button>
                </div>
              </div>

              {questions.map((q, idx) => (
                <Card key={q.id} className="border-none shadow-sm group">
                  <CardContent className="p-4">
                    <div className="flex justify-between gap-4 mb-4">
                      <Badge variant="secondary" className="h-fit">Q{idx + 1}: {q.type === 'objective' ? 'Objective (MCQ)' : 'Subjective'}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => setQuestions(questions.filter(item => item.id !== q.id))} className="text-red-400 h-6 w-6 p-0"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    <Textarea 
                      placeholder="Enter question text..." 
                      value={q.text} 
                      onChange={e => {
                        const updated = [...questions];
                        updated[idx].text = e.target.value;
                        setQuestions(updated);
                      }}
                      className="mb-4 min-h-[60px]"
                    />
                    {q.type === 'objective' && (
                      <div className="grid grid-cols-2 gap-3">
                        {q.options?.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-muted-foreground">{String.fromCharCode(65 + oIdx)}.</span>
                            <Input 
                              placeholder={`Option ${oIdx + 1}`} 
                              value={opt} 
                              onChange={e => {
                                const updated = [...questions];
                                if (updated[idx].options) updated[idx].options![oIdx] = e.target.value;
                                setQuestions(updated);
                              }}
                              className="h-8 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {questions.length === 0 && (
                <div className="bg-white border-2 border-dashed rounded-xl p-12 text-center opacity-40">
                  <Wand2 className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <p>No questions added yet. AI will generate 10 MCQs and 10 Theory questions.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map(a => (
              <Card key={a.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-primary/5 text-primary">{a.trade} - Year {a.year}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => deleteAssignment(a.id)} className="text-red-400 h-8 w-8 p-0"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <CardTitle className="text-xl mt-2">{a.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" /> {a.questions.length} Questions
                   </div>
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Timer className="w-4 h-4" /> Duration: {a.durationMinutes} Minutes
                   </div>
                   <div className="flex items-center gap-2 text-sm font-bold text-secondary">
                      <Calendar className="w-4 h-4" /> Deadline: {a.deadlineDate} @ {a.deadlineTime}
                   </div>
                   <Button variant="outline" className="w-full">View Submissions</Button>
                </CardContent>
              </Card>
            ))}
            {assignments.length === 0 && (
              <div className="col-span-full bg-white border-2 border-dashed rounded-xl p-20 text-center opacity-40">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>No assignments published. Click "New Assignment" to start.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
