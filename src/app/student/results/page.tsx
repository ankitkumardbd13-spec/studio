
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, ArrowLeft, TrendingUp, BookOpen, Calendar, Printer, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Result {
  id: string;
  assignmentId: string;
  title: string;
  subject: string;
  totalQuestions: number;
  attemptedQuestions: number;
  rightQuestions: number;
  score: number;
  totalMarks: number;
  percentage: number;
  status: 'Pass' | 'Fail';
  date: string;
}

export default function StudentResultsPage() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_results');
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  const totalExams = results.length;
  const avgPercentage = totalExams > 0 
    ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / totalExams).toFixed(1)
    : 0;

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline text-4xl text-primary font-bold">Detailed Marksheet</h1>
              <p className="text-muted-foreground font-medium">Official performance summary for Maharana Pratap ITI</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/student/dashboard" className="gap-2"><ArrowLeft className="w-4 h-4"/> Dashboard</Link>
              </Button>
              <Button className="bg-primary text-white gap-2">
                <Printer className="w-4 h-4" /> Print Results
              </Button>
            </div>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Assignments Done</p>
                  <p className="text-3xl font-black">{totalExams}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase">Avg. Percentage</p>
                  <p className="text-3xl font-black">{avgPercentage}%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-primary text-primary-foreground">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-white/20 text-white rounded-xl">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white/70 uppercase">ITI Grade</p>
                  <p className="text-3xl font-black">
                    {parseFloat(avgPercentage.toString()) >= 80 ? 'A+' : 
                     parseFloat(avgPercentage.toString()) >= 60 ? 'A' : 
                     parseFloat(avgPercentage.toString()) >= 40 ? 'B' : 'Fail'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-xl">Technical Performance Record</CardTitle>
              <CardDescription>Breakdown of bilingual technical MCQs</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">Test Topic</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold text-center">Attempted</TableHead>
                    <TableHead className="font-bold text-center">Correct</TableHead>
                    <TableHead className="font-bold">Obtained / Total</TableHead>
                    <TableHead className="font-bold">Percentage</TableHead>
                    <TableHead className="text-right font-bold">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div>
                          <p className="font-bold text-slate-900">{r.title}</p>
                          <p className="text-[10px] text-primary font-bold uppercase">{r.subject}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                         {new Date(r.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center font-medium">{r.attemptedQuestions || 0}</TableCell>
                      <TableCell className="text-center font-bold text-green-600">{r.rightQuestions || 0}</TableCell>
                      <TableCell className="font-bold">
                         {r.score} <span className="text-xs font-normal text-muted-foreground">/ {r.totalMarks}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${r.status === 'Pass' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${r.percentage}%` }}></div>
                          </div>
                          <span className="font-bold text-xs">{r.percentage.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={r.status === 'Pass' ? 'bg-green-600' : 'bg-red-600'}>
                          {r.status === 'Pass' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {results.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                          <Award className="w-16 h-16 mb-4" />
                          <p className="text-lg font-bold">No results available yet.</p>
                          <p className="text-sm">Scores will appear here after you submit an assignment.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-500">
               <h4 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                 <CheckCircle2 className="w-5 h-5" /> Passing Criteria
               </h4>
               <p className="text-sm text-green-700">As per NCVT DGT guidelines, the minimum passing marks for technical theory exams is 40%.</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
               <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                 <TrendingUp className="w-5 h-5" /> Performance Insight
               </h4>
               <p className="text-sm text-blue-700">Regularly attempting mock tests improves your final AITT exam preparedness by 70%.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
