"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, query, getDocs, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Loader2, Trash2, Phone, MapPin, Search, Calendar, User, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function InquiriesPage() {
  const { toast } = useToast();
  const db = useFirestore();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [db]);

  const fetchInquiries = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'inquiries'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      setInquiries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load inquiries.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db || !window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries(prev => prev.filter(i => i.id !== id));
      toast({ title: "Success", description: "Inquiry deleted." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete inquiry.", variant: "destructive" });
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: newStatus });
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      toast({ title: "Updated", description: `Status changed to ${newStatus}.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const filteredInquiries = inquiries.filter(i => 
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.mobile?.includes(searchTerm) ||
    i.trade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Admission Inquiries</h1>
          <p className="text-muted-foreground mt-1">Review and manage student admission submissions.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, phone..." 
            className="pl-10" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredInquiries.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            No inquiries found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInquiries.map((inquiry) => (
            <Card key={inquiry.id} className="overflow-hidden hover:shadow-lg transition-all border-l-4 border-l-primary">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> {inquiry.name}
                    </CardTitle>
                    <CardDescription>Father: {inquiry.fatherName}</CardDescription>
                  </div>
                  <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'} className="capitalize">
                    {inquiry.status || 'new'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="w-4 h-4 text-secondary shrink-0" />
                  <span className="font-semibold text-primary">{inquiry.trade}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{inquiry.mobile} / {inquiry.whatsapp}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{inquiry.address}, {inquiry.tehsil}, {inquiry.state}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground border-t pt-3">
                  <Calendar className="w-3 h-3" />
                  {inquiry.timestamp?.toDate ? inquiry.timestamp.toDate().toLocaleString() : 'Recent'}
                </div>
              </CardContent>
              <div className="p-4 bg-muted/10 border-t flex justify-between items-center gap-2">
                <div className="flex gap-1">
                  {inquiry.status !== 'called' && (
                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold" onClick={() => updateStatus(inquiry.id, 'called')}>
                      <Clock className="w-3 h-3 mr-1" /> CALL DONE
                    </Button>
                  )}
                  {inquiry.status !== 'admitted' && (
                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold text-green-600 hover:text-green-700" onClick={() => updateStatus(inquiry.id, 'admitted')}>
                      <CheckCircle2 className="w-3 h-3 mr-1" /> ADMITTED
                    </Button>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(inquiry.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
