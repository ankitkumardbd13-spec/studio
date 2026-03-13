
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'admin') setLoginType('admin');
    else setLoginType('student');
  }, [searchParams]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login
    if (loginType === 'admin') {
      toast({ title: "Welcome Admin", description: "Successfully logged into management panel." });
      router.push('/admin/dashboard');
    } else {
      toast({ title: "Welcome Back", description: "Successfully logged into student portal." });
      router.push('/student/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
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
                  <Label htmlFor="password">{loginType === 'admin' ? "Password" : "Date of Birth (YYYY-MM-DD)"}</Label>
                  <Input 
                    id="password" 
                    type={loginType === 'admin' ? "password" : "text"} 
                    placeholder={loginType === 'admin' ? "••••••••" : "2002-05-15"} 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-11">
                  Login Access
                </Button>

                <div className="text-center space-y-4 pt-2">
                  {loginType === 'student' && (
                    <p className="text-sm">
                      New Student? <Link href="/signup" className="text-primary font-bold hover:underline">Register for Portal</Link>
                    </p>
                  )}
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
      </div>
    </main>
  );
}
