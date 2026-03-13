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
  Filter
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
import { PlaceHolderImages } from '@/lib/placeholder-images';

const ALL_PENDING_REGISTRATIONS = [
  { 
    id: '1',
    name: 'Amit Tyagi', 
    email: 'amit@example.com', 
    trade: 'Electrician', 
    session: '2024-26', 
    father: 'Shri Ram Tyagi',
    dob: '2004-08-12',
    mobile: '+91 99887 76655',
    address: 'Village Pilkhani, Saharanpur, UP',
    aadhaar: '1234 5678 9012',
    category: 'OBC',
    photo: PlaceHolderImages.find(i => i.id === 'student-1')?.imageUrl
  },
  { 
    id: '2',
    name: 'Sonia Verma', 
    email: 'sonia@example.com', 
    trade: 'HSI', 
    session: '2024-25', 
    father: 'Shri KL Verma',
    dob: '2005-02-20',
    mobile: '+91 88776 65544',
    address: 'Chilkana Road, Saharanpur, UP',
    aadhaar: '9876 5432 1098',
    category: 'SC',
    photo: PlaceHolderImages.find(i => i.id === 'student-rep')?.imageUrl
  },
  { 
    id: '3',
    name: 'Vikas Sharma', 
    email: 'vikas@example.com', 
    trade: 'Fitter', 
    session: '2023-25', 
    father: 'Shri OP Sharma',
    dob: '2003-11-05',
    mobile: '+91 77665 54433',
    address: 'Nanauta, Saharanpur, UP',
    aadhaar: '5566 7788 9900',
    category: 'General',
    photo: PlaceHolderImages.find(i => i.id === 'chairman')?.imageUrl
  },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrade, setFilterTrade] = useState('All');
  const [filterSession, setFilterSession] = useState('All');

  const filteredRegistrations = useMemo(() => {
    return ALL_PENDING_REGISTRATIONS.filter(reg => {
      const matchesSearch = reg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            reg.aadhaar?.includes(searchQuery);
      const matchesTrade = filterTrade === 'All' || reg.trade === filterTrade;
      const matchesSession = filterSession === 'All' || reg.session === filterSession;
      return matchesSearch && matchesTrade && matchesSession;
    });
  }, [searchQuery, filterTrade, filterSession]);

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Compiling filtered database into Excel format...",
    });
  };

  const handleReport = () => {
    toast({
      title: "Generating Report",
      description: "Analyzing admission trends for session 2024-25...",
    });
  };

  const adminStats = [
    { label: 'Total Students', value: '450', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Signups', value: filteredRegistrations.length.toString(), icon: <FileText className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Today Admissions', value: '5', icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const viewStudentDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto print:p-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 print:hidden">
          <div>
            <h1 className="font-headline text-4xl text-slate-900 font-bold">Admin Management</h1>
            <p className="text-muted-foreground">Manage ITI students, inquiry forms and AI tools</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 border-primary text-primary" onClick={handleExport}><Download className="w-4 h-4"/> Export Data</Button>
            <Button className="bg-primary text-white gap-2" onClick={handleReport}><PieChart className="w-4 h-4"/> Reports</Button>
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

        {/* Search & Filters */}
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
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase">Filter Session</Label>
                <Select value={filterSession} onValueChange={setFilterSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Sessions</SelectItem>
                    <SelectItem value="2023-25">2023-25</SelectItem>
                    <SelectItem value="2024-26">2024-26</SelectItem>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" onClick={() => {setSearchQuery(''); setFilterTrade('All'); setFilterSession('All');}} className="text-primary font-bold">
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
                  <CardTitle>Portal Registrations ({filteredRegistrations.length})</CardTitle>
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
                    {filteredRegistrations.map((req, idx) => (
                      <TableRow key={idx} className="cursor-pointer hover:bg-muted/50" onClick={() => viewStudentDetails(req)}>
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
                        <TableCell className="text-muted-foreground font-medium">{req.session}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => viewStudentDetails(req)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50"><CheckCircle className="w-4 h-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50"><XCircle className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredRegistrations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                          No students found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
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
          </div>
        </div>

        {/* Student Details Dialog with PDF Formatting */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl print:max-w-full print:shadow-none print:border-none">
            <DialogHeader className="print:hidden">
              <DialogTitle>Student Registration Profile</DialogTitle>
              <DialogDescription>Full details submitted for verification</DialogDescription>
            </DialogHeader>

            {selectedStudent && (
              <div className="space-y-8 py-4">
                {/* Header Branding for Print */}
                <div className="hidden print:flex items-center justify-between border-b-2 border-primary pb-6 mb-8">
                   <div className="flex items-center gap-4">
                      <ShieldCheck className="w-12 h-12 text-primary" />
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">Maharana Pratap ITI</h2>
                        <p className="text-sm font-bold text-muted-foreground">Registration Record - Session {selectedStudent.session}</p>
                      </div>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-bold text-primary">OFFICIAL RECORD</p>
                     <p className="text-[10px] text-muted-foreground">Ref: REG/{new Date().getFullYear()}/{selectedStudent.id}</p>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/20 shadow-md shrink-0">
                    <img src={selectedStudent.photo} alt="Student" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Candidate Name</p>
                      <p className="text-lg font-bold text-slate-900">{selectedStudent.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Father's Name</p>
                      <p className="font-bold text-slate-800">{selectedStudent.father}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Trade/Course</p>
                      <Badge className="bg-secondary text-white font-bold">{selectedStudent.trade}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Session</p>
                      <p className="font-bold text-slate-800">{selectedStudent.session}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Aadhaar Number</p>
                      <p className="font-bold text-slate-800">{selectedStudent.aadhaar}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Category</p>
                      <Badge variant="outline" className="border-primary text-primary">{selectedStudent.category}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Date of Birth</p>
                      <p className="text-sm font-bold">{selectedStudent.dob}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Mobile No.</p>
                      <p className="text-sm font-bold">{selectedStudent.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Permanent Address</p>
                      <p className="text-sm font-bold">{selectedStudent.address}</p>
                    </div>
                  </div>
                </div>

                <div className="hidden print:block pt-12">
                   <div className="flex justify-between items-end mt-20">
                      <div className="text-center">
                        <div className="w-40 h-[1px] bg-slate-300 mb-2 mx-auto"></div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Admin Clerk Signature</p>
                      </div>
                      <div className="text-center">
                        <div className="w-40 h-[1px] bg-slate-300 mb-2 mx-auto"></div>
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">Principal Signature</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            <DialogFooter className="print:hidden">
              <Button variant="outline" className="gap-2 border-primary text-primary" onClick={handlePrint}>
                <Printer className="w-4 h-4" /> Download PDF / Print
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                <CheckCircle className="w-4 h-4" /> Approve Admission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}