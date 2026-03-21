"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminDashboardHome() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary">Admin Control Panel</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">142</p>
            <p className="text-sm text-muted-foreground mt-1">+12 this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-t-4 border-t-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-secondary">5</p>
            <p className="text-sm text-muted-foreground mt-1">Action required</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-t-4 border-t-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">8</p>
            <p className="text-sm text-muted-foreground mt-1">Across all trades</p>
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
