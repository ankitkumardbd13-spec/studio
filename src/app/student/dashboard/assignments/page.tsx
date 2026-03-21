"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Download, PlayCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudent } from '../layout';
import { useFirestore } from '@/firebase/provider';
import { collection, query, getDocs, addDoc, where, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function StudentAssignmentsPage() {
  const student = useStudent();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [assignments, setAssignments] = useState<any[]>([]);
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

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
      // Fetch Assignments
      const qA = query(collection(firestore, 'assignments'));
      const snapA = await getDocs(qA);
      const allAssignments = snapA.docs.map(d => ({ id: d.id, ...d.data() }));

      // Fetch Results for this student
      const qR = query(collection(firestore, 'results'), where('studentId', '==', student?.id));
      const snapR = await getDocs(qR);
      const resultsMap: Record<string, any> = {};
      snapR.docs.forEach(d => {
        const data = d.data();
        resultsMap[data.assignmentId] = data;
      });

      setAssignments(allAssignments);
      setResults(resultsMap);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load assignments.", variant: "destructive" });
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Assignments & Mock Tests</h1>
        <p className="text-muted-foreground mt-1">Complete your objective assessments below. Tests can only be attempted once.</p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg border border-dashed border-slate-300">
           <h3 className="text-lg font-bold text-slate-600">No Assignments Yet</h3>
           <p className="text-sm text-slate-500">Check back later for new mock tests.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {assignments.map(a => {
            const result = results[a.id];
            const isCompleted = !!result;

            return (
              <Card key={a.id} className={`border border-slate-200 shadow-sm transition-colors ${isCompleted ? 'opacity-80' : 'hover:border-primary/50'}`}>
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                      <FileText className="w-7 h-7" />
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
                    <Button onClick={() => startTest(a)} className="w-full bg-primary hover:bg-primary/90 text-white gap-2 mt-2">
                      <PlayCircle className="w-4 h-4" /> Start Assignment
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
