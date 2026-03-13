# Maharana Pratap ITI Saharanpur - Connect Portal

A comprehensive technical education management portal for Maharana Pratap ITI, Saharanpur.

## Features

- **Student Portal**: Access assignments, view syllabus, download digital ID cards, and manage fee history.
- **Admin Management**: Manage student registrations, track fee collections, and broadcast notifications.
- **AI Tools**: Generate 20-question bilingual MCQs (English/Hindi) based on the latest DGT/NCVT syllabus.
- **Bilingual Content**: Full support for English and Hindi technical terminology.
- **Digital ID Cards**: Authenticated digital identity cards with official branding and security watermarks.

## How to Upload to GitHub

To upload this project to your GitHub account, follow these steps in your terminal:

1. **Initialize Git**:
   ```bash
   git init
   ```

2. **Add Files**:
   ```bash
   git add .
   ```

3. **Commit Changes**:
   ```bash
   git commit -m "Initial commit: Maharana Pratap ITI Portal"
   ```

4. **Create a Repository on GitHub**:
   Go to [github.com/new](https://github.com/new) and create a new repository.

5. **Link and Push**:
   Replace `USERNAME` and `REPO_NAME` with your actual details:
   ```bash
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS, ShadCN UI, Lucide Icons
- **AI**: Genkit with Google Gemini
- **Language**: TypeScript