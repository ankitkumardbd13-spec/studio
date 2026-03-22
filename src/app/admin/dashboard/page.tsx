"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Loader2, GraduationCap, Users, CheckCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardHome() {
  const db = useFirestore();

  const studentsQuery = useMemoFirebase(() => db ? query(collection(db, 'students')) : null, [db]);
  const pendingApprovalsQuery = useMemoFirebase(() => db ? query(collection(db, 'students'), where('status', '==', 'pending')) : null, [db]);
  const pendingReviewsQuery = useMemoFirebase(() => db ? query(collection(db, 'alumniReviews'), where('status', '==', 'pending')) : null, [db]);

  const { data: students, isLoading: loadingStudents } = useCollection(studentsQuery);
  const { data: pendingApprovals, isLoading: loadingApprovals } = useCollection(pendingApprovalsQuery);
  const { data: pendingReviews, isLoading: loadingReviews } = useCollection(pendingReviewsQuery);

  const isLoading = loadingStudents || loadingApprovals || loadingReviews;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Admin Control Panel</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{students?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-orange-500">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckCircle className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{pendingApprovals?.length || 0}</p>
            <Link href="/admin/dashboard/approvals" className="text-xs text-orange-500 hover:underline mt-1 block font-medium">Action required →</Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-indigo-500">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-indigo-700">Pending Success Stories</CardTitle>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">{pendingReviews?.length || 0}</p>
            <Link href="/admin/dashboard/alumni" className="text-xs text-indigo-500 hover:underline mt-1 block font-medium">Moderate now →</Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-accent">
          <CardHeader className="pb-2 space-y-0 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
            <p className="text-xs text-muted-foreground mt-1">Technical trades</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle>Welcome to the Management Portal</CardTitle>
          <CardDescription>Select an option from the sidebar to manage ITI operations.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            From this control panel, administrators can manage all public content, approve or reject student sign-ups, download student data, manage assignments, and utilize AI tools to generate mock tests based on specific trade syllabuses.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
