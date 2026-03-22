
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, User, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useFirestore } from '@/firebase/provider';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'admin') setLoginType('admin');
    else setLoginType('student');
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginType === 'admin') {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome Admin", description: "Successfully logged into management panel." });
        router.push('/admin/dashboard');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        // Check student status in Firestore
        const studentRef = doc(firestore, 'students', uid);
        const studentDoc = await getDoc(studentRef);
        
        if (studentDoc.exists()) {
          const status = studentDoc.data().status;
          if (status === 'pending') {
            await auth.signOut();
            throw new Error("Your registration is still under review by Admin.");
          } else if (status === 'blocked') {
            await auth.signOut();
            throw new Error("Your account has been blocked by Admin.");
          } else if (status !== 'approved') {
            await auth.signOut();
            throw new Error("Your account lacks portal access permissions.");
          }
        } else {
          await auth.signOut();
          throw new Error("Student profile not found.");
        }
        
        toast({ title: "Welcome Back", description: "Successfully logged into student portal." });
        router.push('/student/dashboard');
      }
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-2xl border-none">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg text-center">
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-white/20 rounded-full">
                {loginType === 'admin' ? <ShieldCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
             </div>
          </div>
          <CardTitle className="font-headline text-2xl">
            {loginType === 'admin' ? "Admin Portal Login" : "Student Portal Login"}
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {loginType === 'admin' ? "Secure access for ITI management" : "Access your assignments, results and ID card"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{loginType === 'admin' ? "Password" : "Password (DOB Format: DDMMYYYY)"}</Label>
              <Input 
                id="password" 
                type={loginType === 'admin' ? "password" : "text"} 
                placeholder={loginType === 'admin' ? "••••••••" : "15052002"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={loginType === 'admin' ? undefined : 8}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-11">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {loading ? "Authenticating..." : "Login Access"}
            </Button>

            <div className="text-center space-y-4 pt-2">
              <button 
                type="button"
                onClick={() => setLoginType(loginType === 'student' ? 'admin' : 'student')}
                className="text-xs text-muted-foreground hover:text-primary underline"
              >
                Switch to {loginType === 'student' ? 'Admin' : 'Student'} Login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading login portal...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </main>
  );
}
