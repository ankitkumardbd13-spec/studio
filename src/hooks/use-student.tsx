"use client";

import React, { createContext, useContext } from 'react';

export interface StudentData {
  id: string;
  name: string;
  fatherName: string;
  email: string;
  mobile: string;
  dob: string;
  aadhaar: string;
  category: string;
  rollNo: string;
  trade: string;
  session: string;
  photo: string;
  whatsApp?: string;
  status: string;
  address: {
    state: string;
    district: string;
    tehsil: string;
    pincode: string;
    fullAddress: string;
  };
}

export const StudentContext = createContext<StudentData | null>(null);

export const useStudent = () => {
  const context = useContext(StudentContext);
  return context;
};
