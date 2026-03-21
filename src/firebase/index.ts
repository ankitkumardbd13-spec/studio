
'use client';


import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

export function initializeFirebase() {
  const firebaseConfig = {
    projectId: "mpiti-web",
    appId: "1:224432144817:web:4f9ac1cbd689ae2bf43d90",
    databaseURL: "https://mpiti-web-default-rtdb.firebaseio.com",
    storageBucket: "mpiti-web.firebasestorage.app",
    apiKey: "AIzaSyDICqBqEgiBO1CjKYIRt2-jGTXrw8K-6Eg",
    authDomain: "mpiti-web.firebaseapp.com",
    messagingSenderId: "224432144817",
    measurementId: "G-MZSJSDB3Q2"
  };

  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

import { getStorage } from 'firebase/storage';

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
// Conflicting useMemoFirebase removed from here as it's provided by provider.tsx
