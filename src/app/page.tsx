"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, GraduationCap, BookOpen, ClipboardList, ShieldCheck, LayoutGrid, Quote, Loader2, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/hooks/use-memo-firebase';
import { useApp } from '@/components/providers/AppProviders';

export default function Home() {
  const { language } = useApp();
  const db = useFirestore();
  
  const configQuery = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'siteSettings', 'config');
  }, [db]);

  const { data: siteSettings, loading } = useDoc(configQuery);

  const defaultData = {
    address: 'Village Post Rankhandi, Deoband, Dist Saharanpur, UP, PIN 247554',
    phone1: '+91 98765 43210',
    email: 'info@mpitisre.edu.in',
    chairmanMsg: 'Our mission is to empower the youth with skills that lead to sustainable employment.',
    chairmanPhoto: PlaceHolderImages.find(i => i.id === 'chairman')?.imageUrl || '',
    principalMsg: 'Welcome to MPITI. We provide a disciplined environment for learning modern trades.',
    principalPhoto: PlaceHolderImages.find(i => i.id === 'principal')?.imageUrl || '',
    studentMsg: 'MPITI transformed my life. The practical sessions in the Electrician lab gave me confidence.',
    studentPhoto: PlaceHolderImages.find(i => i.id === 'student-rep')?.imageUrl || '',
    heroTitle: 'Maharana Pratap ITI Saharanpur',
    heroSub: 'Village Post Rankhandi, Deoband - Providing Excellence Since 2015'
  };

  const data = siteSettings ? { ...defaultData, ...siteSettings } : defaultData;

  const content = {
    en: {
      ctaInquiry: 'NEW ADMISSION INQUIRY',
      ctaPortal: 'STUDENT PORTAL',
      established: 'Established 2015',
      years: 'Years of Excellence',
      approved: 'DGT/NCVT Approved',
      certified: 'Government Certified',
      leadership: 'Leadership Messages',
      guiding: 'Guiding MPITI Rankhandi towards skill excellence',
      chairman: 'Chairman',
      principal: 'Principal',
      success: 'Success Story'
    },
    hi: {
      ctaInquiry: 'नया प्रवेश पूछताछ',
      ctaPortal: 'छात्र पोर्टल',
      established: 'स्थापना 2015',
      years: 'उत्कृष्टता के वर्ष',
      approved: 'DGT/NCVT स्वीकृत',
      certified: 'सरकारी प्रमाणित',
      leadership: 'नेतृत्व संदेश',
      guiding: 'कौशल उत्कृष्टता की ओर MPITI का मार्गदर्शन',
      chairman: 'अध्यक्ष',
      principal: 'प्रधानाचार्य',
      success: 'सफलता की कहानी'
    }
  }[language];

  const galleryItems = [
    { id: 'g1', url: 'https://picsum.photos/seed/ailab1/800/600', title: 'Electrical Lab' },
    { id: 'g2', url: 'https://picsum.photos/seed/aiclass1/800/600', title: 'Theory Class' },
    { id: 'g3', url: 'https://picsum.photos/seed/aiequip1/800/600', title: 'Workshop Equipment' },
    { id: 'g4', url: 'https://picsum.photos/seed/itiaihero/800/600', title: 'Campus View' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[750px] w-full flex items-center justify-center">
        <Image
          src={PlaceHolderImages.find(img => img.id === 'iti-hero')?.imageUrl || ''}
          alt="Campus"
          fill
          className="object-cover brightness-[0.35]"
          priority
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="mb-8 relative w-28 h-28 bg-white rounded-3xl p-3 mx-auto shadow-2xl overflow-hidden">
             <Image src={data.logo || PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl || ''} alt="Logo" fill className="object-contain p-2" />
          </div>
          <h1 className="font-headline text-5xl md:text-8xl text-white mb-6 drop-shadow-2xl font-bold tracking-tight">
            {data.heroTitle}
          </h1>
          <p className="text-xl md:text-3xl text-white/90 mb-10 max-w-4xl mx-auto drop-shadow-lg font-medium">
            {data.heroSub}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-white h-16 px-12 text-xl font-black gap-3 shadow-xl transition-all hover:scale-105">
              <Link href="/admission"><ClipboardList className="w-6 h-6"/> {content.ctaInquiry}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white text-primary h-16 px-12 text-xl font-bold gap-3 transition-transform hover:scale-105 shadow-2xl">
              <Link href="/login"><GraduationCap className="w-6 h-6"/> {content.ctaPortal}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50 border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4"><CheckCircle className="w-6 h-6" /></div>
              <h3 className="font-bold mb-1">{content.established}</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{content.years}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50 border">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4"><ShieldCheck className="w-6 h-6" /></div>
              <h3 className="font-bold mb-1">{content.approved}</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{content.certified}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50 border">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4"><BookOpen className="w-6 h-6" /></div>
              <h3 className="font-bold mb-1">Advanced Workshops</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Practical Training</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/50 border">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4"><GraduationCap className="w-6 h-6" /></div>
              <h3 className="font-bold mb-1">Job Placement</h3>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Industrial Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Messages */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-5xl text-primary font-bold mb-4">{content.leadership}</h2>
          <p className="text-muted-foreground text-lg mb-16">{content.guiding}</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: content.chairman, msg: data.chairmanMsg, photo: data.chairmanPhoto, color: 'primary' },
              { title: content.principal, msg: data.principalMsg, photo: data.principalPhoto, color: 'secondary' },
              { title: content.success, msg: data.studentMsg, photo: data.studentPhoto, color: 'blue-600' }
            ].map((lead, i) => (
              <Card key={i} className="border-none shadow-xl bg-card overflow-hidden group flex flex-col items-center pt-10 text-center">
                <div className={`w-48 h-48 rounded-full overflow-hidden border-4 border-${lead.color}/20 shadow-lg relative shrink-0`}>
                  <img src={lead.photo} alt={lead.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="mt-6 px-4">
                   <p className={`text-${lead.color} font-bold text-xl uppercase tracking-tight`}>{lead.title}</p>
                   <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4">MPITI Rankhandi</p>
                </div>
                <CardContent className="pt-4 pb-10 relative">
                  <Quote className="absolute -top-2 right-4 w-10 h-10 opacity-5" />
                  <p className="italic text-muted-foreground leading-relaxed font-medium px-4">"{lead.msg}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="font-headline text-5xl text-primary font-bold mb-2">Campus Gallery</h2>
            <p className="text-muted-foreground text-lg">Modern Workshops for Practical Technical Training</p>
          </div>
          <Button variant="outline" className="gap-2"><LayoutGrid className="w-4 h-4"/> View All</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
              <img src={item.url} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <p className="text-white font-bold text-center">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-14 h-14 bg-white rounded-xl p-1.5 shadow-lg flex items-center justify-center">
                   <img src={data.logo || PlaceHolderImages.find(img => img.id === 'iti-logo')?.imageUrl || ''} alt="Logo" className="object-contain w-full h-full" />
                </div>
                <h2 className="font-headline text-3xl text-primary font-bold">MPITI</h2>
              </div>
              <p className="opacity-70 text-lg leading-relaxed font-medium">{data.heroSub}</p>
            </div>
            <div>
              <h3 className="font-bold mb-6 uppercase text-sm tracking-[0.2em] text-secondary">Quick Links</h3>
              <ul className="space-y-3 opacity-80 font-medium">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li><Link href="/admission" className="hover:text-primary">Admission</Link></li>
                <li><Link href="/login" className="hover:text-primary">Student Login</Link></li>
              </ul>
            </div>
            <div>
               <h3 className="font-bold mb-6 uppercase text-sm tracking-[0.2em] text-secondary">Contact</h3>
               <div className="space-y-4 opacity-80 font-medium text-sm">
                 <p className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary shrink-0" /> {data.address}</p>
                 <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary shrink-0" /> {data.phone1}</p>
                 <p className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary shrink-0" /> {data.email}</p>
               </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 text-center text-[10px] opacity-50 font-bold uppercase tracking-[0.2em]">
            © 2024 Maharana Pratap ITI Rankhandi. Established 2015. NCVT Approved.
          </div>
        </div>
      </footer>
    </main>
  );
}