
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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

export function Navbar() {
  const [siteLogo, setSiteLogo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mpiti_site_settings');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.logo) setSiteLogo(data.logo);
    }
  }, []);

  const defaultLogo = PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;
  const logoUrl = siteLogo || defaultLogo;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg flex items-center justify-center bg-white">
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="MPITI Logo" 
                className="w-full h-full object-contain" 
              />
            )}
          </div>
          <span className="font-headline text-xl text-primary hidden md:block">MPITI Saharanpur</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="/admission" className="text-sm font-medium hover:text-primary transition-colors">Admission Form</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
          <div className="h-6 w-px bg-border mx-2" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/login" className="gap-2">
                <LogIn className="w-4 h-4" /> Student Login
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/login?type=admin" className="gap-2">
                <ShieldCheck className="w-4 h-4" /> Admin Login
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
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Portals</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button asChild variant="outline" className="justify-start gap-3">
                      <Link href="/login?type=student">
                        <GraduationCap className="w-4 h-4" />
                        Student Login
                      </Link>
                    </Button>
                    <Button asChild variant="default" className="justify-start gap-3 bg-primary">
                      <Link href="/login?type=admin">
                        <ShieldCheck className="w-4 h-4" />
                        Admin Login
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

                <div className="h-px bg-border w-full" />

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
                      <Link href="/signup">
                        <UserPlus className="w-4 h-4" />
                        New Registration
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
