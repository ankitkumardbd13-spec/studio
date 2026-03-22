"use client";

import React from 'react';
import { useStudent } from '@/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookMarked, Download, Clock, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentSyllabusPage() {
  const student = useStudent()!;
  const trade = student.trade?.toLowerCase() || '';

  const renderFitterSyllabus = () => (
    <div className="space-y-4">
      <Card className="border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
        <CardContent className="p-4 flex gap-4">
          <div className="bg-orange-100 p-3 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
            <Settings className="text-orange-600 w-6 h-6" />
          </div>
          <div className="flex-1">
             <h3 className="font-bold text-lg text-slate-800">Module 1: Measurement & Hand Tools</h3>
             <p className="text-sm text-slate-500 mt-1 line-clamp-2">Linear measurement instruments, calipers, micrometers, bench vices, files and filing techniques.</p>
             <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> 40 Hours</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-slate-200 shadow-sm border-l-4 border-l-orange-500">
        <CardContent className="p-4 flex gap-4">
          <div className="bg-orange-100 p-3 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
            <Settings className="text-orange-600 w-6 h-6" />
          </div>
          <div className="flex-1">
             <h3 className="font-bold text-lg text-slate-800">Module 2: Drilling & Sheet Metal</h3>
             <p className="text-sm text-slate-500 mt-1 line-clamp-2">Drilling machines, drill bits, sheet metal working tools, folding, bending, and riveting.</p>
             <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> 60 Hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderElectricianSyllabus = () => (
    <div className="space-y-4">
      <Card className="border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex gap-4">
          <div className="bg-blue-100 p-3 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
            <Zap className="text-blue-600 w-6 h-6" />
          </div>
          <div className="flex-1">
             <h3 className="font-bold text-lg text-slate-800">Module 1: Basic Electricity</h3>
             <p className="text-sm text-slate-500 mt-1 line-clamp-2">Ohm's law, series and parallel circuits, understanding voltage, current, and resistance.</p>
             <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> 50 Hours</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex gap-4">
          <div className="bg-blue-100 p-3 rounded-xl shrink-0 h-12 w-12 flex items-center justify-center">
            <Zap className="text-blue-600 w-6 h-6" />
          </div>
          <div className="flex-1">
             <h3 className="font-bold text-lg text-slate-800">Module 2: Wiring Systems</h3>
             <p className="text-sm text-slate-500 mt-1 line-clamp-2">Domestic and industrial wiring, types of cables, switches, fuses, and MCBs.</p>
             <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> 80 Hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDefaultSyllabus = () => (
    <div className="space-y-4">
       <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
         <BookMarked className="w-12 h-12 mx-auto text-slate-300 mb-4" />
         <h3 className="text-xl font-bold text-slate-700">General Syllabus</h3>
         <p className="text-slate-500 mt-2 max-w-md mx-auto">The detailed syllabus modules for {student.trade} are currently being updated. Please refer to the common curriculum or download the complete PDF.</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Trade Syllabus</h1>
          <p className="text-muted-foreground mt-1 text-lg">Curriculum for <span className="font-bold text-slate-800">{student.trade}</span></p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
           <Download className="w-4 h-4" /> Full Syllabus PDF
        </Button>
      </div>

      <div className="mt-8">
        {trade.includes('fitter') 
          ? renderFitterSyllabus() 
          : trade.includes('electrician') 
            ? renderElectricianSyllabus() 
            : renderDefaultSyllabus()}
      </div>
    </div>
  );
}
