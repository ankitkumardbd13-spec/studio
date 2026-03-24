"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, GraduationCap, BookOpen, ClipboardList, ShieldCheck, LayoutGrid, Quote, Loader2, CheckCircle, Star, Image as ImageIcon } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy, where } from 'firebase/firestore';
import { useApp } from '@/components/providers/AppProviders';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { X } from 'lucide-react';

export default function Home() {
  const { language } = useApp();
  const db = useFirestore();
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [selectedAlbum, setSelectedAlbum] = React.useState<string | null>(null);
  
  const configQuery = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'siteSettings', 'config');
  }, [db]);

  const galleryQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'gallery'), orderBy('timestamp', 'desc'));
  }, [db]);

  const notifQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'notifications'), orderBy('timestamp', 'desc'));
  }, [db]);

  const alumniQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'alumniReviews'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: siteSettings, isLoading: isConfigLoading } = useDoc(configQuery);
  const { data: galleryDocs } = useCollection(galleryQuery);
  const { data: notifications } = useCollection(notifQuery);
  const { data: alumniReviews } = useCollection(alumniQuery);

  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();

  React.useEffect(() => {
    if (!carouselApi) return;
    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselApi]);

  // Lock scroll when album is open
  React.useEffect(() => {
    if (selectedAlbum) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedAlbum]);

  const isLoading = isConfigLoading;

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
    heroSub: 'Village Post Rankhandi, Deoband - Providing Excellence Since 2015',
    heroPhoto: ''
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
      leadership: 'Administration',
      guiding: 'Guiding MPITI Rankhandi towards skill excellence',
      chairman: 'Chairman',
      principal: 'Principal'
    },
    hi: {
      ctaInquiry: 'नया प्रवेश पूछताछ',
      ctaPortal: 'छात्र पोर्टल',
      established: 'स्थापना 2015',
      years: 'उत्कृष्टता के वर्ष',
      approved: 'DGT/NCVT स्वीकृत',
      certified: 'सरकारी प्रमाणित',
      leadership: 'Administration',
      guiding: 'कौशल उत्कृष्टता की ओर MPITI का मार्गदर्शन',
      chairman: 'अध्यक्ष',
      principal: 'प्रधानाचार्य'
    }
  }[language];

  const galleryItems = galleryDocs && galleryDocs.length > 0 ? galleryDocs.map(doc => ({
    id: doc.id,
    url: doc.url,
    category: doc.category || 'Other',
    title: doc.category || 'Campus View'
  })) : [
    { id: 'g1', url: 'https://picsum.photos/seed/ailab1/800/600', title: 'Electrical Lab', category: 'Electrician Lab' },
    { id: 'g2', url: 'https://picsum.photos/seed/aiclass1/800/600', title: 'Theory Class', category: 'Campus Views' },
    { id: 'g3', url: 'https://picsum.photos/seed/aiequip1/800/600', title: 'Workshop Equipment', category: 'Fitter Lab' },
    { id: 'g4', url: 'https://picsum.photos/seed/itiaihero/800/600', title: 'Campus View', category: 'Campus Views' },
  ];

  const categories = ['All', ...Array.from(new Set(galleryItems.map(item => item.category)))];
  
  // Logical grouping for "one photo per category"
  const albumCovers = React.useMemo(() => {
    const covers: any[] = [];
    const seenCategories = new Set();
    
    galleryItems.forEach(item => {
      if (!seenCategories.has(item.category)) {
        seenCategories.add(item.category);
        covers.push(item);
      }
    });
    return covers;
  }, [galleryItems]);

  const filteredGallery = activeCategory === 'All' 
    ? albumCovers 
    : galleryItems.filter(item => item.category === activeCategory);
    
  const albumPhotos = selectedAlbum 
    ? galleryItems.filter(item => item.category === selectedAlbum)
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {notifications && notifications.length > 0 && (
        <div className="bg-secondary text-white py-3 text-center px-4 font-semibold text-sm animate-in fade-in slide-in-from-top-4">
          🔔 <span className="mr-2 font-bold uppercase tracking-wider">{notifications[0].title}:</span> {notifications[0].message}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[750px] w-full flex items-center justify-center">
        <Image
          src={data.heroPhoto || PlaceHolderImages.find(img => img.id === 'iti-hero')?.imageUrl || ''}
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
          
          <div className="mb-6 flex items-center justify-center gap-2 text-white font-bold tracking-widest uppercase bg-primary/80 backdrop-blur-sm w-fit mx-auto px-6 py-2 rounded-full border border-white/20 shadow-xl">
            <ShieldCheck className="w-5 h-5 text-yellow-400" />
            ISO 9001:2015 Certified Institute
          </div>

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

      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-5xl text-primary font-bold mb-4">{content.leadership}</h2>
          <p className="text-muted-foreground text-lg mb-16">{content.guiding}</p>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {[
              { title: content.chairman, msg: data.chairmanMsg, photo: data.chairmanPhoto, color: 'primary' },
              { title: content.principal, msg: data.principalMsg, photo: data.principalPhoto, color: 'secondary' },
            ].map((lead, i) => (
              <Card key={i} className="border-none shadow-xl bg-card overflow-hidden group flex flex-col items-center pt-10 text-center">
                <div className={`w-48 h-48 rounded-full overflow-hidden border-4 border-slate-200 shadow-lg relative shrink-0`}>
                  <img src={lead.photo} alt={lead.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="mt-6 px-4">
                   <p className="text-primary font-bold text-xl uppercase tracking-tight">{lead.title}</p>
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

      {/* Alumni Reviews Carousel (Moved here) */}
      {alumniReviews && alumniReviews.length > 0 && (
        <section className="bg-slate-50 py-24 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-headline text-5xl text-primary font-bold mb-4">Success Stories</h2>
              <p className="text-muted-foreground text-lg">Hear from our students thriving in their careers</p>
            </div>
            
            <div className="max-w-5xl mx-auto px-12 relative">
              <Carousel setApi={setCarouselApi} opts={{ loop: true, align: "start" }} className="w-full">
                <CarouselContent className="-ml-4">
                  {alumniReviews.map((review: any, idx: number) => (
                    <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < (review.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            ))}
                          </div>
                          <p className="text-slate-600 italic mb-6 flex-grow">"{review.message}"</p>
                          <div className="flex items-center gap-4 mt-auto">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {review.alumniName?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">{review.alumniName}</p>
                              <p className="text-xs text-slate-500">{review.trade} • Class of {review.passoutYear}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-12" />
                <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-12" />
              </Carousel>
              
              <div className="mt-12 text-center">
                <Button variant="outline" asChild>
                  <Link href="/alumni">Submit Your Review</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section id="gallery" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl text-primary font-bold mb-4">Campus Gallery</h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto mb-6 rounded-full"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Explore our modern workshops, advanced laboratories, and vibrant campus life through our official gallery.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg scale-105' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item, idx) => (
              <div 
                key={item.id} 
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all animate-in fade-in zoom-in duration-500 cursor-pointer"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => setSelectedAlbum(item.category)}
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-12 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                   <p className="text-white font-bold text-lg mb-1">{item.title}</p>
                   <div className="flex justify-between items-center">
                     <span className="text-secondary text-[10px] uppercase font-black tracking-widest">{item.category}</span>
                     <span className="text-white/60 text-[9px] font-bold uppercase tracking-tighter bg-white/10 px-2 py-0.5 rounded-full ring-1 ring-white/20">View Album</span>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* Album View Modal */}
          {selectedAlbum && (
            <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md overflow-y-auto pt-20 pb-12 animate-in fade-in duration-300">
              <div className="container mx-auto px-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="fixed top-6 right-6 text-white hover:bg-white/20 z-[110] rounded-full h-12 w-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAlbum(null);
                  }}
                >
                  <X className="w-8 h-8" />
                </Button>
                
                <div className="text-center mb-16">
                  <span className="text-secondary font-black text-sm tracking-[0.4em] uppercase mb-4 block">MPITI Gallery</span>
                  <h3 className="text-white text-5xl md:text-7xl font-headline font-bold uppercase tracking-tight">{selectedAlbum}</h3>
                  <div className="w-24 h-1.5 bg-secondary mx-auto mt-6 rounded-full opacity-50"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {albumPhotos.map((photo, i) => (
                    <div 
                      key={photo.id} 
                      className="aspect-square rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative group animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <img src={photo.url} alt="" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {filteredGallery.length === 0 && (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
              <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No photos found in this category yet.</p>
            </div>
          )}
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
