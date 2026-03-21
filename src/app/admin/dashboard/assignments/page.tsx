"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { Loader2, Download, Plus, Bot, Clock, CalendarDays, BookOpen, FileText } from 'lucide-react';
import { downloadExcel } from '@/lib/excel';
import { generateQuestionsTarget } from './actions';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function AssignmentsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [timerMinutes, setTimerMinutes] = useState("30");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionsPreview, setQuestionsPreview] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, [firestore]);

  const fetchAssignments = async () => {
    try {
      const q = query(collection(firestore, 'assignments'));
      const snapshot = await getDocs(q);
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load assignments.", variant: "destructive" });
    } finally {
      setLoadingAssignments(false);
    }
  };

  const handleGenerate = async () => {
    if (!subject || !topic) {
      return toast({ title: "Missing Fields", description: "Please enter Subject and Topic.", variant: "destructive" });
    }
    const safeTitle = title || `${subject} - ${topic} Mock Test`;
    setTitle(safeTitle);
    
    setIsGenerating(true);
    setQuestionsPreview([]);
    
    const res = await generateQuestionsTarget(subject, topic);
    setIsGenerating(false);
    
    if (res.success && res.questions) {
      setQuestionsPreview(res.questions);
      toast({ title: "Generated", description: `Successfully generated ${res.questions.length} questions.` });
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!title || !lastDate || !timerMinutes || questionsPreview.length === 0) {
      return toast({ title: "Incomplete", description: "Generate questions and fill all fields before saving.", variant: "destructive" });
    }
    
    setIsSaving(true);
    try {
      const newAssignment = {
        title,
        subject,
        topic,
        lastDate,
        timerMinutes: parseInt(timerMinutes),
        questions: questionsPreview,
        createdAt: Timestamp.now()
      };
      const docRef = await addDoc(collection(firestore, 'assignments'), newAssignment);
      toast({ title: "Saved", description: "Assignment published successfully!" });
      setAssignments(prev => [{ id: docRef.id, ...newAssignment }, ...prev]);
      
      // Reset form
      setSubject("");
      setTopic("");
      setTitle("");
      setLastDate("");
      setTimerMinutes("30");
      setQuestionsPreview([]);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save assignment.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteDoc(doc(firestore, 'assignments', id));
      setAssignments(prev => prev.filter(a => a.id !== id));
      toast({ title: "Deleted", description: "Assignment deleted." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const handleDownloadResults = async (assignment: any) => {
    try {
      toast({ title: "Generating Export", description: "Fetching student results..." });
      const q = query(collection(firestore, 'results'), where('assignmentId', '==', assignment.id));
      const snapshot = await getDocs(q);
      
      const resultsData = await Promise.all(snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        // Fetch student details
        let studentName = "Unknown";
        let fatherName = "Unknown";
        let rollNo = "Unknown";
        try {
          // If we stored student details in the students collection
          const studentQ = query(collection(firestore, 'students'), where('__name__', '==', data.studentId));
          const stSnap = await getDocs(studentQ);
          if (!stSnap.empty) {
            const stData = stSnap.docs[0].data();
            studentName = stData.name || "";
            fatherName = stData.fatherName || "";
            rollNo = stData.rollNo || "";
          }
        } catch (_) {}
        
        return {
          "Student ID": data.studentId,
          "Student Name": studentName,
          "Father Name": fatherName,
          "Roll No": rollNo,
          "Assignment": assignment.title,
          "Attempted": data.total,
          "Right Questions": data.score,
          "Wrong Questions": data.total - data.score,
          "Final Result": data.score,
          "Percentage": data.percentage + "%",
          "Status": data.passStatus
        };
      }));
      
      if (resultsData.length === 0) {
        return toast({ title: "No Submissions", description: "No student has submitted this assignment yet." });
      }
      
      downloadExcel(resultsData, `results_${assignment.title.replace(/\s+/g, '_')}.xlsx`, 'Results');
      toast({ title: "Downloaded", description: "Results exported to Excel." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to export results.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Assignments & Tests</h1>
          <p className="text-muted-foreground mt-1">Create and manage objective tests for students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Assignment Form */}
        <Card className="shadow-md border-t-4 border-t-primary h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5"/> AI-Powered Generator</CardTitle>
            <CardDescription>Generate 30 objective questions based on a subject and topic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <Label>Subject / Trade</Label>
                 <Input placeholder="e.g. Electrician" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                 <Label>Topic</Label>
                 <Input placeholder="e.g. Basic Wiring" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
            </div>
            
            <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !subject || !topic} 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary/5"
            >
              {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating AI Questions...</> : <><Bot className="w-4 h-4 mr-2" /> Generate 30 Questions (Gemini)</>}
            </Button>
            
            {questionsPreview.length > 0 && (
              <div className="pt-4 mt-4 border-t space-y-4">
                <div className="space-y-2">
                   <Label>Assignment Title</Label>
                   <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Last Submission Date</Label>
                     <Input type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                     <Label>Timer (Minutes)</Label>
                     <Input type="number" value={timerMinutes} onChange={(e) => setTimerMinutes(e.target.value)} />
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full bg-slate-50 p-2 rounded border">
                  <AccordionItem value="preview" className="border-none">
                    <AccordionTrigger className="text-sm font-semibold p-2 hover:no-underline"><span className="flex items-center gap-2"><FileText className="w-4 h-4"/>Preview {questionsPreview.length} Questions</span></AccordionTrigger>
                    <AccordionContent className="p-2 space-y-4 max-h-64 overflow-y-auto">
                      {questionsPreview.map((q, i) => (
                        <div key={i} className="text-sm space-y-1 pb-3 border-b last:border-0">
                          <p className="font-semibold">{i+1}. {q.question}</p>
                          <ul className="list-disc pl-5 text-slate-600">
                            {q.options.map((opt: string, j: number) => (
                              <li key={j} className={j === q.correctAnswerIndex ? 'text-green-600 font-bold' : ''}>{opt}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button onClick={handleSave} disabled={isSaving || !title || !lastDate} className="w-full h-11 bg-primary text-white">
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Publish to Students
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Assignments List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2 flex items-center gap-2"><BookOpen className="w-5 h-5"/> Created Assignments</h2>
          
          {loadingAssignments ? (
             <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : assignments.length === 0 ? (
            <p className="text-muted-foreground text-center p-8 bg-slate-50 rounded border border-dashed">No assignments created yet.</p>
          ) : (
             <div className="grid gap-4">
               {assignments.map(item => (
                 <Card key={item.id}>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg flex justify-between">
                        {item.title}
                        <span className="text-sm font-normal text-muted-foreground bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1"><Clock className="w-3 h-3"/> {item.timerMinutes} min</span>
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center gap-4">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {item.subject}</span>
                        <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Due: {item.lastDate}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 flex gap-2">
                       <Button variant="outline" size="sm" onClick={() => handleDownloadResults(item)} className="flex-1 text-xs h-8">
                         <Download className="w-3 h-3 mr-1" /> Student Results (Excel)
                       </Button>
                       <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="text-xs h-8 px-3">Delete</Button>
                    </CardContent>
                 </Card>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
