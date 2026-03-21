"use client";

import React from 'react';
import { useStudent } from '../layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Mail, Phone, Calendar, BadgeInfo } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function StudentProfilePage() {
  const student = useStudent()!;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">My Profile</h1>
        <p className="text-muted-foreground mt-1">Review your personal and academic details submitted during registration.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Identity Card Profile */}
        <Card className="md:col-span-1 border-none shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardContent className="p-8 flex flex-col items-center text-center">
            {student.photo ? (
              <img src={student.photo} alt="Student" className="w-32 h-40 object-cover rounded shadow-md border-4 border-white mb-4" />
            ) : (
              <div className="w-32 h-40 bg-slate-200 rounded flex items-center justify-center border-4 border-white shadow-md mb-4"><User className="w-12 h-12 text-slate-400" /></div>
            )}
            <h2 className="text-2xl font-bold text-primary">{student.name}</h2>
            <p className="font-bold text-secondary text-sm mt-1">{student.trade} | Session: {student.session}</p>
            <div className="mt-4 w-full bg-slate-100 py-2 rounded-lg text-sm font-semibold tracking-wide border border-slate-200">
              Roll No: {student.rollNo || 'Pending'}
            </div>
            
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Mail className="w-4 h-4 text-primary" /> {student.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone className="w-4 h-4 text-primary" /> {student.mobile}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg"><BadgeInfo className="w-5 h-5 text-primary" /> Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 block">Father&apos;s Name</Label>
                <p className="font-medium text-slate-900">{student.fatherName}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 block">Date of Birth</Label>
                <p className="font-medium text-slate-900">{student.dob}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 block">Aadhaar Card</Label>
                <p className="font-medium text-slate-900">{student.aadhaar}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 block">Category</Label>
                <p className="font-medium text-slate-900">{student.category}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg"><MapPin className="w-5 h-5 text-primary" /> Contact Address</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 block">Full Address</Label>
                <p className="font-medium text-slate-900">{student.address?.fullAddress}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 block">State & Pincode</Label>
                <p className="font-medium text-slate-900">{student.address?.state} - {student.address?.pincode}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1 block">District / Tehsil</Label>
                <p className="font-medium text-slate-900">{student.address?.district} / {student.address?.tehsil}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
