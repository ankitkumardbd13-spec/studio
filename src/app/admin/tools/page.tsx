
"use client";

import React, { useState } from 'react';
import { generateAssignmentAndMockTest } from '@/ai/flows/admin-assignment-mock-test-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, ClipboardList, BookCheck } from 'lucide-react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AIToolsPage() {
  const [trade, setTrade] = useState('');
  const [year, setYear] = useState('1');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    assignmentQuestions: string[];
    mockTestQuestions: string[];
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const output = await generateAssignmentAndMockTest({
        trade,
        year: parseInt(year),
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
          <p className="text-muted-foreground text-lg">Generate high-quality assignments based on New DGT Syllabus.</p>
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
                  <Select onValueChange={setTrade} required>
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

                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Select onValueChange={setYear} defaultValue="1" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">First Year</SelectItem>
                      <SelectItem value="2">Second Year</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</> : "Generate Questions"}
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
                  <p className="text-xl">Our AI is drafting technical questions for {trade}...</p>
               </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-none shadow-lg">
                  <CardHeader className="border-b bg-accent/30">
                    <CardTitle className="text-primary flex items-center gap-2"><ClipboardList className="w-5 h-5"/> Assignment Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {result.assignmentQuestions.map((q, i) => (
                        <li key={i} className="flex gap-3">
                           <span className="font-bold text-primary">{i+1}.</span>
                           <p className="text-foreground">{q}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader className="border-b bg-secondary/10">
                    <CardTitle className="text-secondary flex items-center gap-2"><BookCheck className="w-5 h-5"/> Mock Test (MCQs/Short Answers)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4">
                      {result.mockTestQuestions.map((q, i) => (
                        <li key={i} className="flex gap-3">
                           <span className="font-bold text-secondary">{i+1}.</span>
                           <p className="text-foreground font-medium">{q}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
