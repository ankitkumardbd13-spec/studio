
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
  Layout,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const pendingApprovals = [
    { name: 'Amit Tyagi', email: 'amit@example.com', trade: 'Electrician', session: '2024-26' },
    { name: 'Sonia Verma', email: 'sonia@example.com', trade: 'HSI', session: '2024-25' },
    { name: 'Vikas Sharma', email: 'vikas@example.com', trade: 'Fitter', session: '2023-25' },
  ];

  const adminStats = [
    { label: 'Total Students', value: '450', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Signups', value: '12', icon: <FileText className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Today Admissions', value: '5', icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-50' },
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
          <Link href="/admin/tools" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Wand2 className="w-5 h-5" /> AI Generator Tools
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <MessageSquare className="w-5 h-5" /> Drafting Assistant
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/5" asChild>
            <Link href="/login"><LogOut className="w-4 h-4" /> Log Out</Link>
          </Button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Admin Management</h1>
            <p className="text-muted-foreground">Manage ITI students, inquiry forms and AI tools</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2"><Download className="w-4 h-4"/> Export Data</Button>
            <Button className="bg-primary text-white gap-2"><PieChart className="w-4 h-4"/> Reports</Button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {adminStats.map((stat, idx) => (
            <Card key={idx} className="border-none shadow-sm overflow-hidden">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Signups */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Portal Registrations</CardTitle>
                  <CardDescription>Already admitted students awaiting verification</CardDescription>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">New</Badge>
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
                            <p className="font-bold text-slate-800">{req.name}</p>
                            <p className="text-xs text-muted-foreground">{req.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-100">{req.trade}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{req.session}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50"><CheckCircle className="w-4 h-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"><XCircle className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-6 text-center">
                   <Button variant="ghost" className="text-primary text-xs font-bold uppercase tracking-widest">View All Applications</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Tasks */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <CardDescription className="text-white/60">Generate syllabus-based content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 text-white border-none" asChild>
                  <Link href="/admin/tools"><Wand2 className="w-4 h-4 text-primary" /> Generate Mock Test</Link>
                </Button>
                <Button className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 text-white border-none" asChild>
                  <Link href="/admin/messages"><MessageSquare className="w-4 h-4 text-secondary" /> Draft Admin Message</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm border-l-4 border-secondary">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <p className="text-sm font-medium">All systems operational</p>
                </div>
                <p className="text-xs text-muted-foreground">New Admission Intake: Active<br/>DGT Syllabus Version: 2024.1</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
