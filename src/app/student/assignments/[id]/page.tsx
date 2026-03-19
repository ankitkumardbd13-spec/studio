"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Timer, Send, AlertCircle, Loader2, CheckCircle, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';

// For static export compatibility
export async function generateStaticParams() {
  return [];
}

interface Question {
  id: string;
  text: string;
  type: 'objective';
  options: string[];
  correctAnswer: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  trade: string;
  year: number;
  durationMinutes: number;
  questions: Question[];
}

export default function AssignmentTestPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const saved = localStorage.getItem('mpiti_assignments');
    const results = JSON.parse(localStorage.getItem('mpiti_results') || '[]');
    
    const alreadyDone = results.some((r: any) => r.assignmentId === id);
    if (alreadyDone) {
      toast({ variant: 'destructive', title: 'Already Attempted', description: 'You have already completed this test.' });
      router.push('/student/assignments');
      return;
    }

    if (saved) {
      const all: Assignment[] = JSON.parse(saved);
      const found = all.find(a => a.id === id);
      if (found) {
        setAssignment(found);
        setTimeLeft(found.durationMinutes * 60);
      }
    }
  }, [id, router, toast]);

  const handleSubmit = useCallback(async (isAuto = false) => {
    if (isSubmitting || isSubmitted || !assignment) return;
    setIsSubmitting(true);

    try {
      const savedProfile = localStorage.getItem('mpiti_student_profile');
      const profile = savedProfile ? JSON.parse(savedProfile) : { name: 'Unknown Student', father: 'Unknown', rollNo: 'N/A', trade: assignment.trade, year: assignment.year };

      const totalQuestions = assignment.questions.length;
      let rightQuestions = 0;

      assignment.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
          rightQuestions++;
        }
      });

      const percentage = (rightQuestions / totalQuestions) * 100;
      const status = percentage >= 40 ? 'Pass' : 'Fail';

      const resultRecord = {
        id: Date.now().toString(),
        assignmentId: assignment.id,
        title: assignment.title,
        subject: assignment.subject,
        studentName: profile.name,
        fatherName: profile.father,
        rollNo: profile.rollNo,
        trade: profile.trade,
        year: profile.year,
        totalQuestions,
        attemptedQuestions: Object.keys(answers).length,
        rightQuestions,
        score: rightQuestions,
        totalMarks: totalQuestions,
        percentage,
        status,
        date: new Date().toISOString()
      };

      const results = JSON.parse(localStorage.getItem('mpiti_results') || '[]');
      localStorage.setItem('mpiti_results', JSON.stringify([resultRecord, ...results]));
      
      setIsSubmitted(true);
      toast({
        title: isAuto ? "Time Up! Auto-Submitted" : "Test Complete",
        description: `Score: ${rightQuestions}/${totalQuestions}.`,
      });
      
      setTimeout(() => {
        router.push('/student/results');
      }, 3000);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Submission Failed' });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, isSubmitted, assignment, answers, router, toast]);

  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!assignment) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-primary" /></div>;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Test Submitted!</h2>
          <Button onClick={() => router.push('/student/results')}>View My Results</Button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navbar />
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm py-3 px-4 flex justify-between items-center">
        <div className="container mx-auto flex justify-between items-center">
          <Badge variant="outline">{assignment.title}</Badge>
          <div className={`flex items-center gap-2 font-bold text-lg ${timeLeft !== null && timeLeft < 300 ? 'text-red-600 animate-pulse' : ''}`}>
            <Timer className="w-5 h-5" />
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {assignment.questions.map((q, idx) => (
            <Card key={q.id}>
              <CardHeader className="bg-slate-50/50">
                <Badge variant="secondary">Question {idx + 1}</Badge>
                <CardTitle className="text-xl mt-2">{q.text}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-slate-50">
                      <RadioGroupItem value={opt} id={`q-${idx}-o-${oIdx}`} />
                      <Label htmlFor={`q-${idx}-o-${oIdx}`} className="flex-1 cursor-pointer">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
          <div className="pt-8 flex justify-center">
            <Button size="lg" className="w-full max-w-sm h-14" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit My Test"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
