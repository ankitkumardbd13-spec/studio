"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase/provider';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, Home, User, BookOpen, CreditCard, Bookmark, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';

import { StudentData, StudentContext } from '@/hooks/use-student';

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const firestore = useFirestore();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      try {
        const docRef = doc(firestore, 'students', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().status === 'approved') {
          setStudent(docSnap.data() as StudentData);
        } else {
          await auth.signOut();
          router.push('/login');
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 font-bold text-slate-500 text-sm">Loading Student Workspace...</p>
      </div>
    );
  }

  if (!student) return null;

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const NavLinks = () => (
    <>
      <Link href="/student/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${pathname === '/student/dashboard' ? 'bg-primary text-primary-foreground shadow' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'}`}>
        <Home className="w-5 h-5" /> Dashboard Home
      </Link>
      <Link href="/student/dashboard/profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${pathname === '/student/dashboard/profile' ? 'bg-primary text-primary-foreground shadow' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'}`}>
        <User className="w-5 h-5" /> My Profile
      </Link>
      <Link href="/student/dashboard/assignments" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${pathname === '/student/dashboard/assignments' ? 'bg-primary text-primary-foreground shadow' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'}`}>
        <BookOpen className="w-5 h-5" /> Assignments
      </Link>
      <Link href="/student/dashboard/fees" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${pathname === '/student/dashboard/fees' ? 'bg-primary text-primary-foreground shadow' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'}`}>
        <CreditCard className="w-5 h-5" /> Fees Detail
      </Link>
      <Link href="/student/dashboard/syllabus" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${pathname === '/student/dashboard/syllabus' ? 'bg-primary text-primary-foreground shadow' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'}`}>
        <Bookmark className="w-5 h-5" /> Syllabus
      </Link>
      <Link href="/student/dashboard/id-card" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${pathname === '/student/dashboard/id-card' ? 'bg-primary text-primary-foreground shadow' : 'text-slate-600 hover:bg-primary/5 hover:text-primary'}`}>
        <CreditCard className="w-5 h-5" /> Digital ID Card
      </Link>
    </>

  );

  return (
    <StudentContext.Provider value={student}>
      <div className="flex min-h-screen bg-slate-50">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200">
          <div className="p-6 border-b border-slate-100 text-center">
            {student.photo ? (
              <img src={student.photo} alt="Student" className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-primary/20 mb-3" />
            ) : (
              <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center border-4 border-slate-200 mb-3">
                <User className="w-10 h-10 text-slate-400" />
              </div>
            )}
            <h2 className="font-headline text-lg font-bold text-slate-800 line-clamp-1">{student.name}</h2>
            <p className="text-primary font-bold text-xs uppercase tracking-wide">{student.trade}</p>
          </div>
          <div className="p-4 flex-1 space-y-2">
            <NavLinks />
          </div>
          <div className="p-4 border-t border-slate-100">
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 font-bold gap-3">
              <LogOut className="w-5 h-5" /> Secure Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Nav & Content */}
        <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
            <div className="flex items-center gap-3">
               {student.photo ? (
                 <img src={student.photo} className="w-10 h-10 rounded-full object-cover" alt="Student" />
               ) : (
                 <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-slate-400" /></div>
               )}
               <h2 className="font-headline text-lg font-bold text-primary truncate max-w-[150px]">{student.name}</h2>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 flex flex-col">
                <SheetTitle className="sr-only">Student Navigation</SheetTitle>
                <SheetDescription className="sr-only">Menu links for the student portal</SheetDescription>
                <div className="p-6 border-b text-center">
                  <h2 className="font-headline text-xl font-bold text-primary">MPITI Portal</h2>
                </div>
                <div className="p-4 flex-1 space-y-2">
                  <NavLinks />
                </div>
                <div className="p-4 border-t">
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 font-bold gap-3">
                    <LogOut className="w-5 h-5" /> Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </header>
          
          <div className="flex-1 overflow-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </StudentContext.Provider>
  );
}
