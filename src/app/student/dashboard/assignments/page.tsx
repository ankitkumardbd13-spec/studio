"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Download, PlayCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudent } from '@/hooks/use-student';
import { useFirestore } from '@/firebase/provider';
import { collection, query, getDocs, addDoc, where, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/image-compress';

export default function StudentAssignmentsPage() {
  const student = useStudent();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});
  const [manualSubmissions, setManualSubmissions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // Test Taking State
  const [activeTest, setActiveTest] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      fetchData();
    }
  }, [student, firestore]);

  useEffect(() => {
    let timer: any;
    if (activeTest && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest(); // Auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTest, timeLeft]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const qA = query(collection(firestore, 'assignments'));
      const snapA = await getDocs(qA);
      const allAssignments = snapA.docs.map(d => ({ id: d.id, ...d.data() }));

      // Fetch Results/Test Scores for this student
      const qR = query(collection(firestore, 'results'), where('studentId', '==', student?.id));
      const snapR = await getDocs(qR);
      const resultsMap: Record<string, any> = {};
      snapR.docs.forEach(d => {
        const data = d.data();
        resultsMap[data.assignmentId] = data;
      });

      // Fetch Manual Submissions for this student
      const qM = query(collection(firestore, 'manual_submissions'), where('studentId', '==', student?.id));
      const snapM = await getDocs(qM);
      const manualMap: Record<string, any> = {};
      snapM.docs.forEach(d => {
        const data = d.data();
        manualMap[data.assignmentId] = data;
      });

      setAssignments(allAssignments);
      setResults(resultsMap);
      setManualSubmissions(manualMap);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load assignments data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleManualUpload = async (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingId(assignmentId);
      
      try {
        let fileData: string;
        if (file.type.startsWith('image/')) {
          fileData = await compressImage(file, 200); // Higher limit for assignments
        } else {
          // For non-images, just convert to base64 if not too large (limit ~2MB for simplicity in Firestore)
          if (file.size > 2 * 1024 * 1024) throw new Error("File too large. Max 2MB allowed.");
          fileData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
          });
        }

        const submission = {
          assignmentId,
          studentId: student?.id,
          fileUrl: fileData,
          fileName: file.name,
          submittedAt: Timestamp.now(),
          status: 'Submitted'
        };

        await addDoc(collection(firestore, 'manual_submissions'), submission);
        setManualSubmissions(prev => ({ ...prev, [assignmentId]: submission }));
        toast({ title: "Uploaded", description: "Assignment submitted successfully!" });
      } catch (err: any) {
        toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
      } finally {
        setUploadingId(null);
      }
    }
  };

  const startTest = (assignment: any) => {
    setActiveTest(assignment);
    const minutes = assignment.timerMinutes || 30;
    setTimeLeft(minutes * 60);
    setAnswers({});
  };

  const handleOptionSelect = (qIndex: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitTest = async () => {
    if (isSubmitting || !activeTest) return;
    setIsSubmitting(true);
    
    let score = 0;
    const total = activeTest.questions.length;
    
    activeTest.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctAnswerIndex) {
        score++;
      }
    });

    const percentage = Math.round((score / total) * 100);
    const passStatus = percentage >= 40 ? "Pass" : "Fail";

    const resultData = {
      assignmentId: activeTest.id,
      studentId: student?.id,
      score,
      total,
      percentage,
      passStatus,
      submittedAt: Timestamp.now()
    };

    try {
      await addDoc(collection(firestore, 'results'), resultData);
      toast({ title: "Submitted", description: `You scored ${percentage}%. Status: ${passStatus}` });
      
      setResults(prev => ({ ...prev, [activeTest.id]: resultData }));
      setActiveTest(null);
      setAnswers({});
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to submit test.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center text-primary font-bold">Loading Assignments...</div>;

  if (activeTest) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow sticky top-4 z-10 border-t-4 border-t-primary">
          <div>
            <h2 className="text-xl font-bold">{activeTest.title}</h2>
            <p className="text-sm text-slate-500">{activeTest.subject} - {activeTest.topic}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-mono font-bold flex items-center gap-2 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
              <Clock className="w-5 h-5"/> {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {activeTest.questions.map((q: any, i: number) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold leading-relaxed">
                  <span className="text-primary mr-2">Q{i + 1}.</span> {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  onValueChange={(val) => handleOptionSelect(i, parseInt(val))} 
                  value={answers[i] !== undefined ? answers[i].toString() : undefined}
                  className="space-y-3"
                >
                  {q.options.map((opt: string, j: number) => (
                    <div key={j} className="flex items-center space-x-2 border p-3 rounded hover:bg-slate-50 transition-colors">
                      <RadioGroupItem value={j.toString()} id={`q${i}_o${j}`} />
                      <Label htmlFor={`q${i}_o${j}`} className="flex-1 cursor-pointer">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button onClick={handleSubmitTest} disabled={isSubmitting} className="w-full h-12 text-lg font-bold">
          {isSubmitting ? "Submitting..." : "Submit Test Answers"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Academic Portal</h1>
          <p className="text-muted-foreground mt-1">Access your assignments, mock tests, and submit your work.</p>
        </div>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="bg-slate-100 p-1 mb-6">
          <TabsTrigger value="tests" className="font-bold gap-2">
            <Clock className="w-4 h-4" /> Mock Tests
          </TabsTrigger>
          <TabsTrigger value="assignments" className="font-bold gap-2">
            <FileText className="w-4 h-4" /> Manual Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tests">
          {assignments.filter(a => a.questions?.length > 0).length === 0 ? (
            <div className="text-center p-10 bg-white rounded-lg border border-dashed border-slate-300">
              <h3 className="text-lg font-bold text-slate-600">No Online Tests</h3>
              <p className="text-sm text-slate-500">Scheduled mock tests will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {assignments.filter(a => a.questions?.length > 0).map(a => {
                const result = results[a.id];
                const isCompleted = !!result;
                return (
                  <Card key={a.id} className={`border border-slate-200 shadow-sm transition-colors ${isCompleted ? 'opacity-80' : 'hover:border-primary/50'}`}>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                          <PlayCircle className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{a.title}</h3>
                          <p className="text-slate-500 text-sm">{a.subject} &bull; {a.topic}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3"/> {a.timerMinutes}m limit</span>
                            {isCompleted ? (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${result.passStatus === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {result.passStatus}
                              </span>
                            ) : (
                              <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded">Pending</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {isCompleted ? (
                        <div className="bg-slate-50 border rounded p-3 flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            {result.passStatus === 'Pass' ? <CheckCircle2 className="w-5 h-5 text-green-600"/> : <XCircle className="w-5 h-5 text-red-600"/>}
                            <span className="font-semibold text-sm">Score: {result.score}/{result.total}</span>
                          </div>
                          <span className="text-lg font-bold text-slate-700">{result.percentage}%</span>
                        </div>
                      ) : (
                        <Button onClick={() => startTest(a)} className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-2">
                          Start Mock Test
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assignments">
           <div className="grid gap-6 lg:grid-cols-2">
              {assignments.filter(a => !a.questions || a.questions.length === 0).length === 0 ? (
                <div className="col-span-full text-center p-10 bg-white rounded-lg border border-dashed border-slate-300">
                  <h3 className="text-lg font-bold text-slate-600">No Manual Assignments</h3>
                  <p className="text-sm text-slate-500">Assignments requiring file uploads will show up here.</p>
                </div>
              ) : (
                assignments.filter(a => !a.questions || a.questions.length === 0).map(a => {
                  const submission = manualSubmissions[a.id];
                  const isSubmitted = !!submission;
                  return (
                    <Card key={a.id} className="border border-slate-200 shadow-sm">
                      <CardContent className="p-6 flex flex-col gap-4">
                        <div className="flex gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isSubmitted ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                            <FileText className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">{a.title}</h3>
                            <p className="text-slate-500 text-sm">{a.subject} &bull; {a.topic}</p>
                            <div className="flex items-center gap-3 mt-2">
                               <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">Due: {a.lastDate || 'No deadline'}</span>
                               <span className={`text-xs font-bold px-2 py-0.5 rounded ${isSubmitted ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                 {isSubmitted ? 'Submitted' : 'Pending'}
                               </span>
                            </div>
                          </div>
                        </div>

                        {isSubmitted ? (
                          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between">
                             <div className="flex items-center gap-2 text-sm font-medium truncate max-w-[200px]">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrinnk-0"/>
                                <span className="truncate">{submission.fileName}</span>
                             </div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Accepted</p>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <label className="block w-full">
                              <input 
                                type="file" 
                                className="hidden" 
                                disabled={uploadingId === a.id}
                                onChange={(e) => handleManualUpload(a.id, e)}
                                accept=".pdf,image/*"
                              />
                              <div className={`w-full h-11 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${uploadingId === a.id ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'border-primary/20 hover:border-primary/50 hover:bg-primary/5'}`}>
                                 {uploadingId === a.id ? (
                                   <Loader2 className="w-4 h-4 animate-spin" />
                                 ) : (
                                   <Upload className="w-4 h-4 text-primary" />
                                 )}
                                 <span className="text-sm font-bold text-slate-700">
                                   {uploadingId === a.id ? 'Uploading...' : 'Upload Submission (PDF/Image)'}
                                 </span>
                              </div>
                            </label>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
