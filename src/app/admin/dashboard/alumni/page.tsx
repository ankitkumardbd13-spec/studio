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
  
  const [newReview, setNewReview] = useState({ alumniName: '', trade: '', passoutYear: '', message: '', rating: 5 });
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
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Success Stories Management</h1>
        <p className="text-muted-foreground mt-1">Moderate and manage success stories shown on the home page.</p>
      </div>

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
                  "{review.message}"
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
                  "{review.message}"
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
