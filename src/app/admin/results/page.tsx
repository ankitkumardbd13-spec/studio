
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Download, FileSpreadsheet, User, GraduationCap, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Result {
  id: string;
  studentName: string;
  fatherName: string;
  rollNo: string;
  trade: string;
  year: number;
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

export default function AdminResultsPage() {
  const { toast } = useToast();
  const [results, setResults] = useState<Result[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_results');
    if (saved) setResults(JSON.parse(saved));
  }, []);

  const filteredResults = useMemo(() => {
    return results.filter(r => 
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.trade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [results, searchQuery]);

  const exportToExcel = () => {
    if (filteredResults.length === 0) {
      toast({ variant: 'destructive', title: 'No Data', description: 'No results found to export.' });
      return;
    }

    // Generate CSV Content
    const headers = [
      "Student Name", "Father Name", "Roll No", "Trade", "Year", 
      "Assignment Name", "Subject", "Total Qs", "Attempted", 
      "Right Qs", "Marks Obtained", "Total Marks", "Percentage", "Result Status", "Date"
    ];

    const rows = filteredResults.map(r => [
      `"${r.studentName}"`,
      `"${r.fatherName}"`,
      `"${r.rollNo}"`,
      `"${r.trade}"`,
      r.year,
      `"${r.title}"`,
      `"${r.subject}"`,
      r.totalQuestions,
      r.attemptedQuestions,
      r.rightQuestions,
      r.score,
      r.totalMarks,
      `${r.percentage.toFixed(1)}%`,
      r.status,
      new Date(r.date).toLocaleDateString()
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MPITI_Exam_Results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Successful', description: 'Spreadsheet downloaded successfully.' });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Exam Result Manager</h1>
            <p className="text-muted-foreground">Track student scores and export performance reports</p>
          </div>
          <Button onClick={exportToExcel} className="gap-2 bg-green-600 hover:bg-green-700">
            <FileSpreadsheet className="w-4 h-4" /> Export All to Excel (CSV)
          </Button>
        </header>

        <Card className="mb-8 border-none shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by Student Name, Roll No or Trade..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Test Submissions ({filteredResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Details</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead className="text-center">Score (Right/Total)</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead className="text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full"><User className="w-4 h-4 text-primary" /></div>
                        <div>
                          <p className="font-bold text-slate-900">{r.studentName}</p>
                          <p className="text-[10px] text-muted-foreground font-bold">Roll: {r.rollNo}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Badge variant="outline" className="w-fit text-[10px] border-primary text-primary">{r.trade}</Badge>
                        <span className="text-[10px] mt-1 font-bold">Year {r.year}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="max-w-[150px] truncate">
                         <p className="font-medium text-sm">{r.title}</p>
                         <p className="text-[10px] text-muted-foreground">{r.subject}</p>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-black text-lg">{r.rightQuestions} / {r.totalMarks}</span>
                        <span className="text-[10px] text-muted-foreground">Attempted: {r.attemptedQuestions}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{r.percentage.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge className={r.status === 'Pass' ? 'bg-green-500' : 'bg-red-500'}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredResults.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">
                      <ClipboardCheck className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>No test submissions found matching your search.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
