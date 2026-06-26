# Vishan Dias - Portfolio

A modern, dynamic, and highly interactive personal portfolio website built with React, Vite, TypeScript, and Tailwind CSS. 

The site features smooth animations, real-time data fetching, a live WhatsApp messaging widget, and a completely custom serverless backend for admin photo uploads using Cloudflare Workers.

---

## 🚀 Key Features

### 1. Hidden Admin Panel & Live Photo Upload
- **Secret Access:** Press `Ctrl + Shift + A` anywhere on the site to trigger a hidden password prompt.
- **Direct Uploads:** Hover over the profile photo in the Hero section to select and upload a new image directly from your device.
- **Serverless Architecture:** Uses a custom **Cloudflare Worker** (`/cloudflare-worker`) to securely authenticate the admin password and write the file directly to a **Cloudflare R2 Bucket**.
- **Instant Updates:** The profile photo updates live across the site instantly without requiring a GitHub commit or full site redeploy.

### 2. Live WhatsApp Chat Widget
- **Floating Widget:** A beautiful, animated chat popup that floats in the bottom right corner.
- **Backend-less Messaging:** Visitors can send text messages directly to Vishan's personal WhatsApp using the free **CallMeBot API**.
- **Direct Fallback:** Includes a pinned `wa.me` direct link in case visitors prefer using the native WhatsApp app.

### 3. Dynamic GitHub Integration
- The Hero section automatically fetches and displays real-time GitHub statistics (public repositories and followers) directly from the GitHub API upon page load.

### 4. Animated UI & Sections
- **Framer Motion:** Smooth scroll animations, spring-loaded popups, and micro-interactions throughout the site.
- **Experience Timeline:** A vertical, animated timeline tracking professional work experience (including Odoo ERP systems).
- **Projects & Designs:** Interactive grid galleries showcasing both software engineering projects and graphic design portfolios.

---

## 🛠️ Tech Stack

- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Hosting:** Cloudflare Pages (Auto-deploys via GitHub)
- **Storage/CDN:** Cloudflare R2 Buckets (Static assets & live uploads)
- **Serverless API:** Cloudflare Workers (Image upload handler)

---

## ⚙️ Environment Variables Setup

To run this project locally or configure it on Cloudflare Pages, you must create a `.env` file in the root directory. 

*(Note: These must also be added to Cloudflare Pages under **Settings > Environment variables** for the live site to work).*

```env
# 1. Main Assets Bucket (where icons/backgrounds live)
VITE_CLOUDFLARE_IMAGE=https://pub-xxxx.r2.dev/portfolio/assets

# 2. CallMeBot configuration for the Chat Widget
VITE_CALLMEBOT_PHONE=your_whatsapp_number
VITE_CALLMEBOT_APIKEY=your_callmebot_api_key

# 3. Admin Photo Upload Configuration
VITE_ADMIN_PASSWORD=your_secure_password
VITE_WORKER_URL=https://portfolio-image-upload.your-subdomain.workers.dev
VITE_WORKER_ADMIN_KEY=your_worker_secret_key

# 4. Upload Bucket (where the live admin photo is saved)
VITE_UPLOAD_BUCKET_URL=https://pub-yyyy.r2.dev/portfolio/assets
```

---

## 💻 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## ☁️ Deployment Architecture

1. **Frontend:** Pushing to the `main` branch on GitHub automatically triggers a build and deploy on **Cloudflare Pages**.
2. **Worker:** The image upload API is managed locally via `wrangler.toml` and deployed using `npx wrangler deploy` in the `cloudflare-worker` directory.
