"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, GraduationCap, BookOpen, ClipboardList, ShieldCheck, LayoutGrid, Quote } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  const [siteData, setSiteData] = useState({
    address: 'Near Delhi Road, Saharanpur, Uttar Pradesh - 247001',
    phone1: '+91 98765 43210',
    phone2: '+91 12345 67890',
    email: 'info@mpitisre.edu.in',
    chairmanMsg: 'Our mission is to empower the youth with skills that lead to sustainable employment.',
    chairmanPhoto: PlaceHolderImages.find(i => i.id === 'chairman')?.imageUrl || '',
    principalMsg: 'Welcome to MPITI. We provide a disciplined environment for learning modern trades.',
    principalPhoto: PlaceHolderImages.find(i => i.id === 'principal')?.imageUrl || '',
    studentMsg: 'MPITI transformed my life. The practical sessions in the Electrician lab gave me the confidence to secure a job in a leading industry.',
    studentPhoto: PlaceHolderImages.find(i => i.id === 'student-rep')?.imageUrl || '',
    heroTitle: 'Maharana Pratap ITI',
    heroSub: 'Saharanpur, Uttar Pradesh - Providing Excellence in Technical Skills Since 2012'
  });

  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    // Load dynamic data from localStorage if admin has saved any
    const savedData = localStorage.getItem('mpiti_site_settings');
    if (savedData) {
      setSiteData(JSON.parse(savedData));
    }

    const savedGallery = localStorage.getItem('mpiti_gallery');
    if (savedGallery) {
      setGalleryItems(JSON.parse(savedGallery));
    } else {
      setGalleryItems([
        { id: 'g1', url: 'https://picsum.photos/seed/ailab1/800/600', hint: 'practical lab', title: 'Electrical Lab' },
        { id: 'g2', url: 'https://picsum.photos/seed/aiclass1/800/600', hint: 'smart classroom', title: 'Theory Class' },
        { id: 'g3', url: 'https://picsum.photos/seed/aiequip1/800/600', hint: 'industrial tools', title: 'Workshop Equipment' },
        { id: 'g4', url: 'https://picsum.photos/seed/itiaihero/800/600', hint: 'college campus', title: 'Campus View' },
        { id: 'g5', url: 'https://picsum.photos/seed/aielec/800/600', hint: 'electrical workshop', title: 'Electrician Workshop' },
        { id: 'g6', url: 'https://picsum.photos/seed/aifitter/800/600', hint: 'industrial workshop', title: 'Fitter Workshop' },
      ]);
    }
  }, []);

  const heroImage = PlaceHolderImages.find(img => img.id === 'iti-hero');
  const logoImage = PlaceHolderImages.find(img => img.id === 'iti-logo');

  const courses = [
    { name: 'Electrician', duration: '2 Years', icon: <BookOpen className="w-6 h-6" /> },
    { name: 'Fitter', duration: '2 Years', icon: <GraduationCap className="w-6 h-6" /> },
    { name: 'HSI (Health Sanitary Inspector)', duration: '1 Year', icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[650px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-[0.35]"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          {logoImage && (
            <div className="mb-8 relative w-28 h-28 bg-white rounded-3xl p-3 animate-in zoom-in-50 duration-700 shadow-2xl">
               <Image src={logoImage.imageUrl} alt="Logo" fill className="object-contain p-2" />
            </div>
          )}
          <h1 className="font-headline text-5xl md:text-8xl text-white mb-6 drop-shadow-2xl font-bold tracking-tight">
            {siteData.heroTitle}
          </h1>
          <p className="text-xl md:text-3xl text-white/90 max-w-4xl drop-shadow-lg font-medium">
            {siteData.heroSub}
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-white border-none h-16 px-10 text-xl font-bold gap-3 shadow-xl transition-transform hover:scale-105 active:scale-95">
              <Link href="/admission"><ClipboardList className="w-6 h-6"/> New Admission Inquiry</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/20 text-white border-white/50 hover:bg-white/30 h-16 px-10 text-xl font-bold gap-3 backdrop-blur-md transition-transform hover:scale-105 active:scale-95">
              <Link href="/login"><GraduationCap className="w-6 h-6"/> Student Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Messages from Leadership */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl text-primary font-bold mb-4">Leadership Messages</h2>
            <p className="text-muted-foreground text-lg">Guiding MPITI Saharanpur towards skill excellence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Chairman */}
            <Card className="border-none shadow-xl bg-white overflow-hidden group flex flex-col items-center pt-10">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg relative shrink-0">
                <img src={siteData.chairmanPhoto} alt="Chairman" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="mt-6 text-center px-4">
                 <p className="text-primary font-bold text-xl uppercase tracking-tight">Chairman</p>
                 <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-4">MPITI Saharanpur</p>
              </div>
              <CardContent className="pt-4 relative min-h-[160px] text-center">
                <Quote className="absolute -top-2 right-4 w-10 h-10 text-primary/5" />
                <p className="italic text-muted-foreground leading-relaxed font-medium px-4">
                  "{siteData.chairmanMsg}"
                </p>
              </CardContent>
            </Card>

            {/* Principal */}
            <Card className="border-none shadow-xl bg-white overflow-hidden group flex flex-col items-center pt-10">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-secondary/20 shadow-lg relative shrink-0">
                <img src={siteData.principalPhoto} alt="Principal" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="mt-6 text-center px-4">
                 <p className="text-secondary font-bold text-xl uppercase tracking-tight">Principal</p>
                 <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-4">Academic Head</p>
              </div>
              <CardContent className="pt-4 relative min-h-[160px] text-center">
                <Quote className="absolute -top-2 right-4 w-10 h-10 text-secondary/5" />
                <p className="italic text-muted-foreground leading-relaxed font-medium px-4">
                  "{siteData.principalMsg}"
                </p>
              </CardContent>
            </Card>

            {/* Student Success */}
            <Card className="border-none shadow-xl bg-white overflow-hidden group flex flex-col items-center pt-10">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg relative shrink-0">
                <img src={siteData.studentPhoto} alt="Student" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="mt-6 text-center px-4">
                 <p className="text-blue-600 font-bold text-xl uppercase tracking-tight">Success Story</p>
                 <p className="text-muted-foreground text-xs font-black uppercase tracking-[0.2em] mb-4">Our Alumni Network</p>
              </div>
              <CardContent className="pt-4 relative min-h-[160px] text-center">
                <Quote className="absolute -top-2 right-4 w-10 h-10 text-blue-500/5" />
                <p className="italic text-muted-foreground leading-relaxed font-medium px-4">
                  "{siteData.studentMsg}"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="font-headline text-5xl text-primary font-bold mb-2">Campus Gallery</h2>
            <p className="text-muted-foreground text-lg">AI Generated Visualization of Modern Workshops</p>
          </div>
          <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5"><LayoutGrid className="w-4 h-4"/> View All Photos</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryItems.map((item, idx) => (
            <div key={idx} className={`relative rounded-2xl overflow-hidden shadow-lg border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 group ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <img 
                src={item.url} 
                alt={item.title || "Gallery Item"} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 aspect-video md:aspect-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold text-xl">{item.title || 'Campus Life'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-5xl text-center text-primary font-bold mb-16">Approved ITI Trades</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course, idx) => (
              <Card key={idx} className="hover:shadow-2xl transition-all border-none shadow-lg bg-slate-50/50 hover:-translate-y-2 duration-300">
                <CardHeader>
                  <div className="p-5 bg-secondary/10 rounded-2xl w-fit mb-4 text-secondary">
                    {course.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{course.name}</CardTitle>
                  <CardDescription className="text-lg font-bold text-primary">Duration: {course.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">Technical training focused on industrial proficiency and safety according to the latest NCVT DGT guidelines.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
           <h2 className="font-headline text-5xl font-bold mb-8">Empowering Youth with Skills</h2>
           <p className="text-2xl opacity-90 mb-12 max-w-3xl mx-auto">Join Maharana Pratap ITI and prepare for a career in India's growing industrial sector.</p>
           <div className="flex flex-wrap justify-center gap-6">
             <Button size="lg" variant="secondary" asChild className="font-bold px-12 h-14 text-xl shadow-lg">
               <Link href="/admission">Apply for Admission</Link>
             </Button>
             <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 font-bold px-12 h-14 text-xl backdrop-blur-sm">
               <Link href="/contact">Enquire Now</Link>
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
                <div className="relative w-14 h-14 bg-white rounded-xl p-1.5 shadow-lg">
                   {logoImage && <Image src={logoImage.imageUrl} alt="Logo" fill className="object-contain" />}
                </div>
                <h2 className="font-headline text-3xl text-primary font-bold">MPITI Saharanpur</h2>
              </div>
              <p className="opacity-70 text-lg leading-relaxed font-medium">{siteData.heroSub}</p>
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
               <h3 className="font-bold mb-6 uppercase text-sm tracking-[0.2em] text-secondary">Contact</h3>
               <div className="space-y-4 text-lg opacity-80 font-medium">
                 <p className="flex items-start gap-3"><MapPin className="w-6 h-6 text-primary flex-shrink-0" /> {siteData.address}</p>
                 <p className="flex items-center gap-3"><Phone className="w-6 h-6 text-primary flex-shrink-0" /> {siteData.phone1}</p>
                 <p className="flex items-center gap-3"><Mail className="w-6 h-6 text-primary flex-shrink-0" /> {siteData.email}</p>
               </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 text-center text-sm opacity-50">
            © 2024 Maharana Pratap ITI Saharanpur. Managed via Admin Portal.
          </div>
        </div>
      </footer>
    </main>
  );
}
