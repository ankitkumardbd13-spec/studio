"use client";

import React from 'react';
import { useStudent } from '@/hooks/use-student';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore } from '@/firebase/provider';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Edit2, Save, X, User, MapPin, Mail, Phone, Calendar, BadgeInfo, Info, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/image-compress';
import { Label } from '@/components/ui/label';

export default function StudentProfilePage() {
  const student = useStudent()!;
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: student.name,
    fatherName: student.fatherName,
    mobile: student.mobile,
    whatsApp: student.whatsApp || '',
    dob: student.dob,
    aadhaar: student.aadhaar,
    category: student.category,
    address: {
      state: student.address?.state || '',
      district: student.address?.district || '',
      tehsil: student.address?.tehsil || '',
      pincode: student.address?.pincode || '',
      fullAddress: student.address?.fullAddress || ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id.startsWith('addr-')) {
      const field = id.replace('addr-', '');
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const compressed = await compressImage(e.target.files[0], 30);
        await updateDoc(doc(firestore, 'students', student.id), { photo: compressed });
        toast({ title: "Photo Updated", description: "Your profile photo has been updated successfully." });
        window.location.reload(); // Refresh to show new photo from layout context
      } catch (err) {
        toast({ title: "Update Failed", description: "Could not process image.", variant: "destructive" });
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(firestore, 'students', student.id), {
        name: formData.name,
        fatherName: formData.fatherName,
        mobile: formData.mobile,
        whatsApp: formData.whatsApp,
        dob: formData.dob,
        aadhaar: formData.aadhaar,
        category: formData.category,
        address: formData.address
      });
      toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
      setIsEditing(false);
      window.location.reload(); // Refresh to update context
    } catch (error: any) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal and academic details.</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="w-fit gap-2">
            <Edit2 className="w-4 h-4" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3 text-blue-700 text-sm">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p>You are currently in edit mode. Please make sure to save your changes before leaving this page.</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Identity Card Profile */}
        <Card className="md:col-span-1 border-none shadow-lg bg-gradient-to-br from-white to-slate-50 overflow-hidden">
          <CardContent className="p-8 flex flex-col items-center text-center relative">
            <div className="relative group">
              {student.photo ? (
                <img src={student.photo} alt="Student" className="w-32 h-40 object-cover rounded shadow-md border-4 border-white mb-4" />
              ) : (
                <div className="w-32 h-40 bg-slate-200 rounded flex items-center justify-center border-4 border-white shadow-md mb-4"><User className="w-12 h-12 text-slate-400" /></div>
              )}
              {isEditing && (
                <label className="absolute inset-0 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="text-white text-xs flex flex-col items-center gap-1 font-bold">
                    <Edit2 className="w-5 h-5" />
                    Change Photo
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpdate} />
                </label>
              )}
            </div>
            
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold text-primary">{student.name}</h2>
                <p className="font-bold text-secondary text-sm mt-1">{student.trade} | Session: {student.session}</p>
                <div className="mt-4 w-full bg-slate-100 py-2 rounded-lg text-sm font-semibold tracking-wide border border-slate-200">
                  Roll No: {student.rollNo || 'Pending'}
                </div>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} />
                </div>
              </div>
            )}
            
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-700 break-all">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" /> {student.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                {!isEditing ? student.mobile : (
                   <Input id="mobile" value={formData.mobile} onChange={handleInputChange} className="h-8 text-xs" placeholder="Mobile Number" />
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                {!isEditing ? (student.whatsApp || 'Not Provided') : (
                   <Input id="whatsApp" value={formData.whatsApp} onChange={handleInputChange} className="h-8 text-xs" placeholder="WhatsApp Number" />
                )}
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
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">Father&apos;s Name</Label>
                {!isEditing ? (
                  <p className="font-medium text-slate-900">{student.fatherName}</p>
                ) : (
                  <Input id="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">Date of Birth</Label>
                {!isEditing ? (
                  <p className="font-medium text-slate-900">{student.dob}</p>
                ) : (
                  <Input id="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">Aadhaar Card</Label>
                {!isEditing ? (
                  <p className="font-medium text-slate-900">{student.aadhaar}</p>
                ) : (
                  <Input id="aadhaar" value={formData.aadhaar} onChange={handleInputChange} maxLength={12} />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">Category</Label>
                {!isEditing ? (
                  <p className="font-medium text-slate-900">{student.category}</p>
                ) : (
                  <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL">General</SelectItem>
                      <SelectItem value="OBC">OBC</SelectItem>
                      <SelectItem value="SC/ST">SC/ST</SelectItem>
                      <SelectItem value="EWS">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-2 text-lg"><MapPin className="w-5 h-5 text-primary" /> Contact Address</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">Full Address</Label>
                {!isEditing ? (
                  <p className="font-medium text-slate-900">{student.address?.fullAddress}</p>
                ) : (
                  <Input id="addr-fullAddress" value={formData.address.fullAddress} onChange={handleInputChange} placeholder="H.No, Street, Landmark..." />
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">State</Label>
                  {!isEditing ? (
                    <p className="font-medium text-slate-900">{student.address?.state}</p>
                  ) : (
                    <Input id="addr-state" value={formData.address.state} onChange={handleInputChange} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">Pincode</Label>
                  {!isEditing ? (
                    <p className="font-medium text-slate-900">{student.address?.pincode}</p>
                  ) : (
                    <Input id="addr-pincode" value={formData.address.pincode} onChange={handleInputChange} maxLength={6} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">District</Label>
                  {!isEditing ? (
                    <p className="font-medium text-slate-900">{student.address?.district}</p>
                  ) : (
                    <Input id="addr-district" value={formData.address.district} onChange={handleInputChange} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">Tehsil</Label>
                  {!isEditing ? (
                    <p className="font-medium text-slate-900">{student.address?.tehsil}</p>
                  ) : (
                    <Input id="addr-tehsil" value={formData.address.tehsil} onChange={handleInputChange} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
