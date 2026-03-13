import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from "@/firebase";

export const metadata: Metadata = {
  title: 'Maharana Pratap ITI Rankhandi | Official Student & Admin Portal',
  description: 'Maharana Pratap ITI, Village Post Rankhandi, Deoband, Saharanpur, UP - Established 2015. Top technical education center for Electrician, Fitter, and HSI trades.',
  keywords: 'ITI Saharanpur, Maharana Pratap ITI, Rankhandi ITI, ITI Admission 2024, Electrician ITI, Fitter ITI, HSI ITI, ITI Deoband',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
