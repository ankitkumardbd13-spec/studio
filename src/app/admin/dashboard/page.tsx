
"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Download, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Wand2,
  PieChart,
  Layout
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const pendingApprovals = [
    { name: 'Amit Tyagi', email: 'amit@example.com', trade: 'Fitter', session: '2024-26' },
    { name: 'Sonia Verma', email: 'sonia@example.com', trade: 'COPA', session: '2024-25' },
  ];

  const adminStats = [
    { label: 'Total Students', value: '450', icon: <Users className="w-5 h-5" /> },
    { label: 'Pending Admissions', value: '12', icon: <FileText className="w-5 h-5" /> },
    { label: 'New Registrations', value: '5', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white">
        <div className="p-6">
          <h2 className="font-headline text-2xl font-bold text-primary">MPITI Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/20 text-primary font-medium">
            <Layout className="w-5 h-5" /> Overview
          </Link>
          <Link href="/admin/content" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" /> Website Content
          </Link>
          <Link href="/admin/admissions" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <FileText className="w-5 h-5" /> Admission Forms
          </Link>
          <Link href="/admin/tools" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Wand2 className="w-5 h-5" /> AI Generator Tools
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <MessageSquare className="w-5 h-5" /> Drafting Assistant
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/5" asChild>
            <Link href="/login">Log Out</Link>
          </Button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Admin Management</h1>
            <p className="text-muted-foreground">Manage ITI content, students and registrations</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2"><Download className="w-4 h-4"/> Export Students</Button>
            <Button className="bg-primary text-white gap-2"><PieChart className="w-4 h-4"/> View Reports</Button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {adminStats.map((stat, idx) => (
            <Card key={idx} className="border-none shadow-sm">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Signups */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Pending Student Verifications</CardTitle>
                <CardDescription>Review and approve new student portal registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Trade</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.map((req, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{req.name}</p>
                            <p className="text-xs text-muted-foreground">{req.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{req.trade}</TableCell>
                        <TableCell><Badge variant="outline">{req.session}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50"><CheckCircle className="w-4 h-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"><XCircle className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost">Details</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tasks */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-accent/20">
              <CardHeader>
                <CardTitle className="text-lg">Quick Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start gap-3 bg-white hover:bg-white/80 text-foreground border shadow-sm">
                  <FileText className="w-4 h-4 text-primary" /> Update Trade Syllabus
                </Button>
                <Button className="w-full justify-start gap-3 bg-white hover:bg-white/80 text-foreground border shadow-sm">
                  <Wand2 className="w-4 h-4 text-secondary" /> Generate AI Mock Test
                </Button>
                <Button className="w-full justify-start gap-3 bg-white hover:bg-white/80 text-foreground border shadow-sm">
                  <Bell className="w-4 h-4 text-blue-500" /> Send Notification
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">System Update</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90 mb-4">You have 12 new admission forms to review for the 2024-25 session.</p>
                <Button variant="secondary" className="w-full font-bold">Review Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
