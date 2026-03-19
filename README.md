
# Maharana Pratap ITI Saharanpur - Connect Portal

Official management and student portal for Maharana Pratap ITI, Rankhandi, Saharanpur.

## 🚀 FREE HOSTING GUIDE (वेबसाइट लाइव कैसे करें)

अगर आपको Firebase का "Welcome" पेज दिख रहा है, तो इन 3 स्टेप्स को फॉलो करें:

1. **Purana Page Delete Karein**: Terminal mein ye command chalayein:
   `rm public/index.html`
   (Yeh file aapki asli website ko block karti hai).

2. **HTML Generate Karein**:
   `npm run build`
   (Isse `out` folder banega jisme aapki puri website HTML mein convert ho jayegi).

3. **Deploy Karein**:
   `firebase deploy`

## 🛠 Tech Stack (तकनीकी जानकारी)
- **Framework**: Next.js 15 (Static Export Mode)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & ShadCN UI
- **Database**: Firebase Firestore (Real-time)
- **Authentication**: Firebase Auth
- **AI Engine**: Google Genkit (Gemini 1.5 Flash)

## 🤖 GitHub Automatic Updates
1. GitHub Repo > Settings > Secrets > Actions mein jayein.
2. `FIREBASE_SERVICE_ACCOUNT_MPITI_PORTAL` naam ka secret add karein.
3. Ab har push par website apne aap update hogi.

## 🛠 Features
- **Full Stack**: Firebase se connect hai.
- **Bilingual**: English aur Hindi dono mein.
- **Student Portal**: ID Card, Result aur Assignments access karein.
