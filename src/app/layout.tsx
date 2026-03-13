import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from "@/firebase";
import { AppProviders } from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: 'Maharana Pratap ITI Rankhandi, Saharanpur | Best ITI in UP (Est. 2015)',
  description: 'Official portal for Maharana Pratap ITI, Village Post Rankhandi, Deoband, Saharanpur, UP. NCVT/DGT approved technical training in Electrician, Fitter, and HSI trades. Providing excellence since 2015.',
  keywords: 'Maharana Pratap ITI, ITI Saharanpur, ITI Rankhandi, ITI Deoband, NCVT ITI UP, Best ITI Saharanpur, Electrician Course Saharanpur, Fitter Course Deoband, ITI Admission 2024, Technical Education UP',
  authors: [{ name: 'Maharana Pratap ITI' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AppProviders>
            {children}
            <Toaster />
          </AppProviders>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}