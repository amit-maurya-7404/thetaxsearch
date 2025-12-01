# Quick Start Guide - theTaxSearch

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

### 3. Update .env.local
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=your_resend_key_here
ADMIN_EMAIL=admin@thetaxsearch.com
JWT_SECRET=your_jwt_secret_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Browser
Visit `http://localhost:3000`

## 📍 Quick Navigation

| Page | URL | Features |
|------|-----|----------|
| Home | `/` | Hero, services, calculators, blog preview |
| Services | `/services` | Complete list of services |
| Income Tax | `/calculators/income-tax` | New/Old regime calculator |
| GST | `/calculators/gst` | GST calculator |
| HRA | `/calculators/hra` | HRA exemption calculator |
| TDS | `/calculators/tds` | TDS calculator |
| GST Search | `/calculators/gst-search` | GSTIN verification |
| Blog | `/blog` | Articles and resources |
| Blog Post | `/blog/[slug]` | Individual articles |
| Admin Login | `/admin/login` | Demo: admin123 |
| Admin Dashboard | `/admin/dashboard` | Stats and management |
| New Post | `/admin/new-post` | Create blog articles |
| All Posts | `/admin/posts` | Manage blog posts |

## ⚙️ Configuration

### Add New Calculator

1. Create page file: `src/app/calculators/[name]/page.tsx`
2. Add API route: `src/app/api/calculators/[name]/route.ts`
3. Add logic to `src/lib/calculators.ts`
4. Update homepage with card

### Add New Service

Edit `src/app/services/page.tsx` and add to services array

### Add Blog Post

#### Via File System:
Create MDX file in `src/content/posts/[slug].mdx`

#### Via Admin Panel:
1. Go to `/admin/dashboard`
2. Click "New Post"
3. Fill form and publish

### Testing MongoDB Connectivity

After you update `MONGODB_URI` in `.env.local` you can validate the connection with the helper script:

```powershell
npm run test-mongo
```

This script will attempt to connect to MongoDB using the value in `.env.local` and print either a successful ping or the full error (authentication/network), which helps debugging.

### Change Brand Colors

Edit `tailwind.config.ts`:
```tsx
colors: {
  primary: '#YOUR_COLOR',
  'primary-light': '#LIGHTER_SHADE',
  'primary-dark': '#DARKER_SHADE',
}
```

## 🧪 Testing Calculators

### Income Tax Calculator
- Income: 1000000
- Deductions: 100000
- Regime: New/Old
- Expected result varies by selection

### GST Calculator
- Amount: 10000
- Rate: 18%
- Expected GST: 1800, Total: 11800

### HRA Calculator
- Salary: 50000
- Rent: 30000
- City: Metro
- Expected: ~13000

## 📧 Contact Form Setup

### Enable Real Emails

1. Get Resend API key from https://resend.com
2. Add to `.env.local`:
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=your@email.com
```

3. Forms will now send real emails

### Demo Mode (Without Email)
- Leave RESEND_API_KEY empty
- Submissions logged to console

## 🔐 Admin Panel

### Default Credentials
- **URL**: `/admin/login`
- **Password**: `admin123`

### Change Password
Edit in `src/app/admin/login/page.tsx` and hash with:
```bash
npx bcryptjs admin123
```

## 🎨 Customization Tips

### Update Logo
Replace in `src/components/Navbar.tsx`:
```tsx
<span className="text-white font-bold">T</span>
```

### Update Contact Info
Edit in `src/components/Footer.tsx` and `src/components/CTAButtons.tsx`

### Update Social Links
Edit footer component with your social URLs

## 🚀 Build & Deploy

### Local Build Test
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms
See `DEPLOYMENT.md` for detailed instructions

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
lsof -i :3000
kill -9 PID
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Module Not Found
```bash
npm install
```

### TypeScript Errors
```bash
npm run type-check
```

## 📚 File Structure Quick Reference

```
src/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── services/page.tsx     ← Services
│   ├── calculators/          ← Calculator pages
│   ├── blog/                 ← Blog pages
│   ├── admin/                ← Admin panel
│   └── api/                  ← API routes
├── components/
│   ├── ui/                   ← ShadCN components
│   └── *.tsx                 ← Custom components
├── lib/
│   ├── utils.ts             ← Helpers
│   ├── calculators.ts       ← Calculator logic
│   └── auth.ts              ← Auth utilities
└── content/
    └── posts/               ← Blog posts
```

## 💡 Tips & Tricks

1. **Fast Development**: Use `npm run dev` for hot reload
2. **Type Safety**: Enable TypeScript strict mode
3. **Performance**: Use Next.js Image component
4. **SEO**: Update meta tags in layout.tsx
5. **Styling**: Tailwind classes auto-complete in VSCode
6. **Components**: Preview all components in Storybook (optional)

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [ShadCN UI](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 📞 Support

- **Issues?** Check this guide or see README.md
- **Email**: info@thetaxsearch.com
- **WhatsApp**: https://wa.me/919876543210

---

Happy coding! 🎉
