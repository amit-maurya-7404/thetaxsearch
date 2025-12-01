import type { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Providers from "@/components/Providers"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "theTaxSearch - Tax Compliance & Calculators",
  description:
    "Complete tax compliance solutions, calculators, and expert guidance. Income Tax, GST, TDS, HRA and more.",
  keywords: [
    "tax calculator",
    "income tax",
    "GST",
    "TDS",
    "HRA",
    "tax compliance",
    "India",
  ],
  authors: [{ name: "theTaxSearch" }],
  openGraph: {
    title: "theTaxSearch - Tax Compliance & Calculators",
    description:
      "Complete tax compliance solutions, calculators, and expert guidance.",
    url: "https://thetaxsearch.com",
    siteName: "theTaxSearch",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
