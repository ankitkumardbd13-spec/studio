
"use client";

import React from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle,
  Download,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { toast } = useToast();
  
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Compiling student database into Excel format...",
    });
  };

  const handleReport = () => {
    toast({
      title: "Generating Report",
      description: "Analyzing admission trends for session 2024-25...",
    });
  };

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
      <AdminSidebar />

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Admin Management</h1>
            <p className="text-muted-foreground">Manage ITI students, inquiry forms and AI tools</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2" onClick={handleExport}><Download className="w-4 h-4"/> Export Data</Button>
            <Button className="bg-primary text-white gap-2" onClick={handleReport}><PieChart className="w-4 h-4"/> Reports</Button>
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
            <Card className="border-none shadow-sm h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Portal Registrations</CardTitle>
                  <CardDescription>Verify admitted students for portal access</CardDescription>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Action Required</Badge>
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
                   <Button variant="ghost" className="text-primary text-xs font-bold uppercase tracking-widest">View All Applications <ArrowRight className="w-3 h-3 ml-2"/></Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Quick Summary</CardTitle>
                <CardDescription className="text-white/60">Current Intake Progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Electrician Slots</span>
                    <span>34/40</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Fitter Slots</span>
                    <span>28/40</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-[70%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm border-l-4 border-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Server Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Admin: Maharana Pratap ITI<br/>DGT Syllabus Version: 2024.1<br/>System Time: {new Date().toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
