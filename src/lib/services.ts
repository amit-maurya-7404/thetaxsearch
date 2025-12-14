import {
  FileText,
  ReceiptText,
  Clock,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle,
  Building2,
} from "lucide-react"

export const services = [
  {
    slug: "income-tax-return-filing",
    icon: FileText,
    iconColor: "bg-violet-100 text-violet-600",
    title: "Income Tax Return Filing",
    details: [
      "Individual & Business ITRs",
      "Filing for FY & AY",
      "Deduction optimization",
      "Notice support",
    ],
  },
  {
    slug: "gst-registration-and-filing",
    icon: ReceiptText,
    iconColor: "bg-emerald-100 text-emerald-600",
    title: "GST Registration & Filing",
    details: [
      "New & existing registrations",
      "Monthly & annual returns",
      "HSN/ITC reconciliation",
      "GST advisory",
    ],
  },
  {
    slug: "tds-return-filing",
    icon: BarChart3,
    iconColor: "bg-sky-100 text-sky-600",
    title: "TDS Return Filing",
    details: [
      "Quarterly returns (24Q/26Q)",
      "Challan & challan matching",
      "TDS certificates",
      "Compliance reports",
    ],
  },
  {
    slug: "business-company-registration",
    icon: Building2,
    iconColor: "bg-rose-100 text-rose-600",
    title: "Business/Company Registration",
    details: [
      "Pvt Ltd & LLP incorporation",
      "MOA/AOA & filings",
      "DIN/DSC assistance",
      "Post-incorporation compliance",
    ],
  },
  {
    slug: "12a-80g-registrations",
    icon: CheckCircle,
    iconColor: "bg-fuchsia-100 text-fuchsia-600",
    title: "12A & 80G Registrations",
    details: [
      "Trust & NGO registrations",
      "Application preparation",
      "Follow-up with authorities",
      "Annual compliance support",
    ],
  },
  {
    slug: "accounting-and-compliance",
    icon: Users,
    iconColor: "bg-indigo-100 text-indigo-600",
    title: "Accounting & Compliance Support",
    details: [
      "Bookkeeping & reconciliations",
      "Financial statements",
      "GST/TDS bookkeeping",
      "Statutory filings",
    ],
  },
  {
    slug: "tds-on-sale-of-property",
    icon: TrendingUp,
    iconColor: "bg-amber-100 text-amber-600",
    title: "TDS on Sale of Property",
    details: [
      "Section 194-IA guidance",
      "Computation & withholding",
      "Certificate issuance",
      "Sale-side compliance",
    ],
  },
]
