# Deployment Guide for theTaxSearch

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed (if applicable)
- [ ] API keys validated
- [ ] Email service (Resend) configured
- [ ] WhatsApp number verified
- [ ] Admin password hash generated
- [ ] Build tested locally (`npm run build`)
- [ ] Tests pass (`npm run test`)
- [ ] No console errors or warnings

## 1. Vercel Deployment (Recommended)

### Step 1: Create Vercel Account
Visit https://vercel.com and sign up

### Step 2: Import Project
```bash
npm i -g vercel
vercel
```

### Step 3: Configure Environment Variables
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.example`
3. Redeploy

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=admin@thetaxsearch.com
JWT_SECRET=your_secure_secret
ADMIN_PASSWORD_HASH=bcrypt_hash
WHATSAPP_NUMBER=919211918886
```

### Step 4: Deploy
```bash
vercel --prod
```

## 2. Netlify Deployment

### Step 1: Build
```bash
npm run build
```

### Step 2: Create Netlify Site
- Go to https://netlify.com
- Create new site
- Connect GitHub repository

### Step 3: Configure Build Settings
```
Build command: npm run build
Publish directory: .next
```

### Step 4: Add Environment Variables
In Netlify settings, add all env variables

### Step 5: Deploy
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 3. Self-Hosted (Docker)

### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Build and Run
```bash
# Build image
docker build -t thetaxsearch:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APP_URL=http://yourdomain.com \
  -e RESEND_API_KEY=your_key \
  -e JWT_SECRET=your_secret \
  thetaxsearch:latest
```

## 4. AWS Deployment (EC2)

### Prerequisites
- EC2 instance (t2.micro or larger)
- Ubuntu 20.04 LTS
- Node.js 18+

### Installation Steps

1. **Connect to instance**
```bash
ssh -i your-key.pem ubuntu@your-ip
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone repository**
```bash
git clone your-repo-url
cd TheTaxSearch
```

4. **Install dependencies**
```bash
npm install
```

5. **Create environment file**
```bash
nano .env.local
# Add all environment variables
```

6. **Build application**
```bash
npm run build
```

7. **Install PM2**
```bash
sudo npm i -g pm2
```

8. **Start application**
```bash
pm2 start npm --name "thetaxsearch" -- start
pm2 save
pm2 startup
```

9. **Setup Nginx reverse proxy**
```bash
sudo apt-get install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/default
```

### Nginx Configuration
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

10. **Enable SSL**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 5. Digital Ocean App Platform

### Step 1: Create App
- Go to Digital Ocean
- Click "Apps" → "Create App"
- Connect GitHub

### Step 2: Configure
```yaml
name: thetaxsearch
services:
  - name: web
    github:
      repo: your-repo
      branch: main
    build_command: npm run build
    run_command: npm start
    envs:
      - key: NEXT_PUBLIC_APP_URL
        value: https://yourdomain.com
      - key: RESEND_API_KEY
        value: ${RESEND_API_KEY}
```

### Step 3: Deploy
Click "Create App" and deploy

## 6. GitHub Actions CI/CD

### Create `.github/workflows/deploy.yml`
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Performance Optimization

### Image Optimization
- Next.js Image component handles optimization
- WebP format for modern browsers
- Responsive images

### Code Splitting
- Automatic with Next.js
- Dynamic imports for large components

### Caching Strategy
```
- Static pages: 1 year
- API routes: No cache by default
- Images: 365 days
```

## Monitoring & Analytics

### Setup Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

### Setup Google Analytics
Add to `layout.tsx`:
```tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] Environment variables not exposed
- [ ] API rate limiting implemented
- [ ] Admin login protected
- [ ] Input validation on all forms
- [ ] SQL injection prevention
- [ ] XSS protection enabled

## Troubleshooting

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
lsof -i :3000
kill -9 PID
```

### Database Connection Issues
- Check connection string
- Verify network access
- Test credentials

## Rollback Strategy

### Vercel
- Dashboard → Deployments → Click previous version

### Docker
```bash
docker ps -a
docker run previous_image_id
```

### Manual Rollback
```bash
git revert COMMIT_HASH
npm run build
npm start
```

## Maintenance

### Regular Updates
```bash
npm update
npm audit
```

### Backup Database (if applicable)
```bash
# Regular backups
0 2 * * * /backup/db.sh
```

### Monitor Logs
```bash
pm2 logs thetaxsearch
```

---

**Questions or Issues?**
Contact: support@thetaxsearch.com
