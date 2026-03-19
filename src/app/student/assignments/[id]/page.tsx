"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export async function generateStaticParams() {
  return [];
}

export default function RedirectToTest() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirecting any old dynamic links to the new static query-based route
    router.replace('/student/assignments');
  }, [router]);

  return <div className="p-20 text-center text-muted-foreground">Redirecting to test portal...</div>;
}
