
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, GraduationCap, BookOpen, LayoutDashboard, ClipboardList, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'iti-hero');
  const chairmanImage = PlaceHolderImages.find(img => img.id === 'chairman');
  const principalImage = PlaceHolderImages.find(img => img.id === 'principal');

  const courses = [
    { name: 'Electrician', duration: '2 Years', icon: <BookOpen className="w-6 h-6" /> },
    { name: 'Fitter', duration: '2 Years', icon: <GraduationCap className="w-6 h-6" /> },
    { name: 'HSI (Health Sanitary Inspector)', duration: '1 Year', icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[500px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover brightness-50"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-headline text-5xl md:text-7xl text-white mb-4 drop-shadow-lg">
            Maharana Pratap ITI
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-2xl drop-shadow-md">
            Saharanpur, Uttar Pradesh - Following New DGT NCVT Syllabus for Skilled Excellence
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-white border-none gap-2">
              <Link href="/admission"><ClipboardList className="w-5 h-5"/> New Admission 2024</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white hover:bg-white/20 gap-2">
              <Link href="/login"><GraduationCap className="w-5 h-5"/> Student Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About & Location */}
      <section className="py-20 container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-headline text-4xl text-primary mb-6">Our Location & Legacy</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Established with a vision to provide quality technical education, Maharana Pratap ITI Saharanpur is a leading institution in Uttar Pradesh. We adhere strictly to the latest DGT/NCVT guidelines to ensure industry-readiness.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <MapPin className="text-secondary mt-1" />
              <div>
                <p className="font-semibold">Address</p>
                <p>Near Delhi Road, Saharanpur, Uttar Pradesh - 247001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-secondary mt-1" />
              <div>
                <p className="font-semibold">Contact</p>
                <p>+91 98765 43210, +91 12345 67890</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="text-secondary mt-1" />
              <div>
                <p className="font-semibold">Email</p>
                <p>info@mpitisre.edu.in</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-muted rounded-2xl overflow-hidden aspect-video relative border-4 border-primary/10 shadow-xl">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.60385923485!2d77.46609404285223!3d29.9619175463056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ee99222409549%3A0xe16541f92e3a73c0!2sSaharanpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1716543123456!5m2!1sen!2sin" 
            width="100%" height="100%" style={{border:0}} loading="lazy"></iframe>
        </div>
      </section>

      {/* Messages from Leadership */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl text-center text-primary mb-16">Messages from Our Leadership</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-none shadow-xl bg-accent/20">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-primary">
                  {chairmanImage && (
                    <Image src={chairmanImage.imageUrl} alt="Chairman" width={128} height={128} className="object-cover" />
                  )}
                </div>
                <h3 className="font-headline text-2xl mb-2">Chairman's Message</h3>
                <p className="italic text-muted-foreground">
                  "Our mission is to empower the youth with skills that lead to sustainable employment. At MPITI, we believe in excellence and hard work according to the latest industry standards."
                </p>
                <p className="mt-4 font-bold">- Shri Pratap Singh</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-accent/20">
              <CardContent className="pt-8 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-primary">
                  {principalImage && (
                    <Image src={principalImage.imageUrl} alt="Principal" width={128} height={128} className="object-cover" />
                  )}
                </div>
                <h3 className="font-headline text-2xl mb-2">Principal's Message</h3>
                <p className="italic text-muted-foreground">
                  "Welcome to MPITI. We provide a disciplined environment for learning modern trades with state-of-the-art workshop facilities and the updated NCVT syllabus."
                </p>
                <p className="mt-4 font-bold">- Dr. Ramesh Chandra</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="font-headline text-4xl text-center text-primary mb-12">Offered Trades (NCVT Approved)</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {courses.map((course, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow border-none shadow-sm">
              <CardHeader>
                <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-2 text-secondary">
                  {course.icon}
                </div>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>Duration: {course.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Comprehensive training following the new DGT syllabus and industry standards.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
           <h2 className="font-headline text-4xl mb-6">Take the first step towards a bright career</h2>
           <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Join thousands of successful alumni who have built their future with our technical expertise.</p>
           <div className="flex flex-wrap justify-center gap-4">
             <Button size="lg" variant="secondary" asChild className="font-bold px-10">
               <Link href="/admission">Apply for Admission</Link>
             </Button>
             <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 font-bold px-10">
               <Link href="/contact">Inquiry Now</Link>
             </Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h2 className="font-headline text-2xl mb-4 text-primary">Maharana Pratap ITI</h2>
              <p className="opacity-70 text-sm">Saharanpur's premier technical institute providing industry-standard training following the New DGT Syllabus.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-secondary">Quick Links</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li><Link href="/admission" className="hover:text-primary">New Admission Inquiry</Link></li>
                <li><Link href="/signup" className="hover:text-primary">Student Portal Registration</Link></li>
                <li><Link href="/login" className="hover:text-primary">Portal Login</Link></li>
              </ul>
            </div>
            <div>
               <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-secondary">Connect</h3>
               <p className="text-sm opacity-80 mb-2">Near Delhi Road, Saharanpur, UP</p>
               <p className="text-sm opacity-80">+91 98765 43210</p>
               <p className="text-sm opacity-80">info@mpitisre.edu.in</p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-xs opacity-50">
            © 2024 MPITI Saharanpur Connect. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
