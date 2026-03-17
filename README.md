# Maharana Pratap ITI Saharanpur - Connect Portal

Official management and student portal for Maharana Pratap ITI, Rankhandi, Saharanpur.

## 🚀 Deployment & Automation
The app is configured with **GitHub Actions** for automatic deployment. 

### To set up Automatic GitHub Updates:
1. **GitHub Secrets**: Go to your GitHub Repository Settings > Secrets and variables > Actions.
2. **Add Secret**: Add a new secret named `FIREBASE_SERVICE_ACCOUNT_MPITI_PORTAL`.
3. **Value**: Paste your Firebase Service Account JSON (found in Firebase Console > Project Settings > Service Accounts).
4. **Push to Main**: Every time you push to the `main` branch, the site will automatically build and go live.

## 🛠 Fix "Welcome" Page Error
If you see the default Firebase page instead of your app:
1. **Delete**: `public/index.html` (this is a placeholder created by Firebase).
2. **Build**: `npm run build` (generates the `out` folder).
3. **Deploy**: `firebase deploy`.

## Project Details
- **Address**: Village Post Rankhandi, Deoband, Dist Saharanpur, UP, PIN 247554
- **Established**: 2015
- **Trades**: Electrician, Fitter, HSI

## Tech Stack
- **Framework**: Next.js 15 (Static Export)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **UI**: Tailwind CSS, ShadCN UI
- **AI**: Genkit with Google Gemini
