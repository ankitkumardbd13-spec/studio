"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Settings, FileText, CheckCircle, Image, Bell, GraduationCap, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard Home', href: '/admin/dashboard', icon: Settings },
    { label: 'Site Settings', href: '/admin/dashboard/settings', icon: Settings },
    { label: 'Manage Students', href: '/admin/dashboard/students', icon: Users },
    { label: 'Fee Management', href: '/admin/dashboard/fees', icon: CreditCard },
    { label: 'Pending Approvals', href: '/admin/dashboard/approvals', icon: CheckCircle },
    { label: 'Syllabus & Courses', href: '/admin/dashboard/courses', icon: BookOpen },
    { label: 'Assignments', href: '/admin/dashboard/assignments', icon: FileText },
    { label: 'Gallery', href: '/admin/dashboard/gallery', icon: Image },
    { label: 'Notifications', href: '/admin/dashboard/notifications', icon: Bell },
    { label: 'Manual Submissions', href: '/admin/dashboard/manual-submissions', icon: FileText },
    { label: 'Alumni Directory', href: '/admin/dashboard/alumni', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6 mt-4">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-4">
          <Card className="border-none shadow-md">
            <CardContent className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button 
                    key={item.href}
                    variant={isActive ? "secondary" : "ghost"} 
                    className={`w-full justify-start gap-3 ${isActive ? 'font-semibold' : ''}`}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" /> {item.label}
                    </Link>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
