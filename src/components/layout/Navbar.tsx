
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  LogIn, 
  BookOpen, 
  Phone, 
  FileText, 
  UserPlus,
  GraduationCap,
  ShieldCheck,
  BookMarked
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">MP</div>
          <span className="font-headline text-xl text-primary hidden md:block">MPITI Saharanpur</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="/admission" className="text-sm font-medium hover:text-primary transition-colors">Admission Form</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/login" className="gap-2">
                <LogIn className="w-4 h-4" /> Student Login
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-secondary hover:bg-secondary/90 text-white">
              <Link href="/signup" className="gap-2">
                <UserPlus className="w-4 h-4" /> Portal Registration
              </Link>
            </Button>
          </div>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <SheetHeader className="text-left">
                <SheetTitle className="font-headline text-2xl text-primary">MPITI Saharanpur</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Student Portal</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button asChild variant="outline" className="justify-start gap-3">
                      <Link href="/login?type=student">
                        <GraduationCap className="w-4 h-4" />
                        Portal Login
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start gap-3">
                      <Link href="/signup">
                        <UserPlus className="w-4 h-4" />
                        Portal Registration
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start gap-3">
                      <Link href="/student/syllabus">
                        <BookMarked className="w-4 h-4 text-secondary" />
                        View Syllabus
                      </Link>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Administration</h3>
                  <Button asChild variant="outline" className="justify-start gap-3 w-full border-primary/20 hover:bg-primary/5">
                    <Link href="/login?type=admin">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Admin Login
                    </Link>
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Information</h3>
                  <div className="grid grid-cols-1 gap-1">
                    <Button asChild variant="ghost" className="justify-start gap-3 w-full">
                      <Link href="/">
                        <BookOpen className="w-4 h-4" />
                        Home
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start gap-3 w-full">
                      <Link href="/admission">
                        <FileText className="w-4 h-4" />
                        Admission Form
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="justify-start gap-3 w-full">
                      <Link href="/contact">
                        <Phone className="w-4 h-4" />
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
