
"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Send, GraduationCap } from 'lucide-react';

export default function AdmissionPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate inquiry submission
    setTimeout(() => {
      toast({
        title: "Inquiry Submitted!",
        description: "Our admission counselor will contact you on your mobile number shortly.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-2xl">
            <CardHeader className="bg-secondary text-white rounded-t-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="font-headline text-3xl">Admission Inquiry 2024-25</CardTitle>
                  <CardDescription className="text-white/80 font-medium">Interested in joining MPITI? Fill this form and we'll call you.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="candidateName">Candidate's Full Name</Label>
                    <Input id="candidateName" placeholder="Enter your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Father's Name</Label>
                    <Input id="parentName" placeholder="Enter father's name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" type="tel" placeholder="+91" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Highest Qualification</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8th">8th Pass</SelectItem>
                        <SelectItem value="10th">10th Pass</SelectItem>
                        <SelectItem value="12th">12th Pass</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trade Interested In</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Trade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electrician">Electrician</SelectItem>
                        <SelectItem value="fitter">Fitter</SelectItem>
                        <SelectItem value="copa">COPA (Computer Operator)</SelectItem>
                        <SelectItem value="welder">Welder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City / Village</Label>
                    <Input id="city" placeholder="e.g. Saharanpur" required />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-white gap-2">
                    {isSubmitting ? "Submitting..." : <><Send className="w-5 h-5" /> Submit Admission Request</>}
                  </Button>
                </div>
                
                <div className="mt-8 p-4 bg-accent/30 rounded-lg flex items-start gap-4">
                  <GraduationCap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-sm">
                    <p className="font-bold text-primary">Already a student?</p>
                    <p className="text-muted-foreground">If you are already admitted to MPITI and want to register for the student portal, please use the <a href="/signup" className="text-secondary underline font-bold">Portal Registration Form</a>.</p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
