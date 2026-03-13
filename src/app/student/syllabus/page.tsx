
"use client";

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Download, LayoutDashboard, ArrowLeft, ShieldCheck, GraduationCap } from 'lucide-react';

export default function StudentSyllabusPage() {
  const syllabi = [
    {
      trade: "Electrician",
      duration: "2 Years",
      description: "Comprehensive training in electrical installation, maintenance, and electronics.",
      topics: [
        "Occupational Safety & Health",
        "Basic Electrical Practice",
        "Magnetism and Capacitors",
        "AC Circuits & Polyphase Systems",
        "Cells and Batteries",
        "Electrical Wiring & Grounding",
        "DC Machines (Generators & Motors)",
        "Transformers & Measuring Instruments",
        "Electronic Theory & Circuits"
      ]
    },
    {
      trade: "Fitter",
      duration: "2 Years",
      description: "Technical training in assembly, precision measuring, and industrial machinery.",
      topics: [
        "Safety Guidelines & First Aid",
        "Linear Measurements & Gauges",
        "Filing, Sawing, and Marking",
        "Drilling, Reaming, and Tapping",
        "Sheet Metal Work",
        "Welding Techniques",
        "Lathe Operation & Turning",
        "Maintenance of Machinery",
        "Hydraulics & Pneumatics"
      ]
    },
    {
      trade: "HSI (Health Sanitary Inspector)",
      duration: "1 Year",
      description: "Focus on public health, sanitation, waste management, and healthcare support.",
      topics: [
        "Personal & Environmental Hygiene",
        "Sanitation & Water Supply",
        "Waste Disposal Management",
        "Communicable & Non-communicable Diseases",
        "Public Health Administration",
        "Occupational Health & First Aid",
        "Nutrition & Food Hygiene",
        "Disaster Management"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-headline text-4xl text-primary font-bold">New DGT NCVT Syllabus</h1>
              <p className="text-muted-foreground">Current academic session training modules</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/student/dashboard" className="gap-2"><LayoutDashboard className="w-4 h-4"/> Student Dashboard</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {syllabi.map((s, idx) => (
              <Card key={idx} className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl text-primary">{s.trade}</CardTitle>
                      <CardDescription className="font-medium text-secondary">Course Duration: {s.duration}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary gap-2">
                      <Download className="w-4 h-4"/> PDF
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="mb-6 text-sm text-muted-foreground italic">{s.description}</p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="modules">
                      <AccordionTrigger className="text-sm font-bold">View Key Training Modules</AccordionTrigger>
                      <AccordionContent>
                        <ul className="grid md:grid-cols-2 gap-3 pt-4">
                          {s.topics.map((topic, tidx) => (
                            <li key={tidx} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border">
                              <BookOpen className="w-3 h-3 text-secondary" /> {topic}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white rounded-xl shadow-lg border-l-4 border-secondary flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">DGT Syllabus Version: 2024.1</h3>
              <p className="text-sm text-muted-foreground">
                All training modules are updated according to the latest NCVT guidelines. Students are advised to follow the trade practical manuals provided in the workshop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
