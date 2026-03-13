
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, GraduationCap, BookOpen, ClipboardList, ShieldCheck, LayoutGrid, Quote } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'iti-hero');
  const chairmanImage = PlaceHolderImages.find(img => img.id === 'chairman');
  const principalImage = PlaceHolderImages.find(img => img.id === 'principal');
  const studentRepImage = PlaceHolderImages.find(img => img.id === 'student-rep');

  const galleryItems = [
    { id: 'g1', url: 'https://picsum.photos/seed/lab1/800/600', hint: 'practical lab', title: 'Electrical Lab' },
    { id: 'g2', url: 'https://picsum.photos/seed/class1/800/600', hint: 'classroom learning', title: 'Theory Class' },
    { id: 'g3', url: 'https://picsum.photos/seed/equip1/800/600', hint: 'industrial tools', title: 'Workshop Equipment' },
    { id: 'g4', url: 'https://picsum.photos/seed/iti1/800/600', hint: 'college campus', title: 'Campus View' },
    { id: 'g5', url: 'https://picsum.photos/seed/elec/800/600', hint: 'electrical workshop', title: 'Electrician Workshop' },
    { id: 'g6', url: 'https://picsum.photos/seed/fitter/800/600', hint: 'industrial workshop', title: 'Fitter Workshop' },
  ];

  const courses = [
    { name: 'Electrician', duration: '2 Years', icon: <BookOpen className="w-6 h-6" /> },
    { name: 'Fitter', duration: '2 Years', icon: <GraduationCap className="w-6 h-6" /> },
    { name: 'HSI (Health Sanitary Inspector)', duration: '1 Year', icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-[0.4]"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-headline text-5xl md:text-8xl text-white mb-6 drop-shadow-lg font-bold">
            Maharana Pratap ITI
          </h1>
          <p className="text-xl md:text-3xl text-white max-w-3xl drop-shadow-md font-medium">
            Saharanpur, Uttar Pradesh - Providing Excellence in Technical Skills Since 2012
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-white border-none h-14 px-8 text-lg font-bold gap-2">
              <Link href="/admission"><ClipboardList className="w-6 h-6"/> New Admission 2024</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white hover:bg-white/20 h-14 px-8 text-lg font-bold gap-2 backdrop-blur-sm">
              <Link href="/login"><GraduationCap className="w-6 h-6"/> Student Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Messages from Leadership */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-5xl text-primary font-bold mb-4">Voices of Excellence</h2>
            <p className="text-muted-foreground text-lg">Messages from our Chairman, Principal, and Alumni</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Chairman */}
            <Card className="border-none shadow-xl bg-white overflow-hidden group">
              <div className="h-64 relative overflow-hidden">
                {chairmanImage && (
                  <Image src={chairmanImage.imageUrl} alt="Chairman" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                   <p className="text-white font-bold text-xl">Shri Pratap Singh</p>
                   <p className="text-white/80 text-sm">Chairman</p>
                </div>
              </div>
              <CardContent className="pt-8 relative">
                <Quote className="absolute top-4 right-6 w-12 h-12 text-primary/10" />
                <p className="italic text-muted-foreground text-center leading-relaxed">
                  "Our mission is to empower the youth with skills that lead to sustainable employment. At MPITI, we believe in excellence and hard work."
                </p>
              </CardContent>
            </Card>

            {/* Principal */}
            <Card className="border-none shadow-xl bg-white overflow-hidden group">
              <div className="h-64 relative overflow-hidden">
                {principalImage && (
                  <Image src={principalImage.imageUrl} alt="Principal" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                   <p className="text-white font-bold text-xl">Dr. Ramesh Chandra</p>
                   <p className="text-white/80 text-sm">Principal</p>
                </div>
              </div>
              <CardContent className="pt-8 relative">
                <Quote className="absolute top-4 right-6 w-12 h-12 text-secondary/10" />
                <p className="italic text-muted-foreground text-center leading-relaxed">
                  "Welcome to MPITI. We provide a disciplined environment for learning modern trades with state-of-the-art workshop facilities."
                </p>
              </CardContent>
            </Card>

            {/* Student Success */}
            <Card className="border-none shadow-xl bg-white overflow-hidden group">
              <div className="h-64 relative overflow-hidden">
                {studentRepImage && (
                  <Image src={studentRepImage.imageUrl} alt="Student" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                   <p className="text-white font-bold text-xl">Rahul Tyagi</p>
                   <p className="text-white/80 text-sm">Alumni (Batch 2022)</p>
                </div>
              </div>
              <CardContent className="pt-8 relative">
                <Quote className="absolute top-4 right-6 w-12 h-12 text-blue-500/10" />
                <p className="italic text-muted-foreground text-center leading-relaxed">
                  "MPITI transformed my life. The practical sessions in the Electrician lab gave me the confidence to secure a job in a leading industry."
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
            <p className="text-muted-foreground text-lg">A glimpse into our labs, workshops, and student life</p>
          </div>
          <Button variant="outline" className="gap-2"><LayoutGrid className="w-4 h-4"/> View All Photos</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryItems.map((item, idx) => (
            <div key={idx} className={`relative rounded-2xl overflow-hidden shadow-lg border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 group ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <Image 
                src={item.url} 
                alt={item.title} 
                width={800} 
                height={600} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                data-ai-hint={item.hint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white font-bold text-lg">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-5xl text-center text-primary font-bold mb-16">Our NCVT Approved Trades</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course, idx) => (
              <Card key={idx} className="hover:shadow-2xl transition-all border-none shadow-lg bg-slate-50/50 hover:-translate-y-2 duration-300">
                <CardHeader>
                  <div className="p-4 bg-secondary/10 rounded-2xl w-fit mb-4 text-secondary">
                    {course.icon}
                  </div>
                  <CardTitle className="text-2xl">{course.name}</CardTitle>
                  <CardDescription className="text-lg font-medium text-primary">Duration: {course.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">Industry-aligned training focused on technical proficiency and safety according to the latest DGT guidelines.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
           <h2 className="font-headline text-5xl font-bold mb-8">Secure Your Future with Skills</h2>
           <p className="text-2xl opacity-90 mb-12 max-w-3xl mx-auto">Join Maharana Pratap ITI and become part of a legacy of skilled professionals serving the nation's industries.</p>
           <div className="flex flex-wrap justify-center gap-6">
             <Button size="lg" variant="secondary" asChild className="font-bold px-12 h-14 text-lg">
               <Link href="/admission">Apply for Admission</Link>
             </Button>
             <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 font-bold px-12 h-14 text-lg">
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
              <h2 className="font-headline text-3xl mb-6 text-primary font-bold">Maharana Pratap ITI</h2>
              <p className="opacity-70 text-lg leading-relaxed">Saharanpur's premier technical institute providing industry-standard training following the New DGT Syllabus for over a decade.</p>
            </div>
            <div>
              <h3 className="font-bold mb-6 uppercase text-sm tracking-[0.2em] text-secondary">Quick Links</h3>
              <ul className="space-y-3 text-lg opacity-80">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/admission" className="hover:text-primary transition-colors">Admission Inquiry</Link></li>
                <li><Link href="/signup" className="hover:text-primary transition-colors">Portal Registration</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Portal Login</Link></li>
              </ul>
            </div>
            <div>
               <h3 className="font-bold mb-6 uppercase text-sm tracking-[0.2em] text-secondary">Connect</h3>
               <div className="space-y-4 text-lg opacity-80">
                 <p className="flex items-start gap-3"><MapPin className="w-6 h-6 text-primary flex-shrink-0" /> Near Delhi Road, Saharanpur, UP</p>
                 <p className="flex items-center gap-3"><Phone className="w-6 h-6 text-primary flex-shrink-0" /> +91 98765 43210</p>
                 <p className="flex items-center gap-3"><Mail className="w-6 h-6 text-primary flex-shrink-0" /> info@mpitisre.edu.in</p>
               </div>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 text-center text-sm opacity-50">
            © 2024 Maharana Pratap ITI Saharanpur Connect. Crafted for Skilled Excellence.
          </div>
        </div>
      </footer>
    </main>
  );
}
