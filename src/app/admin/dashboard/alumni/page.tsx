"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useFirebaseApp } from '@/firebase';
import { collection, query, getDocs, addDoc, updateDoc, doc, where, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { compressImage } from '@/lib/image-utils';
import { Loader2, Plus, User, CheckCircle, XCircle, Star, MessageSquare, Trash2, Clock } from 'lucide-react';

export default function AlumniPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const firebaseApp = useFirebaseApp();
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [newReview, setNewReview] = useState({ alumniName: '', trade: '', passoutYear: '', message: '', rating: 5, photo: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);

  useEffect(() => {
    if (firestore) {
      fetchData();
    }
  }, [firestore]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Reviews
      const qReviews = query(collection(firestore, 'alumniReviews'));
      const snapReviews = await getDocs(qReviews);
      const allReviews = snapReviews.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      setPendingReviews(allReviews.filter(r => r.status === 'pending'));
      setApprovedReviews(allReviews.filter(r => r.status === 'approved'));
      
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to load alumni data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.alumniName || !newReview.message) return;
    
    setSaving(true);
    try {
      let photoUrl = '';
      if (photoFile && firebaseApp) {
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `alumni/${Date.now()}_${photoFile.name}`);
        
        // Compress and upload using the file directly
        const compressed = await compressImage(photoFile);
        await uploadString(storageRef, compressed, 'data_url');
        photoUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(firestore, 'alumniReviews'), {
        ...newReview,
        photo: photoUrl,
        status: 'approved', // Admin created stories are pre-approved
        timestamp: new Date().toISOString()
      });

      toast({ title: "Success", description: "Success story created successfully!" });
      setNewReview({ alumniName: '', trade: '', passoutYear: '', message: '', rating: 5, photo: '' });
      setPhotoFile(null);
      setPhotoPreview('');
      setShowCreateForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to create success story.", variant: "destructive" });
    } finally {
      setSaving(false);
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
        // Refresh local state
        fetchData();
        toast({ title: `Review ${action}`, description: `The review has been ${action}.` });
      }
    } catch (err) {
      toast({ title: "Error", description: "Operation failed.", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Success Stories Management</h1>
          <p className="text-muted-foreground mt-1">Moderate and manage success stories shown on the home page.</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          {showCreateForm ? <XCircle className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
          {showCreateForm ? 'Cancel' : 'Create New Success Story'}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-primary/20 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle>Add New Success Story</CardTitle>
            <CardDescription>Manually add a successful student's story to the home page.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateStory}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Alumni Name</Label>
                  <Input id="name" required value={newReview.alumniName} onChange={e => setNewReview({...newReview, alumniName: e.target.value})} placeholder="e.g. Rahul Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trade">Trade</Label>
                  <Input id="trade" value={newReview.trade} onChange={e => setNewReview({...newReview, trade: e.target.value})} placeholder="e.g. Electrician" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Passout Year</Label>
                  <Input id="year" value={newReview.passoutYear} onChange={e => setNewReview({...newReview, passoutYear: e.target.value})} placeholder="e.g. 2023" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input id="rating" type="number" min="1" max="5" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Story/Review Message</Label>
                <textarea 
                  id="message" 
                  required 
                  className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newReview.message}
                  onChange={e => setNewReview({...newReview, message: e.target.value})}
                  placeholder="Share the student's achievement..."
                />
              </div>
              <div className="space-y-2">
                <Label>Student Photo (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" accept="image/*" onChange={handlePhotoChange} className="max-w-xs" />
                  {photoPreview && (
                    <div className="w-16 h-16 rounded-full overflow-hidden border">
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>Discard</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <CheckCircle className="w-4 h-4 mr-2"/>}
                Save Success Story
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Clock className="w-6 h-6 text-amber-500"/> Pending Moderation</h2>
        {pendingReviews.length === 0 ? (
          <p className="text-muted-foreground bg-slate-50 border-dashed border rounded p-6 text-center">No pending reviews require moderation.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingReviews.map(review => (
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
                  <div className="flex gap-3">
                    {review.photo && (
                       <img src={review.photo} className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200" alt="" />
                    )}
                    <p className="flex-grow">"{review.message}"</p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-0">
                  <Button onClick={() => handleReviewAction(review.id, 'approved')} variant="outline" className="flex-1 text-green-700 border-green-200 hover:bg-green-50"><CheckCircle className="w-4 h-4 mr-2"/> Approve</Button>
                  <Button onClick={() => handleReviewAction(review.id, 'deleted')} variant="outline" className="flex-1 text-red-700 border-red-200 hover:bg-red-50"><Trash2 className="w-4 h-4 mr-2"/> Reject</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> Approved Stories (Live)</h2>
        {approvedReviews.length === 0 ? (
          <p className="text-muted-foreground bg-slate-50 border-dashed border rounded p-6 text-center">No approved stories yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedReviews.map(review => (
              <Card key={review.id} className="border-t-4 border-t-green-500 shadow-md">
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
                  <div className="flex gap-3">
                    {review.photo && (
                       <img src={review.photo} className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200" alt="" />
                    )}
                    <p className="flex-grow">"{review.message}"</p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-0">
                  <Button onClick={() => handleReviewAction(review.id, 'deleted')} variant="ghost" className="w-full text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4 mr-2"/> Remove from Website</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
