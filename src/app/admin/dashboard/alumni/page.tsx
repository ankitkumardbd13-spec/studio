"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useFirebaseApp } from '@/firebase/provider';
import { collection, query, getDocs, addDoc, updateDoc, doc, where } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { compressImage } from '@/lib/image-utils';
import { Loader2, Plus, User, CheckCircle, XCircle, Star, MessageSquare } from 'lucide-react';

export default function AlumniPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const storage = getStorage(useFirebaseApp());
  
  const [alumni, setAlumni] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newAlumni, setNewAlumni] = useState({ name: '', trade: '', passoutYear: '', currentJob: '', photo: '' });

  useEffect(() => {
    fetchData();
  }, [firestore]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Alumni Directory
      const qAlumni = query(collection(firestore, 'alumni'));
      const snapAlumni = await getDocs(qAlumni);
      setAlumni(snapAlumni.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Pending Reviews
      const qReviews = query(collection(firestore, 'alumniReviews'), where('status', '==', 'pending'));
      const snapReviews = await getDocs(qReviews);
      setReviews(snapReviews.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
    } catch (err) {
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

  const handleAdd = async () => {
    if (!newAlumni.name || !newAlumni.trade || !newAlumni.passoutYear) {
      toast({ title: "Validation Error", description: "Please fill out Name, Trade, and Passout Year.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const docRef = await addDoc(collection(firestore, 'alumni'), newAlumni);
      setAlumni(prev => [{ id: docRef.id, ...newAlumni }, ...prev]);
      setNewAlumni({ name: '', trade: '', passoutYear: '', currentJob: '', photo: '' });
      toast({ title: "Success", description: "Alumni added." });
    } catch (err) {
      toast({ title: "Error", description: "Could not add alumni.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReviewAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(firestore, 'alumniReviews', id), { status: action });
      setReviews(prev => prev.filter(r => r.id !== id));
      toast({ title: `Review ${action}`, description: `The review has been ${action}.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update review status.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Success Stories & Alumni</h1>
        <p className="text-muted-foreground mt-1">Manage alumni profiles and moderate success stories/reviews.</p>
      </div>

      {/* Reviews Moderation Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="w-6 h-6"/> Pending Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground bg-slate-50 border-dashed border rounded p-6 text-center">No pending reviews require moderation.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <Card key={review.id} className="border-t-4 border-t-amber-500 shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-start">
                    {review.alumniName}
                    <div className="flex text-amber-500">
                      {[...Array(review.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current"/>)}
                    </div>
                  </CardTitle>
                  <CardDescription>{review.trade} ({review.passoutYear})</CardDescription>
                </CardHeader>
                <CardContent className="text-sm italic text-slate-700 bg-slate-50 mx-4 p-3 rounded mb-4">
                  "{review.message}"
                </CardContent>
                <CardFooter className="flex gap-2 pt-0">
                  <Button onClick={() => handleReviewAction(review.id, 'approved')} variant="outline" className="flex-1 text-green-700 border-green-200 hover:bg-green-50"><CheckCircle className="w-4 h-4 mr-2"/> Approve</Button>
                  <Button onClick={() => handleReviewAction(review.id, 'rejected')} variant="outline" className="flex-1 text-red-700 border-red-200 hover:bg-red-50"><XCircle className="w-4 h-4 mr-2"/> Reject</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* Alumni Directory Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><User className="w-6 h-6"/> Alumni Directory</h2>
        
        <Card className="border-secondary border-t-4 shadow-md">
          <CardHeader>
            <CardTitle>Add New Alumni Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={newAlumni.name} onChange={e => setNewAlumni(prev => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Trade</Label>
              <Input value={newAlumni.trade} onChange={e => setNewAlumni(prev => ({ ...prev, trade: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Passout Year</Label>
              <Input value={newAlumni.passoutYear} onChange={e => setNewAlumni(prev => ({ ...prev, passoutYear: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Photo (Auto-resize)</Label>
              <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </div>
            <Button onClick={handleAdd} disabled={saving} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />} Add Profile
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {alumni.map(al => (
            <Card key={al.id} className="overflow-hidden hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center gap-4 pb-3 bg-slate-50">
                {al.photo ? (
                  <img src={al.photo} alt={al.name} className="w-14 h-14 rounded-full object-cover shadow-sm bg-muted border-2 border-white" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white border shadow-sm flex items-center justify-center"><User className="text-muted-foreground" /></div>
                )}
                <div>
                  <CardTitle className="text-lg">{al.name}</CardTitle>
                  <p className="text-xs font-semibold text-primary">{al.trade}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Class of {al.passoutYear}</p>
                {al.currentJob && <p className="text-sm mt-2 font-medium">Currently: {al.currentJob}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
