# Cloudflare Worker — Deploy Instructions

Deploy this Worker once in ~5 minutes. You never need to touch it again.

---

## Step 1 — Create the Worker

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **Workers & Pages** in the left sidebar
3. Click **Create** → **Create Worker**
4. Give it a name, e.g. `portfolio-image-upload`
5. Click **Deploy** (ignore the default code for now)
6. Click **Edit code**
7. **Delete all the default code** and paste the entire contents of [`index.js`](./index.js)
8. Click **Deploy**

---

## Step 2 — Bind your R2 Bucket

1. In your Worker page, go to **Settings** → **Bindings**
2. Click **Add** → **R2 Bucket**
3. Set **Variable name**: `R2_BUCKET`
4. Set **R2 bucket**: select your existing bucket (the one with your portfolio assets)
5. Click **Save**

---

## Step 3 — Add the Admin Secret

1. Still in **Settings** → **Variables and Secrets** (Environment Variables)
2. Click **Add variable**
3. **Variable name**: `ADMIN_KEY`
4. **Value**: Choose a strong random string, e.g. `v!sh@n-p0rtf0l10-2026`
   *(This is the key the frontend will send — keep it secret)*
5. Click **Encrypt** then **Save**

---

## Step 4 — Get your Worker URL

After deploying, your Worker URL will look like:
```
https://portfolio-image-upload.YOUR-SUBDOMAIN.workers.dev
```
Copy this URL.

---

## Step 5 — Update your `.env`

Open `d:\htdocs\My projects\portfolio\.env` and fill in:

```env
VITE_ADMIN_PASSWORD=your_local_password_to_enter_admin_mode
VITE_WORKER_URL=https://portfolio-image-upload.YOUR-SUBDOMAIN.workers.dev
VITE_WORKER_ADMIN_KEY=v!sh@n-p0rtf0l10-2026
```

> ⚠️ `VITE_ADMIN_PASSWORD` is the password you type in the portfolio UI to unlock admin mode.
> `VITE_WORKER_ADMIN_KEY` is the secret sent to the Worker — keep both strong.

---

## Step 6 — Enable CORS on your R2 Bucket (for the public image URL)

1. Go to **R2** → your bucket → **Settings** → **CORS Policy**
2. Add this policy:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## Done! Test it

1. Restart your dev server: `npm run dev`
2. Open your portfolio in the browser
3. Press **`Ctrl + Shift + A`**
4. Enter your `VITE_ADMIN_PASSWORD`
5. Hover over your profile photo — a camera icon appears
6. Click it and pick a new image
7. It uploads to R2 and updates live!
