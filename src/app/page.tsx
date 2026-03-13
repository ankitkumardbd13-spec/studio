"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, GraduationCap, BookOpen, ClipboardList, ShieldCheck, LayoutGrid, Quote, Loader2, Info, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/hooks/use-memo-firebase';

export default function Home() {
  const db = useFirestore();
  const configQuery = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'siteSettings', 'config');
  }, [db]);

  const { data: siteSettings, loading } = useDoc(configQuery);

  const defaultData = {
    address: 'Village Post Rankhandi, Deoband, Dist Saharanpur, UP, PIN 247554',
    phone1: '+91 98765 43210',
    phone2: '+91 12345 67890',
    email: 'info@mpitisre.edu.in',
    chairmanMsg: 'Our mission is to empower the youth with skills that lead to sustainable employment.',
    chairmanPhoto: PlaceHolderImages.find(i => i.id === 'chairman')?.imageUrl || '',
    principalMsg: 'Welcome to MPITI. We provide a disciplined environment for learning modern trades.',
    principalPhoto: PlaceHolderImages.find(i => i.id === 'principal')?.imageUrl || '',
    studentMsg: 'MPITI transformed my life. The practical sessions in the Electrician lab gave me the confidence to secure a job in a leading industry.',
    studentPhoto: PlaceHolderImages.find(i => i.id === 'student-rep')?.imageUrl || '',
    heroTitle: 'Maharana Pratap ITI Saharanpur',
    heroSub: 'Village Post Rankhandi, Deoband - Providing Excellence in Technical Skills Since 2015'
  };

  const data = siteSettings ? { ...defaultData, ...siteSettings } : defaultData;

  const galleryItems = [
    { id: 'g1', url: 'https://picsum.photos/seed/ailab1/800/600', title: 'Electrical Lab' },
    { id: 'g2', url: 'https://picsum.photos/seed/aiclass1/800/600', title: 'Theory Class' },
    { id: 'g3', url: 'https://picsum.photos/seed/aiequip1/800/600', title: 'Workshop Equipment' },
    { id: 'g4', url: 'https://picsum.photos/seed/itiaihero/800/600', title: 'Campus View' },
    { id: 'g5', url: 'https://picsum.photos/seed/aielec/800/600', title: 'Electrician Workshop' },
    { id: 'g6', url: 'https://picsum.photos/seed/aifitter/800/600', title: 'Fitter Workshop' },
  ];

  const heroImage = PlaceHolderImages.find(img => img.id === 'iti-hero');
  const logoImage = PlaceHolderImages.find(img => img.id === 'iti-logo');

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
      <section className="relative h-[750px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt="Maharana Pratap ITI Campus"
            fill
            className="object-cover brightness-[0.35]"
            priority
            data-ai-hint="modern campus"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {logoImage && (
            <div className="mb-8 relative w-28 h-28 bg-white rounded-3xl p-3 animate-in zoom-in-50 duration-700 shadow-2xl">
               <Image src={logoImage.imageUrl} alt="MPITI Logo" fill className="object-contain p-2" />
            </div>
          )}
          <div className="max-w-5xl">
            <h1 className="font-headline text-5xl md:text-8xl text-white mb-6 drop-shadow-2xl font-bold tracking-tight">
              {data.heroTitle}
            </h1>
            <p className="text-xl md:text-3xl text-white/90 mb-10 drop-shadow-lg font-medium leading-relaxed">
              {data.heroSub}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-white border-none h-16 px-12 text-xl font-black gap-3 shadow-[0_20px_50px_rgba(193,69,38,0.5)] transition-all hover:scale-105 active:scale-95">
              <Link href="/admission"><ClipboardList className="w-6 h-6"/> NEW ADMISSION INQUIRY</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white text-primary border-white hover:bg-white/90 h-16 px-12 text-xl font-bold gap-3 transition-transform hover:scale-105 active:scale-95 shadow-2xl">
              <Link href="/login"><GraduationCap className="w-6 h-6"/> STUDENT PORTAL</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Established 2015</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Years of Excellence</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">DGT/NCVT Approved</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Government Certified</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Advanced Workshops</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Practical Training</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Job Placement</h3>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Industrial Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Messages */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl text-primary font-bold mb-4">Leadership Messages</h2>
            <p className="text-muted-foreground text-lg">Guiding MPITI Rankhandi towards skill excellence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="border-none shadow-xl bg-white overflow-hidden group flex flex-col items-center pt-10 text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg relative shrink-0">
                <img src={data.chairmanPhoto} alt="Chairman of MPITI" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="mt-6 px-4">
                 <p className="text-primary font-bold text-xl uppercase tracking-tight">Chairman</p>
                 <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-4">MPITI Rankhandi</p>
              </div>
              <CardContent className="pt-4 relative min-h-[160px]">
                <Quote className="absolute -top-2 right-4 w-10 h-10 text-primary/5" />
                <p className="italic text-muted-foreground leading-relaxed font-medium px-4">
                  "{data.chairmanMsg}"
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white overflow-hidden group flex flex-col items-center pt-10 text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-secondary/20 shadow-lg relative shrink-0">
                <img src={data.principalPhoto} alt="Principal of MPITI" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="mt-6 px-4">
                 <p className="text-secondary font-bold text-xl uppercase tracking-tight">Principal</p>
                 <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-4">Academic Head</p>
              </div>
              <CardContent className="pt-4 relative min-h-[160px]">
                <Quote className="absolute -top-2 right-4 w-10 h-10 text-secondary/5" />
                <p className="italic text-muted-foreground leading-relaxed font-medium px-4">
                  "{data.principalMsg}"
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white overflow-hidden group flex flex-col items-center pt-10 text-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg relative shrink-0">
                <img src={data.studentPhoto} alt="Successful Student Alumni" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="mt-6 px-4">
                 <p className="text-blue-600 font-bold text-xl uppercase tracking-tight">Success Story</p>
                 <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-4">Our Alumni Network</p>
              </div>
              <CardContent className="pt-4 relative min-h-[160px]">
                <Quote className="absolute -top-2 right-4 w-10 h-10 text-blue-500/5" />
                <p className="italic text-muted-foreground leading-relaxed font-medium px-4">
                  "{data.studentMsg}"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Campus Gallery */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="font-headline text-5xl text-primary font-bold mb-2">Campus Gallery</h2>
            <p className="text-muted-foreground text-lg">Modern Workshops for Practical Technical Training</p>
          </div>
          <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5"><LayoutGrid className="w-4 h-4"/> View All Photos</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryItems.map((item, idx) => (
            <div key={idx} className={`relative rounded-2xl overflow-hidden shadow-lg border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 group ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <img 
                src={item.url} 
                alt={item.title || "MPITI Workshop Gallery"} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 aspect-video md:aspect-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold text-xl">{item.title || 'Campus Life'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
           <h2 className="font-headline text-5xl font-bold mb-8">Empowering Youth with Technical Skills</h2>
           <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">Join Maharana Pratap ITI Rankhandi and prepare for a career in India's growing industrial sector.</p>
           <div className="flex flex-wrap justify-center gap-6">
             <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-white font-black px-16 h-16 text-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 active:scale-95">
               <Link href="/admission">APPLY FOR ADMISSION</Link>
             </Button>
             <Button size="lg" variant="outline" asChild className="bg-white text-primary border-white hover:bg-white/90 font-black px-16 h-16 text-xl shadow-2xl transition-transform hover:scale-105 active:scale-95">
               <Link href="/contact">ENQUIRE NOW</Link>
             </Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-14 h-14 bg-white rounded-xl p-1.5 shadow-lg flex items-center justify-center">
                   {logoImage && <Image src={logoImage.imageUrl} alt="MPITI Logo" fill className="object-contain" />}
                </div>
                <h2 className="font-headline text-3xl text-primary font-bold">MPITI Rankhandi</h2>
              </div>
              <p className="opacity-70 text-lg leading-relaxed font-medium">{data.heroSub}</p>
            </div>
            <div>
              <h3 className="font-bold mb-6 uppercase text-sm tracking-[0.2em] text-secondary">Quick Links</h3>
              <ul className="space-y-3 text-lg opacity-80 font-medium">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/admission" className="hover:text-primary transition-colors">Admission Inquiry</Link></li>
                <li><Link href="/login?type=admin" className="hover:text-primary transition-colors">Admin Login</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Student Login</Link></li>
              </ul>
            </div>
            <div>
               <h3 className="font-bold mb-6 uppercase text-sm tracking-[0.2em] text-secondary">Official Contact</h3>
               <div className="space-y-4 text-lg opacity-80 font-medium">
                 <p className="flex items-start gap-3"><MapPin className="w-6 h-6 text-primary flex-shrink-0" /> {data.address}</p>
                 <p className="flex items-center gap-3"><Phone className="w-6 h-6 text-primary flex-shrink-0" /> {data.phone1}</p>
                 <p className="flex items-center gap-3"><Mail className="w-6 h-6 text-primary flex-shrink-0" /> {data.email}</p>
               </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 text-center text-sm opacity-50 font-bold uppercase tracking-widest">
            © 2024 Maharana Pratap ITI Rankhandi. Established 2015. NCVT/DGT Approved.
          </div>
        </div>
      </footer>
    </main>
  );
}
