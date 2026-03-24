"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useApp } from '@/components/providers/AppProviders';
import { GoogleTranslate } from '@/components/ui/GoogleTranslate';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { 
  Menu, 
  LogIn, 
  Sun, 
  Moon, 
  Globe, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { theme, toggleTheme, language, setLanguage } = useApp();
  const db = useFirestore();

  const configQuery = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'siteSettings', 'config');
  }, [db]);

  const { data: siteSettings } = useDoc(configQuery);

  const defaultLogo = PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl;
  const logoUrl = siteSettings?.logo || defaultLogo;

  const labels = {
    en: { home: 'Home', admission: 'Admission', contact: 'Contact', login: 'Student Login', admin: 'Admin', langName: 'English' },
    hi: { home: 'मुख्य पृष्ठ', admission: 'प्रवेश फॉर्म', contact: 'संपर्क', login: 'छात्र लॉगिन', admin: 'एडमिन', langName: 'हिंदी' }
  }[language];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg flex items-center justify-center bg-white shadow-sm">
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

        <div className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">{labels.home}</Link>
          <Link href="/admission" className="text-sm font-medium hover:text-primary transition-colors">{labels.admission}</Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">{labels.contact}</Link>
          
          <div className="h-6 w-px bg-border mx-2" />

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {/* Google Translate Integration */}
            <GoogleTranslate />

            <Button variant="ghost" asChild size="sm">
              <Link href="/login" className="gap-2">
                <LogIn className="w-4 h-4" /> {labels.login}
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-md">
              <Link href="/login?type=admin" className="gap-2">
                <ShieldCheck className="w-4 h-4" /> {labels.admin}
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="text-left">
                <SheetTitle className="font-headline text-2xl text-primary">MPITI Saharanpur</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Language</h3>
                  <div className="flex justify-center p-2 bg-muted/30 rounded-xl">
                    <GoogleTranslate />
                  </div>
                </div>
                <div className="h-px bg-border w-full" />
                <div className="grid grid-cols-1 gap-2">
                   <Button asChild variant="ghost" className="justify-start gap-3"><Link href="/">{labels.home}</Link></Button>
                   <Button asChild variant="ghost" className="justify-start gap-3"><Link href="/admission">{labels.admission}</Link></Button>
                   <Button asChild variant="ghost" className="justify-start gap-3"><Link href="/contact">{labels.contact}</Link></Button>
                   <Button asChild className="justify-start gap-3 bg-primary"><Link href="/login?type=admin"><ShieldCheck className="w-4 h-4" /> {labels.admin} Login</Link></Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
