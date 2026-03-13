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

interface Question {
  id: string;
  text: string;
  type: 'objective';
  options: string[];
}

interface Assignment {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

export default function AssignmentTestPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_assignments');
    const submissions = JSON.parse(localStorage.getItem('mpiti_submissions') || '[]');
    
    if (submissions.includes(params.id)) {
      toast({ variant: 'destructive', title: 'Already Submitted', description: 'You have already completed this test.' });
      router.push('/student/assignments');
      return;
    }

    if (saved) {
      const all: Assignment[] = JSON.parse(saved);
      const found = all.find(a => a.id === params.id);
      if (found) {
        setAssignment(found);
        setTimeLeft(found.durationMinutes * 60);
      }
    }
  }, [params.id, router, toast]);

  const handleSubmit = useCallback(async (isAuto = false) => {
    if (isSubmitting || isSubmitted) return;
    setIsSubmitting(true);

    try {
      const submissions = JSON.parse(localStorage.getItem('mpiti_submissions') || '[]');
      localStorage.setItem('mpiti_submissions', JSON.stringify([...submissions, params.id]));
      
      setIsSubmitted(true);
      toast({
        title: isAuto ? "Time Up! Auto-Submitted" : "Final Submission Complete",
        description: "Your responses have been saved and sent to your instructor.",
      });
      
      setTimeout(() => {
        router.push('/student/assignments');
      }, 3000);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Submission Failed', description: 'Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, isSubmitted, params.id, router, toast]);

  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8 border-none shadow-2xl">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Test Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-6">Great job! Redirecting you back to your dashboard in a few seconds...</p>
          <Button onClick={() => router.push('/student/assignments')}>Return to Assignments</Button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navbar />
      
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm py-3 px-4 flex justify-between items-center">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary">{assignment.title}</Badge>
            <div className="hidden md:flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold">
              <Languages className="w-3 h-3" /> Bilingual Mode
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-lg ${timeLeft !== null && timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-800'}`}>
            <Timer className="w-5 h-5" />
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-8 text-center">
            <h1 className="font-headline text-3xl font-bold text-primary">{assignment.title}</h1>
            <p className="text-muted-foreground">Complete all {assignment.questions.length} Bilingual (English / हिंदी) MCQs.</p>
          </header>

          {assignment.questions.map((q, idx) => (
            <Card key={q.id} className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 pb-4">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">Question {idx + 1}</Badge>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">MCQ / वस्तुनिष्ठ</span>
                </div>
                <CardTitle className="text-xl mt-2 leading-relaxed font-body">
                   {q.text}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup 
                  onValueChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                  className="grid gap-3"
                >
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer group">
                      <RadioGroupItem value={opt} id={`q-${q.id}-o-${oIdx}`} />
                      <Label htmlFor={`q-${q.id}-o-${oIdx}`} className="flex-1 cursor-pointer font-medium text-base group-hover:text-primary transition-colors">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          <div className="pt-8 flex flex-col items-center gap-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 text-sm text-amber-800 max-w-lg">
               <AlertCircle className="w-5 h-5 flex-shrink-0" />
               <p>Warning: Final auto-submit on time up. Ensure you have selected all answers before clicking submit.</p>
            </div>
            <Button 
              size="lg" 
              className="w-full max-w-sm bg-primary hover:bg-primary/90 text-white gap-2 h-14 text-xl font-bold"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
              Submit My Test
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
