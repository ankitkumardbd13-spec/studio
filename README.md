
# Maharana Pratap ITI Saharanpur - Connect Portal

Official management and student portal for Maharana Pratap ITI, Rankhandi, Saharanpur.

## 🚀 How to Make Your Web Live
If you see the default Firebase "Welcome" page instead of your app, follow these steps:
1. **Delete Placeholder**: Delete the file `public/index.html` from your project. This is a default file created by Firebase that hides your real app.
2. **Build Your App**: Run `npm run build` in your terminal. This creates the `out` folder.
3. **Deploy**: Run `firebase deploy`.

## 🤖 GitHub Automatic Updates
1. Go to your GitHub Repository > Settings > Secrets and variables > Actions.
2. Add a **New repository secret** named `FIREBASE_SERVICE_ACCOUNT_MPITI_PORTAL`.
3. Paste your Firebase Service Account JSON key.
4. Every push to the `main` branch will now automatically update your live website.

## 📦 Source Control Registration
If you haven't connected to GitHub yet:
1. `git init`
2. `git add .`
3. `git commit -m "Full stack setup"`
4. `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`
5. `git push -u origin main`

## 🛠 Features
- **Full Stack**: Powered by Firebase Auth and Firestore.
- **Bilingual**: English and Hindi support.
- **Admin Panel**: Manage students, fees, and AI-generated assignments.
- **Student Portal**: Access digital ID cards and exam results.
