"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase/provider';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Send, Star } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function AlumniSubmissionPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const [formData, setFormData] = useState({
    alumniName: '',
    passoutYear: '',
    trade: '',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setRating = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.alumniName || !formData.trade || !formData.message || !formData.passoutYear) {
      return toast({ title: "Incomplete", description: "All fields are required.", variant: "destructive" });
    }
    
    setIsSubmitting(true);
    
    try {
      // 1. Save to Firestore as pending
      await addDoc(collection(firestore, 'alumniReviews'), {
        ...formData,
        status: 'pending',
        createdAt: Timestamp.now()
      });
      
      setSubmitted(true);
      toast({ title: "Success", description: "Your review has been submitted for admin approval." });
      
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-headline font-bold text-primary mb-2">Alumni Reviews</h1>
            <p className="text-slate-600 text-lg">Share your experience at MPITI Saharanpur with future students.</p>
          </div>

          {submitted ? (
            <Card className="text-center py-12 shadow-lg border-t-4 border-t-primary">
              <CardContent>
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
                <p className="text-slate-600">Your review has been submitted successfully and is awaiting admin moderation. Once approved, it will appear on the homepage.</p>
                <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>Submit Another</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle>Submit Your Review</CardTitle>
                <CardDescription>Share your honest experience to help prospective students.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Full Name</Label>
                       <Input name="alumniName" value={formData.alumniName} onChange={handleChange} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                       <Label>Trade / Course</Label>
                       <Input name="trade" value={formData.trade} onChange={handleChange} placeholder="e.g. Fitter" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                     <Label>Passout Year</Label>
                     <Input name="passoutYear" type="number" min="1990" max="2030" value={formData.passoutYear} onChange={handleChange} placeholder="2022" />
                  </div>
                  
                  <div className="space-y-2">
                     <Label>Rating</Label>
                     <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                           <button 
                             key={star} 
                             type="button" 
                             onClick={() => setRating(star)}
                             className="focus:outline-none transition-transform hover:scale-110"
                           >
                             <Star className={`w-8 h-8 ${formData.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label>Your Experience</Label>
                     <Textarea 
                       name="message" 
                       value={formData.message} 
                       onChange={handleChange} 
                       placeholder="Tell us about your time at MPITI and how it helped your career..." 
                       rows={5}
                     />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                    {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                    Submit Review for Moderation
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
