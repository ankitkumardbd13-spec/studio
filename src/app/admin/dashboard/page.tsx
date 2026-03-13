
"use client";

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle,
  Download,
  PieChart,
  Eye,
  Printer,
  ShieldCheck,
  Calendar,
  MapPin,
  Phone,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/hooks/use-memo-firebase';

export default function AdminDashboard() {
  const { toast } = useToast();
  const db = useFirestore();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrade, setFilterTrade] = useState('All');
  const [filterSession, setFilterSession] = useState('All');

  const studentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'students'), orderBy('name', 'asc'));
  }, [db]);

  const inquiriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'inquiries'), orderBy('timestamp', 'desc'), limit(50));
  }, [db]);

  const { data: students, loading: studentsLoading } = useCollection(studentsQuery);
  const { data: inquiries, loading: inquiriesLoading } = useCollection(inquiriesQuery);

  const filteredRegistrations = useMemo(() => {
    if (!students) return [];
    return students.filter(reg => {
      const matchesSearch = reg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            reg.aadhaar?.includes(searchQuery);
      const matchesTrade = filterTrade === 'All' || reg.trade === filterTrade;
      const matchesSession = filterSession === 'All' || reg.session === filterSession;
      return matchesSearch && matchesTrade && matchesSession;
    });
  }, [searchQuery, filterTrade, filterSession, students]);

  const handleApprove = (studentId: string) => {
    if (!db) return;
    const studentRef = doc(db, 'students', studentId);
    updateDoc(studentRef, { status: 'approved' });
    toast({ title: "Approved", description: "Student access has been activated." });
  };

  const adminStats = [
    { label: 'Total Students', value: students?.length.toString() || '...', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New Inquiries', value: inquiries?.length.toString() || '...', icon: <FileText className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Pending Verification', value: filteredRegistrations.length.toString(), icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto print:p-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 print:hidden">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Admin Management</h1>
            <p className="text-muted-foreground">Manage ITI students and live inquiries</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-8 print:hidden">
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

        <Card className="mb-8 border-none shadow-sm print:hidden">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Search Student</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Name or Aadhaar..." 
                    className="pl-9" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Filter Trade</Label>
                <Select value={filterTrade} onValueChange={setFilterTrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Trades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Trades</SelectItem>
                    <SelectItem value="Electrician">Electrician</SelectItem>
                    <SelectItem value="Fitter">Fitter</SelectItem>
                    <SelectItem value="HSI">HSI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" onClick={() => {setSearchQuery(''); setFilterTrade('All');}} className="text-primary font-bold">
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8 print:hidden">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Cloud Registrations ({filteredRegistrations.length})</CardTitle>
                  <CardDescription>Verify admitted students for portal access</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {studentsLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Trade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.map((req, idx) => (
                        <TableRow key={req.id} className="cursor-pointer hover:bg-muted/50" onClick={() => {setSelectedStudent(req); setIsDetailsOpen(true);}}>
                          <TableCell>
                            <div>
                              <p className="font-bold text-slate-800">{req.name}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Aadhaar: {req.aadhaar}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-primary text-primary bg-primary/5 px-3 py-1 font-bold">
                              {req.trade}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={req.status === 'approved' ? 'default' : 'outline'}>{req.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="text-green-600 border-green-200" onClick={() => handleApprove(req.id)}><CheckCircle className="w-4 h-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-lg">Recent Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inquiriesLoading ? (
                   <Loader2 className="animate-spin mx-auto" />
                ) : (
                  inquiries?.map((iq) => (
                    <div key={iq.id} className="p-3 border rounded-lg space-y-1">
                      <p className="font-bold text-sm">{iq.name}</p>
                      <p className="text-xs text-muted-foreground">{iq.trade} | {iq.mobile}</p>
                      <Badge className="text-[9px] h-4">{iq.status}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
