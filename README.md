# Maharana Pratap ITI Saharanpur - Connect Portal

Official management and student portal for Maharana Pratap ITI, Rankhandi, Saharanpur.

## 🚀 How to fix the "Welcome" page error
If you see the "Firebase Hosting Setup Complete" page instead of your app, follow these steps:

1. **Delete the Placeholder**: Go to your `public/` folder and delete the file named `index.html`. This file is a Firebase default that overrides your actual app.
2. **Build the Project**: Run `npm run build` in your terminal. This generates the static site in the `out/` folder.
3. **Deploy Again**: Run `firebase deploy`.

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