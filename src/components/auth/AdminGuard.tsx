'use client';

import React from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, ShieldAlert, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const adminRoleRef = useMemoFirebase(() => 
    (db && user) ? doc(db, 'roles_admin', user.uid) : null, 
    [db, user]
  );

  const { data: adminRole, isLoading: isAdminLoading, error: adminError } = useDoc(adminRoleRef);

  if (isUserLoading || (user && isAdminLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Verifying administrative access...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
        <div className="bg-orange-100 p-4 rounded-full">
          <LogIn className="w-12 h-12 text-orange-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Admin Login Required</h2>
          <p className="text-muted-foreground max-w-sm">
            You must be signed in with an administrator account to access this area.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  if (!adminRole && !isAdminLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
        <div className="bg-destructive/10 p-4 rounded-full">
          <ShieldAlert className="w-12 h-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Access Denied</h2>
          <p className="text-muted-foreground max-w-sm">
            Your account ({user.email}) does not have administrator privileges. Please contact the system owner if you believe this is an error.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">Switch Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
