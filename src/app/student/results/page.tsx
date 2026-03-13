
"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, ArrowLeft, Download, CheckCircle2, TrendingUp, BookOpen, Calendar, Printer } from 'lucide-react';
import Link from 'next/link';

interface Result {
  id: string;
  assignmentId: string;
  title: string;
  subject: string;
  score: number;
  total: number;
  percentage: number;
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
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline text-4xl text-primary font-bold">Exam Results</h1>
              <p className="text-muted-foreground font-medium">Performance summary for all internal & assignment tests</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/student/dashboard" className="gap-2"><ArrowLeft className="w-4 h-4"/> Dashboard</Link>
              </Button>
              <Button className="bg-primary text-white gap-2">
                <Printer className="w-4 h-4" /> Print Marksheet
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
                  <p className="text-xs font-bold text-muted-foreground uppercase">Tests Taken</p>
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
                  <p className="text-xs font-bold text-white/70 uppercase">Overall Grade</p>
                  <p className="text-3xl font-black">
                    {parseFloat(avgPercentage.toString()) >= 80 ? 'A+' : 
                     parseFloat(avgPercentage.toString()) >= 60 ? 'A' : 
                     parseFloat(avgPercentage.toString()) >= 40 ? 'B' : 'P'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-xl">Detailed Marksheet</CardTitle>
              <CardDescription>Bilingual MCQ test performance history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">Test Topic / Title</TableHead>
                    <TableHead className="font-bold">Subject</TableHead>
                    <TableHead className="font-bold">Date</TableHead>
                    <TableHead className="font-bold">Score</TableHead>
                    <TableHead className="font-bold">Percentage</TableHead>
                    <TableHead className="text-right font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-bold">{r.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-primary text-primary font-bold">{r.subject}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" /> {new Date(r.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-lg">{r.score} <span className="text-xs font-normal text-muted-foreground">/ {r.total}</span></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: `${r.percentage}%` }}></div>
                          </div>
                          <span className="font-bold">{r.percentage.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className={r.percentage >= 40 ? 'bg-green-500' : 'bg-red-500'}>
                          {r.percentage >= 40 ? 'Passed' : 'Fail'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {results.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                          <Award className="w-16 h-16 mb-4" />
                          <p className="text-lg font-bold">No exam results found.</p>
                          <p className="text-sm">Complete your assignments to see marks here.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-amber-50 rounded-xl border-l-4 border-amber-500 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold text-amber-800">Authentication Note:</p>
              <p className="text-amber-700">These results are for internal assessment and mock tests only. Final NCVT AITT results must be checked on the official DGT portal using your roll number.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
