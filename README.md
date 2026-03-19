
# Maharana Pratap ITI Saharanpur - Connect Portal

Official management and student portal for Maharana Pratap ITI, Rankhandi, Saharanpur.

## 🛠 Tech Stack (किसमें कोडिंग है)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & ShadCN UI
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Engine**: Google Genkit (Gemini 2.5 Flash)
- **Deployment**: Firebase Hosting & GitHub Actions

## 🚀 CRITICAL: Fix "Welcome to Firebase" Page
If you see the default Firebase "Welcome" page instead of your app, follow these 3 steps:
1. **Delete Placeholder**: Open your terminal and run `rm public/index.html`. This file blocks your real app.
2. **Build Your App**: Run `npm run build`. This creates the `out` folder with your real website.
3. **Deploy**: Run `firebase deploy`.

## 🤖 GitHub Automatic Updates
1. Go to your GitHub Repository > Settings > Secrets and variables > Actions.
2. Add a **New repository secret** named `FIREBASE_SERVICE_ACCOUNT_MPITI_PORTAL`.
3. Paste your Firebase Service Account JSON key.
4. Every push to the `main` branch will now automatically update your live website.

## 🛠 Features
- **Full Stack**: Powered by Firebase Auth and Firestore.
- **Bilingual**: English and Hindi support.
- **Admin Panel**: Manage students, fees, and AI-generated assignments.
- **Student Portal**: Access digital ID cards and exam results.
