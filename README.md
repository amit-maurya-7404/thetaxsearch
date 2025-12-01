# theTaxSearch - Complete Tax Compliance Platform

A production-ready Next.js 14 web application for tax compliance, calculators, and financial guidance built with TypeScript, TailwindCSS, ShadCN UI, and Framer Motion.

## Features

### 🧮 Calculators
- **Income Tax Calculator** - Calculate tax liability with new/old regime options
- **GST Calculator** - Compute GST on any amount with multiple rates
- **HRA Calculator** - Calculate maximum HRA exemption
- **TDS Calculator** - TDS calculation for different sections
- **GST Search** - Verify GST registration details

### 📚 Blog System
- MDX-powered blog articles
- Tag-based filtering and search
- Reading time estimation
- SEO-optimized with schema markup
- Admin panel for content management

### 🏢 Services
- GST registration and filing
- Income tax return preparation
- TDS management
- ROC filings
- MSME registration
- And more...

### 🎨 Design & UX
- Responsive mobile-first design
- Dark/light mode support
- Smooth animations with Framer Motion
- Modern component library (ShadCN UI)
- Purple theme (#8f63d9) matching brand

### 🔐 Admin Panel
- Admin dashboard with analytics
- Blog post creation and management
- Contact lead management
- Quick statistics

### 📧 Communication
- Contact form with email integration (Resend)
- WhatsApp integration
- Lead capture system

### 🔍 SEO
- Meta tags and descriptions
- Open Graph support
- JSON-LD schema markup
- Blog schema
- Mobile-friendly

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── contact/
│   │   ├── calculators/
│   │   └── gst-search/
│   ├── calculators/            # Calculator pages
│   ├── blog/                   # Blog system
│   ├── services/              # Services page
│   ├── admin/                 # Admin dashboard
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── components/
│   ├── ui/                    # ShadCN UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ServiceCard.tsx
│   ├── CalculatorCard.tsx
│   ├── BlogCard.tsx
│   └── CTAButtons.tsx
├── lib/
│   ├── utils.ts               # Utility functions
│   ├── mdx.ts                 # MDX helpers
│   └── auth.ts                # Authentication
├── content/
│   └── posts/                 # Blog posts (MDX)
└── styles/
    └── globals.css            # Global styles
```

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone or extract the project**
```bash
cd TheTaxSearch
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Update environment variables**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@thetaxsearch.com
JWT_SECRET=your_jwt_secret
WHATSAPP_NUMBER=919876543210
```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

## Features & Usage

### Homepage
- Hero section with CTA buttons
- Feature highlights
- Calculator overview cards
- Services overview
- Latest blog posts
- FAQ section
- Contact form

### Calculators
All calculators have:
- Beautiful UI with ShadCN components
- Real-time calculations
- Result cards with breakdown
- Responsive design
- Shareable results (optional)

#### Income Tax Calculator
- New regime (FY 2024-25)
- Old regime (FY 2024-25)
- Deduction input
- Tax breakdown with cess

#### GST Calculator
- Multiple GST rates (5%, 12%, 18%, 28%)
- Base amount to total calculation
- GST breakdown

#### HRA Calculator
- City category selection
- Monthly calculations
- Annual exemption computation
- Rent validation

#### TDS Calculator
- Multiple TDS sections (194C, 194D, 194J, etc.)
- Rate-based calculation
- Net amount after TDS

#### GST Search
- GSTIN validation
- Mock API for demo

### Blog
- Search functionality
- Tag-based filtering
- Individual article pages
- Reading time display
- Related posts (expandable)

### Admin Panel
- **Login**: Demo password: `admin123`
- **Dashboard**: Quick stats and actions
- **New Post**: Create blog articles
- **All Posts**: Manage existing content

## Customization

### Brand Colors
Edit `tailwind.config.ts`:
```tsx
colors: {
  primary: '#8f63d9',
  'primary-light': '#a78bdb',
  'primary-dark': '#7a4fc9',
}
```

### Services
Edit the services list in `src/app/services/page.tsx`

### Blog Posts
Add MDX files to `src/content/posts/` or use admin panel

### Calculator Logic
Modify calculation functions in:
- `src/app/calculators/*/page.tsx`
- `src/app/api/calculators/*/route.ts`

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

```
# App
NEXT_PUBLIC_APP_URL=production_url

# Email
RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=admin@thetaxsearch.com

# Admin Auth
JWT_SECRET=your_secret_key
ADMIN_PASSWORD_HASH=bcrypt_hash

# External APIs
GST_API_KEY=optional_api_key
DATABASE_URL=optional_db_url

# Communication
WHATSAPP_NUMBER=your_whatsapp_number
```

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Components**: ShadCN UI + Radix UI
- **Animations**: Framer Motion
- **Content**: MDX (next-mdx-remote)
- **Email**: Resend API
- **Icons**: Lucide React
- **Auth**: JWT + bcryptjs
- **Theme**: next-themes

## API Routes

### POST /api/contact
Contact form submission
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "message": "Need consultation..."
}
```

### POST /api/calculators/income-tax
```json
{
  "income": 1000000,
  "deductions": 100000,
  "regime": "new"
}
```

### POST /api/calculators/gst
```json
{
  "amount": 10000,
  "rate": 18
}
```

### POST /api/calculators/hra
```json
{
  "basicSalary": 50000,
  "rent": 30000,
  "cityCategory": "metro"
}
```

### POST /api/gst-search
```json
{
  "gstin": "27AABCT1234H1Z0"
}
```

## Performance Optimization

- ✅ Image optimization with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ CSS-in-JS with TailwindCSS
- ✅ API route caching
- ✅ SEO-friendly URLs
- ✅ Responsive images
- ✅ Minified bundle

## SEO Checklist

- ✅ Meta tags (title, description)
- ✅ Open Graph tags
- ✅ JSON-LD schema
- ✅ Sitemap
- ✅ Robots.txt
- ✅ Mobile viewport
- ✅ Canonical URLs
- ✅ Structured data

## Security

- CSRF protection with API validation
- Input sanitization
- JWT-based admin auth
- Environment variable secrets
- Rate limiting ready (add middleware)
- CORS headers configured

## Future Enhancements

- [ ] Database integration (PostgreSQL)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Appointment booking system
- [ ] Document upload/management
- [ ] Real GST API integration
- [ ] CRM integration
- [ ] Email campaigns
- [ ] Mobile app

## Support & Contact

- **Email**: info@thetaxsearch.com
- **Phone**: +91 98765 43210
- **WhatsApp**: [Chat Link](https://wa.me/919876543210)

## License

Copyright © 2024 theTaxSearch. All rights reserved.

---

**Built with ❤️ for tax compliance simplification**
