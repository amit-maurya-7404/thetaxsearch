# Deploy theTaxSearch to Netlify - Complete Guide

Your project is ready for Netlify deployment! Follow these steps to deploy.

## 📋 Prerequisites

- [ ] GitHub account (free)
- [ ] Netlify account (free at https://netlify.com)
- [ ] MongoDB connection string (from MONGODB_SETUP.md)
- [ ] JWT_SECRET (any random string, e.g., `your-super-secret-key-12345`)

## 🚀 Quick Deployment (5 minutes)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - theTaxSearch project"

# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to https://netlify.com
2. Sign up or sign in
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **"GitHub"**
5. Authorize Netlify to access your GitHub
6. Select your repository
7. Click **"Deploy site"**

### Step 3: Configure Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to **Settings** → **Build & deploy** → **Environment**
3. Click **"Edit variables"**
4. Add these variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET = your-super-secret-key-12345
ADMIN_EMAIL = your-email@example.com
WHATSAPP_NUMBER = 919211918886
RESEND_API_KEY = re_xxxxxxxxxxxxx (from Resend)
```

5. Click **"Save"**
6. Netlify will automatically rebuild

### Step 4: Test Your Deployment

After the build completes (you'll see a green checkmark):

1. Visit your site URL (e.g., `https://your-site-name.netlify.app`)
2. Test all pages:
   - Homepage
   - Calculators
   - Blog
   - Admin login (password: `admin123`)
   - Try creating a blog post

## 📱 Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `thetaxsearch.com`)
4. Follow DNS configuration steps

## 🔄 Auto Deployments

Every time you push to GitHub, Netlify automatically:
- Pulls latest code
- Runs `npm run build`
- Deploys to production
- Notifies you of build status

## 🛠️ Testing Before Deployment

### Test build locally:

```bash
npm run build
npm run start
# Visit http://localhost:3000
```

### Check for errors:

```bash
npm run lint
npm run type-check
```

## 🐛 Troubleshooting

**Build fails with "Module not found"**
- Go to Netlify → Logs
- Check error message
- Usually means missing dependency or env variable
- Add to `package.json` and re-deploy

**Blog posts not showing**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access includes Netlify's IP (or use 0.0.0.0/0)
- Create new post from admin to test

**Admin login not working**
- Default password is `admin123`
- Make sure `JWT_SECRET` is set in environment
- Check browser console for errors

**Blog posts disappear after deploy**
- Using local file system? Will reset each deploy
- Solution: Use MongoDB (already set up!)
- Make sure `MONGODB_URI` env variable is saved in Netlify

**Slower than expected**
- First visit might be slow (Netlify cold start)
- MongoDB queries might be slow (check network tab)
- Add caching headers in netlify.toml if needed

## 🔐 Security Checklist

- [ ] Change default admin password (`admin123` → your password)
- [ ] Store JWT_SECRET in Netlify (not in code)
- [ ] Store MongoDB URI in Netlify (not in code)
- [ ] Enable HTTPS (automatic with Netlify)
- [ ] Set strong password in MongoDB
- [ ] Whitelist only your IPs in MongoDB if possible

To change admin password:
1. Edit `src/lib/auth.ts`
2. Change the demo password check
3. Use bcryptjs to hash new password
4. Redeploy

## 📊 Monitor Your Site

After deployment, use Netlify's built-in tools:

**Analytics:**
- Netlify Dashboard → Analytics

**Performance:**
- Netlify Dashboard → Edge Functions

**Logs:**
- Netlify Dashboard → Logs
- Useful for debugging errors

## 🚀 Next Steps

1. ✅ Deploy to Netlify (follow steps above)
2. 📧 Setup email (connect Resend API)
3. 🎨 Customize branding
4. 📱 Test on mobile
5. 🔍 Setup Google Analytics
6. 🔔 Monitor uptime

## 💡 Pro Tips

- **Keep `.env.local` local** - never commit it to GitHub
- **Use Netlify environment variables** for secrets
- **Test in preview** - Netlify creates preview for every PR
- **Monitor build time** - keep under 15 minutes
- **Use Netlify Forms** for contact form (optional upgrade)

## 📞 Support

- Netlify Docs: https://docs.netlify.com/
- Next.js on Netlify: https://docs.netlify.com/frameworks/next-js/
- Our Docs: Check README.md and other guides in project

## ✅ Deployment Complete!

Your theTaxSearch site is now live on Netlify! 🎉

Share your URL and start serving users!
