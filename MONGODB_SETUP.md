# MongoDB Setup Guide

Your blog system is now set up with **MongoDB** for persistent storage that works everywhere!

## Quick Setup (5 minutes)

### Step 1: Create Free MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Sign Up"** (or Sign In if you have an account)
3. Complete the signup (use Google/GitHub for quick signup)

### Step 2: Create a Free Cluster
1. After login, click **"Create"** → **"Dedicated"** (or "Shared" for free tier)
2. Select **"AWS"** region closest to you (e.g., `ap-south-1` for India)
3. Click **"Create Cluster"** (free tier is sufficient)
4. Wait 2-3 minutes for cluster to deploy

### Step 3: Get Your Connection String
1. Click **"Connect"** button on your cluster
2. Choose **"Drivers"** (not Compass or Shell)
3. Select **"Node.js"** driver
4. Copy the connection string (looks like: `mongodb+srv://...`)
5. Replace `<password>` with your database password
6. Replace `<username>` with your username

Example:
```
mongodb+srv://myusername:mypassword@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Step 4: Add to Your Project
1. Open `.env.local` in your project (or create it if it doesn't exist)
2. Add this line:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```
3. Replace `username` and `password` with your actual credentials

### Step 5: Test It Works
1. Restart your dev server: `npm run dev`
2. Go to Admin → New Post
3. Create a blog post
4. Go to Blog page
5. Your post should appear! ✅

## Features

✅ **Works Locally** - Creates posts during development  
✅ **Works After Deployment** - Posts persist on Vercel, Netlify, etc.  
✅ **Free Tier** - MongoDB Atlas free tier is enough for most projects  
✅ **Automatic Fallback** - If MongoDB fails, falls back to local files  
✅ **Secure** - Connection string is private (in .env.local)

## Troubleshooting

**Posts not saving?**
- Check `.env.local` has correct MONGODB_URI
- Verify your IP is whitelisted in MongoDB Atlas (Network Access section)
- Check console for error messages

**Connection refused?**
- Go to MongoDB Atlas → Network Access
- Add your IP address (or use 0.0.0.0/0 to allow all)
- Wait 1-2 minutes for changes to take effect

**Still local only?**
- When you deploy, add MONGODB_URI to your deployment platform's environment variables
- For Vercel: Settings → Environment Variables → add MONGODB_URI

## For Production Deployment

Before deploying to production:

1. **Vercel/Netlify:**
   - Go to your deployment platform settings
   - Add `MONGODB_URI` as an environment variable
   - Use the same value as in `.env.local`

2. **Update IP Whitelist (Optional but recommended):**
   - Go to MongoDB Atlas → Network Access
   - Add your deployment platform's IP ranges
   - Or use 0.0.0.0/0 for easier setup (less secure but simpler)

3. **Test After Deploy:**
   - Create a test blog post on production
   - Verify it appears on blog page
   - Posts should persist across deploys

## Next Steps

- All new blog posts are automatically saved to MongoDB
- Blog page fetches from MongoDB every time
- Existing sample posts still work (fallback data)
- You can start creating unlimited blog posts! 🎉

Need help? Check the console logs for detailed error messages.
