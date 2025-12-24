import React from 'react'
import Link from 'next/link'
import { CheckCircle, FileText, Users, BarChart3 } from 'lucide-react'
import { CTASection } from '@/components/CTAButtons'

export default function AuditAssurancePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            <section className="relative bg-gradient-to-br from-primary/10 to-white py-20 lg:py-28 overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Audit & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Assurance</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                            Building trust through transparent audits, financial accuracy, and compliance reliability.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/aboutus#contact-form-section" className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-sky-600 transform hover:scale-105 transition duration-300 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-200">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-2x1 font-bold text-primary uppercase tracking-wide mb-2">What We Offer</h2>
                        <h3 className="text-3xl font-bold text-slate-900">Audit & Assurance Services</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ServiceCard
                            icon={<FileText className="w-8 h-8 text-cyan-600" />}
                            title="Statutory & Tax Audits"
                            desc="Statutory audits under Companies Act 2013 and tax audits under the Income Tax Act to ensure regulatory compliance and accurate reporting."
                        />

                        <ServiceCard
                            icon={<BarChart3 className="w-8 h-8 text-sky-600" />}
                            title="GST Audits & Compliance Checks"
                            desc="Comprehensive GST audits, HSN/ITC reconciliation and compliance assessments to minimize exposure and optimize filings."
                        />

                        <ServiceCard
                            icon={<CheckCircle className="w-8 h-8 text-cyan-600" />}
                            title="Internal Audits & Fraud Risk"
                            desc="Internal control reviews, fraud risk assessments and process improvements to strengthen governance and mitigate risks."
                        />

                        <ServiceCard
                            icon={<Users className="w-8 h-8 text-amber-600" />}
                            title="Management & Stock Audits"
                            desc="Management audits, internal control reviews, stock audits and physical verification for accuracy and operational efficiency."
                        />
                    </div>
                </div>
            </section>



            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why choose our Audit & Assurance?</h2>
                            <p className="text-slate-600 mb-8 leading-relaxed">
                                Our Audit & Assurance services help businesses maintain compliance, strengthen internal controls, and build stakeholder confidence. We ensure accurate financial reporting, regulatory adherence, and risk mitigation across all business functions.
                            </p>
                            <div className="space-y-4">
                                <FeatureItem text="Experienced CA-led audit teams" />
                                <FeatureItem text="Comprehensive risk & control coverage" />
                                <FeatureItem text="Clear, actionable audit reporting" />
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-cyan-100 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Trusted Reporting</h4>
                                        <p className="text-sm text-slate-500">Audit reports tailored for stakeholders and regulators</p>
                                    </div>
                                </div>
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-4/5"></div>
                                </div>
                                <div className="mt-4 flex justify-between text-sm">
                                    <span className="text-slate-500">Engagement Focus</span>
                                    <span className="font-bold text-primary">Compliance & Assurance</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Our Process - moved earlier (not at the end) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900">Our Process</h2>
                        <p className="text-slate-600 mt-2">How we approach Audit & Assurance engagements</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>

                        <Step
                            number="01"
                            title="Planning"
                            desc="Understand business, scope and risk areas for focused audit procedures."
                        />
                        <Step
                            number="02"
                            title="Fieldwork"
                            desc="Execute audit testing, sampling and verification of transactions and controls."
                        />
                        <Step
                            number="03"
                            title="Reporting"
                            desc="Prepare clear audit reports with findings, recommendations and compliance status."
                        />
                        <Step
                            number="04"
                            title="Follow-up"
                            desc="Support implementation of recommendations and provide post-audit guidance."
                        />
                    </div>
                </div>
            </section>

            <CTASection />

        </div>
    )
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="p-8 border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white group">
            <div className="mb-6 p-4 bg-primary/10 rounded-xl w-fit transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
        </div>
    )
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-slate-700 font-medium">{text}</span>
        </div>
    )
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center md:text-left">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto md:mx-0 shadow-md">
                {number}
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
    )
}
