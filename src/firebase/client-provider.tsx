'use client';

import React, { ReactNode } from 'react';
import { app, db, auth } from './config';
import { FirebaseProvider } from './provider';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider app={app} firestore={db} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
