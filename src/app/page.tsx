
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, GraduationCap, Users, BookOpen, LayoutDashboard, UserPlus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'iti-hero');
  const chairmanImage = PlaceHolderImages.find(img => img.id === 'chairman');
  const principalImage = PlaceHolderImages.find(img => img.id === 'principal');

  const courses = [
    { name: 'Electrician', duration: '2 Years', icon: <BookOpen className="w-6 h-6" /> },
    { name: 'Fitter', duration: '2 Years', icon: <GraduationCap className="w-6 h-6" /> },
    { name: 'COPA', duration: '1 Year', icon: <LayoutDashboard className="w-6 h-6" /> },
    { name: 'Welder', duration: '1 Year', icon: <Users className="w-6 h-6" /> },
  ];

  const testimonials = [
    { name: 'Rahul Kumar', photo: 'student-1', feedback: 'Best ITI in Saharanpur with great practical labs.' },
    { name: 'Priya Singh', photo: 'student-2', feedback: 'The instructors are very helpful and knowledgeable.' },
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
            Saharanpur, Uttar Pradesh - Shaping the Future of Skilled Professionals
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-white border-none">
              <Link href="/signup">Admission 2024 Open</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white hover:bg-white/20">
              <Link href="/login">Student Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About & Location */}
      <section className="py-20 container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-headline text-4xl text-primary mb-6">Our Location & Legacy</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Established with a vision to provide quality technical education, Maharana Pratap ITI Saharanpur is a leading institution in Uttar Pradesh. We focus on practical skills and industry-readiness.
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
        <div className="bg-muted rounded-2xl overflow-hidden aspect-video relative">
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
             <MapPin className="w-20 h-20 text-primary opacity-20" />
          </div>
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
                  "Our mission is to empower the youth with skills that lead to sustainable employment. At MPITI, we believe in excellence and hard work."
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
                  "Welcome to MPITI. We provide a disciplined environment for learning modern trades with state-of-the-art workshop facilities."
                </p>
                <p className="mt-4 font-bold">- Dr. Ramesh Chandra</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="font-headline text-4xl text-center text-primary mb-12">Offered Trades</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 bg-secondary/10 rounded-lg w-fit mb-2 text-secondary">
                  {course.icon}
                </div>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>Duration: {course.duration}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Comprehensive training with industry standards.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl text-center text-primary mb-12">What Our Students Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-md flex gap-6">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary">
                  {t.photo && (
                     <Image src={PlaceHolderImages.find(img => img.id === t.photo)?.imageUrl || ''} alt={t.name} width={64} height={64} className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-lg italic mb-4">"{t.feedback}"</p>
                  <p className="font-bold text-primary">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-3xl mb-4">Maharana Pratap ITI Saharanpur</h2>
          <p className="opacity-80 mb-8">Empowering Skills, Enabling Futures.</p>
          <div className="flex justify-center gap-6 mb-8">
             <Link href="/" className="hover:underline">Home</Link>
             <Link href="/contact" className="hover:underline">Contact</Link>
             <Link href="/signup" className="hover:underline">Admissions</Link>
          </div>
          <p className="text-sm opacity-60">© 2024 MPITI Saharanpur Connect. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
