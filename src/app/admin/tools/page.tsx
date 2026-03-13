
"use client";

import React, { useState } from 'react';
import { generateAssignmentAndMockTest, AdminAssignmentAndMockTestGeneratorOutput } from '@/ai/flows/admin-assignment-mock-test-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, ClipboardList, Languages } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Badge } from '@/components/ui/badge';

export default function AIToolsPage() {
  const [trade, setTrade] = useState('Electrician');
  const [year, setYear] = useState('1');
  const [subject, setSubject] = useState('Trade Theory');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdminAssignmentAndMockTestGeneratorOutput | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await generateAssignmentAndMockTest({
        trade,
        year: parseInt(year),
        subject,
        topic
      });
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-12">
          <h1 className="font-headline text-4xl text-slate-900 font-bold">AI Question Generator</h1>
          <p className="text-muted-foreground text-lg">Generate 20 Bilingual MCQs based on New DGT Syllabus.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <Card className="lg:col-span-1 h-fit shadow-sm border-none">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg"><Wand2 className="w-5 h-5"/> Tool Configuration</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-8">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <Label>Select Trade</Label>
                  <Select onValueChange={setTrade} defaultValue={trade}>
                    <SelectTrigger>
                      <SelectValue placeholder="e.g. Electrician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electrician">Electrician</SelectItem>
                      <SelectItem value="Fitter">Fitter</SelectItem>
                      <SelectItem value="HSI">HSI (Health Sanitary Inspector)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select onValueChange={setSubject} defaultValue={subject}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trade Theory">Theory</SelectItem>
                        <SelectItem value="Employability Skills">Employability</SelectItem>
                        <SelectItem value="Workshop Calculation">Calculation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select onValueChange={setYear} defaultValue="1">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Topic Name (DGT Syllabus)</Label>
                  <Input 
                    placeholder="e.g. Electrical Safety, Hand Tools" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-white h-11">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating 20 MCQs...</> : "Generate Questions"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="lg:col-span-2 space-y-6">
            {!result && !loading && (
              <div className="h-full bg-white border-2 border-dashed border-muted-foreground/20 rounded-2xl p-20 flex flex-col items-center justify-center text-center opacity-40">
                 <Wand2 className="w-16 h-16 mb-4 text-primary" />
                 <p className="text-xl font-medium">Configure and run the AI tool to see generated questions here.</p>
              </div>
            )}

            {loading && (
               <div className="h-full bg-white rounded-2xl p-20 flex flex-col items-center justify-center text-center animate-pulse">
                  <Loader2 className="w-16 h-16 mb-4 animate-spin text-primary" />
                  <p className="text-xl">Our AI is drafting 20 technical bilingual questions for {trade}...</p>
               </div>
            )}

            {result && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center px-2">
                  <h2 className="font-bold text-xl flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" /> Generated MCQs (20)
                  </h2>
                  <Badge variant="outline" className="gap-1 bg-primary/5 text-primary">
                    <Languages className="w-3 h-3" /> Bilingual
                  </Badge>
                </div>

                {result.questions.map((q, i) => (
                  <Card key={i} className="border-none shadow-sm">
                    <CardHeader className="py-4 bg-muted/30">
                      <div className="flex gap-3">
                        <span className="font-bold text-primary">Q{i+1}.</span>
                        <p className="font-medium text-slate-900 leading-relaxed">{q.text}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 grid md:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className={`p-3 rounded-lg border text-sm flex gap-2 ${opt === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                          <span className="opacity-50">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
