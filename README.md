# Maharana Pratap ITI Saharanpur - Connect Portal

Official management and student portal for Maharana Pratap ITI, Rankhandi, Saharanpur.

## Project Details
- **Address**: Village Post Rankhandi, Deoband, Dist Saharanpur, UP, PIN 247554
- **Established**: 2015

## Important: Fixing "Firebase Hosting Setup Complete"
If you see a default Firebase welcome page instead of your app, follow these steps:
1. **Delete the default file**: In your project folder, go to the `public/` directory and delete the `index.html` file. This file is a placeholder created by Firebase that hides your actual app.
2. **Re-build & Deploy**:
   - Run `npm run build`
   - Run `firebase deploy`

## Firebase Console Link
To manage your live database, authentication, and hosting, visit your project in the Firebase Console:
- **URL**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Select your project from the list to see the dashboard, Firestore data, and deployment settings.

## How to Save to Your Computer
To get this code onto your local machine:
1. **GitHub (Recommended)**:
   - Create a new repository on [GitHub](https://github.com/new).
   - In the Firebase Studio terminal, run:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
     git branch -M main
     git push -u origin main
     ```
2. **Download**: Use the "Download" or "Export" feature in the Firebase Studio UI to save a ZIP file.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **UI**: Tailwind CSS, ShadCN UI
- **AI**: Genkit with Google Gemini
