# Maharana Pratap ITI Saharanpur - Connect Portal

Official management and student portal for Maharana Pratap ITI, Rankhandi, Saharanpur. Established 2015.

## 🚀 How to Make Your Web Live
If you see the default Firebase page instead of your app:
1. **Delete File**: Delete `public/index.html` (this is a placeholder created by Firebase).
2. **Build**: Run `npm run build` in your terminal.
3. **Deploy**: Run `firebase deploy`.

## 📦 How to Push to GitHub (Register Source Control)
If you see "No source control provider registered", run these commands in your terminal:
1. `git init`
2. `git add .`
3. `git commit -m "Initial commit"`
4. `git branch -M main`
5. `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`
6. `git push -u origin main`

## 🤖 GitHub Automatic Updates
1. Go to your GitHub Repository > Settings > Secrets and variables > Actions.
2. Add a **New repository secret** named `FIREBASE_SERVICE_ACCOUNT_MPITI_PORTAL`.
3. Paste your Firebase Service Account JSON key (Generate this in Firebase Console > Project Settings > Service Accounts).
4. Every "Push" to the main branch will now automatically update your website.

## 🛠 Features
- **Bilingual**: Toggle between Hindi and English in the Top Navbar.
- **Dark Mode**: Switch themes in the Top Navbar.
- **Admin Managed**: Update Logo and Stamp in Admin Settings to reflect everywhere.
- **Student ID**: Automatically generated digital ID cards with official stamps.

## Project Details
- **Address**: Village Post Rankhandi, Deoband, Dist Saharanpur, UP, PIN 247554
- **Established**: 2015
- **Trades**: Electrician, Fitter, HSI (Health Sanitary Inspector)
