
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  CreditCard, 
  BookOpen, 
  Award, 
  User, 
  IdCard,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function StudentDashboard() {
  const studentPhoto = PlaceHolderImages.find(img => img.id === 'student-1')?.imageUrl;

  const quickLinks = [
    { title: 'My Assignments', icon: <FileText className="w-5 h-5" />, href: '/student/assignments', color: 'bg-blue-500' },
    { title: 'Fee Payment', icon: <CreditCard className="w-5 h-5" />, href: '/student/fees', color: 'bg-green-500' },
    { title: 'View Syllabus', icon: <BookOpen className="w-5 h-5" />, href: '/student/syllabus', color: 'bg-amber-500' },
    { title: 'Exam Results', icon: <Award className="w-5 h-5" />, href: '/student/results', color: 'bg-purple-500' },
    { title: 'Digital ID Card', icon: <IdCard className="w-5 h-5" />, href: '/student/id-card', color: 'bg-red-500' },
  ];

  const notifications = [
    { text: 'Mock Test for Electrician Year 1 starts tomorrow.', date: '2 hours ago' },
    { text: 'Fees for Semester 2 last date is 30th May.', date: '1 day ago' },
    { text: 'New assignment uploaded for Engineering Drawing.', date: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-primary text-primary-foreground border-r">
        <div className="p-6">
          <h2 className="font-headline text-2xl font-bold">MPITI Connect</h2>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/student/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/student/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <User className="w-5 h-5" /> My Profile
          </Link>
          <Link href="/student/assignments" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <FileText className="w-5 h-5" /> Assignments
          </Link>
          <Link href="/student/id-card" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <IdCard className="w-5 h-5" /> Digital ID Card
          </Link>
          <Link href="/mock-tests" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
            <Award className="w-5 h-5" /> Mock Tests
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" className="w-full justify-start gap-3 text-white hover:bg-white/5" asChild>
            <Link href="/login"><LogOut className="w-5 h-5" /> Logout</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header / Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
              {studentPhoto && <Image src={studentPhoto} alt="Student" width={80} height={80} className="object-cover" />}
            </div>
            <div>
              <h1 className="font-headline text-3xl text-primary font-bold">Welcome, Rahul Kumar</h1>
              <p className="text-muted-foreground font-medium">Trade: Electrician (2023-25) | Year: 1st</p>
            </div>
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/5" asChild>
            <Link href="/student/profile">Edit Profile</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Stats & Progress */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {quickLinks.map((link, idx) => (
                <Link key={idx} href={link.href}>
                  <Card className="hover:shadow-md transition-shadow h-full cursor-pointer">
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                      <div className={`p-3 rounded-xl mb-3 text-white ${link.color}`}>
                        {link.icon}
                      </div>
                      <p className="font-bold text-sm">{link.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>Your current academic status for Semester 2</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>Practical Skills Training</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>Theory Completion</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>Assignments Submitted</span>
                    <span>8/10</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Notifications */}
          <div className="space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Notifications</CardTitle>
                <Bell className="w-5 h-5 text-secondary" />
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((n, idx) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-lg bg-accent/20 border-l-4 border-secondary">
                    <div>
                      <p className="text-sm font-medium leading-snug">{n.text}</p>
                      <span className="text-xs text-muted-foreground mt-1 block">{n.date}</span>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-primary font-bold text-xs" asChild>
                  <Link href="/student/notifications">View All Notifications <ChevronRight className="w-3 h-3 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>Upcoming Mock Test</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/10 p-4 rounded-lg mb-4">
                  <p className="font-bold">Trade Theory Unit 4</p>
                  <p className="text-sm opacity-80">May 25th, 2024 | 10:00 AM</p>
                </div>
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white border-none">
                  Set Reminder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
