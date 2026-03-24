"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useFirebaseApp } from '@/firebase/provider';
import { collection, query, getDocs, addDoc, updateDoc, doc, where, deleteDoc, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { compressImage } from '@/lib/image-utils';
import { Loader2, Plus, User, CheckCircle, XCircle, Star, MessageSquare, Trash2, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AlumniPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = getStorage(useFirebaseApp());
  
  const [alumni, setAlumni] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newAlumni, setNewAlumni] = useState({ name: '', trade: '', passoutYear: '', currentJob: '', photo: '' });

  useEffect(() => {
    fetchData();
  }, [firestore]);

  const fetchData = async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      // Fetch Alumni Directory
      const qAlumni = query(collection(firestore, 'alumni'), orderBy('name'));
      const snapAlumni = await getDocs(qAlumni);
      setAlumni(snapAlumni.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Reviews
      const qReviews = query(collection(firestore, 'alumniReviews'), orderBy('createdAt', 'desc'));
      const snapReviews = await getDocs(qReviews);
      const allReviews = snapReviews.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setPendingReviews(allReviews.filter(r => r.status === 'pending'));
      setApprovedReviews(allReviews.filter(r => r.status === 'approved'));
      
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load alumni data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast({ title: "Compressing", description: "Preparing photo..." });
      const base64Image = await compressImage(file, 50);
      const storageRef = ref(storage, `alumni/photo_${Date.now()}`);
      await uploadString(storageRef, base64Image, 'data_url');
      const url = await getDownloadURL(storageRef);
      setNewAlumni(prev => ({ ...prev, photo: url }));
      toast({ title: "Ready", description: "Photo attached." });
    } catch (err) {
      toast({ title: "Failed", description: "Photo upload failed.", variant: "destructive" });
    }
  };

  const handleAddAlumni = async () => {
    if (!newAlumni.name || !newAlumni.trade || !newAlumni.passoutYear) {
      toast({ title: "Validation Error", description: "Please fill out Name, Trade, and Passout Year.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const docRef = await addDoc(collection(firestore, 'alumni'), newAlumni);
      setAlumni(prev => [{ id: docRef.id, ...newAlumni }, ...prev].sort((a,b) => a.name.localeCompare(b.name)));
      setNewAlumni({ name: '', trade: '', passoutYear: '', currentJob: '', photo: '' });
      toast({ title: "Success", description: "Alumni profile created." });
    } catch (err) {
      toast({ title: "Error", description: "Could not add alumni.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (!window.confirm("Delete this alumni profile?")) return;
    try {
      await deleteDoc(doc(firestore, 'alumni', id));
      setAlumni(prev => prev.filter(al => al.id !== id));
      toast({ title: "Deleted", description: "Profile removed from directory." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete profile.", variant: "destructive" });
    }
  };

  const handleReviewAction = async (id: string, action: 'approved' | 'rejected' | 'deleted') => {
    try {
      if (action === 'deleted') {
        if (!window.confirm("Delete this review permanently?")) return;
        await deleteDoc(doc(firestore, 'alumniReviews', id));
        setPendingReviews(prev => prev.filter(r => r.id !== id));
        setApprovedReviews(prev => prev.filter(r => r.id !== id));
        toast({ title: "Deleted", description: "Review has been removed." });
      } else {
        await updateDoc(doc(firestore, 'alumniReviews', id), { status: action });
        fetchData(); // Refresh to move between lists
        toast({ title: `Review ${action}`, description: `The review has been ${action}.` });
      }
    } catch (err) {
      toast({ title: "Error", description: "Action failed.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Success Stories & Alumni</h1>
        <p className="text-muted-foreground mt-1">Manage alumni directory and moderate public success stories.</p>
      </div>

      <Tabs defaultValue="stories" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="stories" className="gap-2"><Award className="w-4 h-4"/> Success Stories</TabsTrigger>
          <TabsTrigger value="directory" className="gap-2"><User className="w-4 h-4"/> Alumni Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-8 pt-6">
          {/* Pending Reviews */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-amber-600"><Clock className="w-5 h-5"/> Pending Moderation ({pendingReviews.length})</h2>
            {pendingReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border border-dashed">No new stories to review.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingReviews.map(review => (
                  <Card key={review.id} className="shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{review.alumniName}</CardTitle>
                          <CardDescription className="text-xs">{review.trade} • {review.passoutYear}</CardDescription>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(review.rating || 5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current"/>)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm italic text-muted-foreground py-2">
                      "{review.message}"
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => handleReviewAction(review.id, 'approved')} variant="outline" className="flex-1 text-green-700 bg-green-50/50 hover:bg-green-50 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Approve</Button>
                      <Button size="sm" onClick={() => handleReviewAction(review.id, 'rejected')} variant="outline" className="flex-1 text-red-700 bg-red-50/50 hover:bg-red-50 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Reject</Button>
                      <Button size="sm" onClick={() => handleReviewAction(review.id, 'deleted')} variant="ghost" className="text-destructive"><Trash2 className="w-3 h-3"/></Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Approved Stories */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-green-600"><CheckCircle className="w-5 h-5"/> Live on Website ({approvedReviews.length})</h2>
            {approvedReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg border border-dashed">No approved stories yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedReviews.map(review => (
                  <Card key={review.id} className="shadow-sm border-l-4 border-l-green-600">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{review.alumniName}</CardTitle>
                          <CardDescription className="text-xs">{review.trade}</CardDescription>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleReviewAction(review.id, 'deleted')}>
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm italic py-2">
                      "{review.message}"
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </TabsContent>

        <TabsContent value="directory" className="space-y-8 pt-6">
          <Card className="border-primary/20 border-t-4 shadow-md bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Add New Alumni Profile</CardTitle>
              <CardDescription>Created profiles appear in the alumni directory list below.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={newAlumni.name} onChange={e => setNewAlumni(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Rahul Kumar" />
              </div>
              <div className="space-y-2">
                <Label>Trade</Label>
                <Input value={newAlumni.trade} onChange={e => setNewAlumni(prev => ({ ...prev, trade: e.target.value }))} placeholder="e.g. Electrician" />
              </div>
              <div className="space-y-2">
                <Label>Passout Year</Label>
                <Input value={newAlumni.passoutYear} onChange={e => setNewAlumni(prev => ({ ...prev, passoutYear: e.target.value }))} placeholder="e.g. 2022" />
              </div>
              <div className="space-y-2">
                <Label>Current Status / Job</Label>
                <Input value={newAlumni.currentJob} onChange={e => setNewAlumni(prev => ({ ...prev, currentJob: e.target.value }))} placeholder="e.g. Working at BHEL" />
              </div>
              <div className="space-y-2">
                <Label>Photo (Auto-resize)</Label>
                <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </div>
              <Button onClick={handleAddAlumni} disabled={saving} className="w-full">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} Create Profile
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumni.map(al => (
              <Card key={al.id} className="overflow-hidden group hover:shadow-lg transition-all border-none shadow-sm bg-card ring-1 ring-muted">
                <CardHeader className="flex flex-row items-center gap-4 pb-3 bg-muted/20 relative">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteAlumni(al.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {al.photo ? (
                    <img src={al.photo} alt={al.name} className="w-12 h-12 rounded-full object-cover shadow-sm bg-muted border-2 border-white" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white border shadow-sm flex items-center justify-center"><User className="text-muted-foreground w-6 h-6" /></div>
                  )}
                  <div className="pr-8">
                    <CardTitle className="text-base line-clamp-1">{al.name}</CardTitle>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{al.trade}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-6">
                  <p className="text-xs text-muted-foreground mb-2">Class of {al.passoutYear}</p>
                  <p className="text-xs font-semibold h-8 line-clamp-2">{al.currentJob || "Successfully Placed"}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
