"use client";

import React from 'react';
import Link from 'next/link';
import { useStudent } from '@/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Calendar, CheckCircle2, Bookmark, CreditCard } from 'lucide-react';

export default function StudentDashboardHome() {
  const student = useStudent()!;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/30 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-headline font-black mb-2">
            Welcome back, <span className="text-secondary">{student.name.split(' ')[0]}</span>!
          </h1>
          <p className="text-lg text-primary-foreground/90 font-medium">
            Academic Session {student.session} | {student.trade}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-blue-50/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Admission</CardTitle>
            <CardDescription className="font-bold text-green-600">Approved</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-amber-50/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-2">
              <Bookmark className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle className="text-lg">Trade</CardTitle>
            <CardDescription className="text-slate-700 font-bold">{student.trade}</CardDescription>
          </CardHeader>
        </Card>
        
        <Link href="/student/dashboard/assignments">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-purple-50/50 cursor-pointer h-full">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Assignments</CardTitle>
              <CardDescription className="text-slate-700 font-bold">Open Test Portal</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-emerald-50/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <CardTitle className="text-lg">Session</CardTitle>
            <CardDescription className="text-slate-700 font-bold">{student.session}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
         <Card className="border border-slate-200 shadow-sm">
           <CardHeader>
             <CardTitle>Important Notices</CardTitle>
             <CardDescription>Updates from the administration</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm space-y-2">
                <p className="font-bold text-primary">1. ID Cards Updated</p>
                <p className="text-slate-600">Your digital ID card profile data has been finalized. Please verify your details in the &quot;My Profile&quot; tab.</p>
             </div>
           </CardContent>
         </Card>

         <Card className="border border-slate-200 shadow-sm">
           <CardHeader>
             <CardTitle>Quick Actions</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex gap-4">
                <Link href="/student/dashboard/syllabus" className="flex-1">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center cursor-pointer hover:bg-primary/5 transition-colors h-full">
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-sm text-slate-700">View Syllabus</p>
                  </div>
                </Link>
                <Link href="/student/dashboard/fees" className="flex-1">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg text-center cursor-pointer hover:bg-primary/5 transition-colors h-full">
                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-sm text-slate-700">Check Fees</p>
                  </div>
                </Link>
             </div>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
