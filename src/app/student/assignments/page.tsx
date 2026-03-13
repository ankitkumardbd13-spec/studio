
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, FileText, Calendar, Clock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

interface Question {
  id: string;
  text: string;
  type: 'subjective' | 'objective';
  options?: string[];
}

interface Assignment {
  id: string;
  title: string;
  trade: string;
  year: number;
  deadlineDate: string;
  deadlineTime: string;
  questions: Question[];
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentInfo] = useState({ trade: 'Electrician', year: 1 }); // Mocked logged in user

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_assignments');
    if (saved) {
      const all: Assignment[] = JSON.parse(saved);
      // Filter for student's specific trade and year
      const filtered = all.filter(a => a.trade === studentInfo.trade && a.year === studentInfo.year);
      setAssignments(filtered);
    }
  }, []);

  const getStatus = (deadlineStr: string, timeStr: string) => {
    const deadline = new Date(`${deadlineStr}T${timeStr}`);
    const now = new Date();
    if (now > deadline) return { label: 'Overdue', color: 'bg-red-500', icon: <AlertCircle className="w-3 h-3" /> };
    return { label: 'Pending', color: 'bg-amber-500', icon: <Clock className="w-3 h-3" /> };
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <header className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-headline text-4xl text-primary font-bold">My Assignments</h1>
            <p className="text-muted-foreground">Trade: {studentInfo.trade} | Academic Year: {studentInfo.year}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/student/dashboard" className="gap-2"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
          </Button>
        </header>

        <div className="max-w-4xl mx-auto grid gap-6">
          {assignments.map(a => {
            const status = getStatus(a.deadlineDate, a.deadlineTime);
            return (
              <Card key={a.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-1 w-full ${status.color}`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">{a.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                       <FileText className="w-4 h-4" /> {a.questions.length} Total Questions
                    </CardDescription>
                  </div>
                  <Badge className={`${status.color} text-white gap-1`}>
                    {status.icon} {status.label}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex flex-wrap gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" /> Last Date: {a.deadlineDate}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" /> Submission Time: {a.deadlineTime}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t mt-4 py-4 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Questions include Objective (MCQs) and Subjective types.</span>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2">
                    Start Assignment <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}

          {assignments.length === 0 && (
            <div className="bg-white border-2 border-dashed rounded-xl p-20 text-center opacity-40">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-bold">All caught up!</h3>
              <p>No pending assignments for your trade at this moment.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
