"use client"
import { ContactForm } from "@/components"
import { motion } from "framer-motion"
import { Briefcase, FileText, Heart, ShieldCheck, StarIcon, Target, TrendingUp, Users, Zap } from "lucide-react"

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
}

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export default function AboutPage() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/40 to-background pt-10 md:pt-0">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                </div>

                <motion.div
                    className="container max-w-7xl mx-auto px-4 relative z-10 text-center"
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp}>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            About <span className="text-primary">theTaxSearch</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We're a team of experienced tax professionals dedicated to simplifying tax compliance for businesses and individuals.
                        </p>
                        {/* <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Get in <span className="text-primary">Touch</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Have questions about our tax services? We're here to help and answer any questions you might have.
                </p> */}
                    </motion.div>
                </motion.div>
            </section>


            {/* About Us Section */}
            <section className="py-20 border-y">
                <motion.div
                    className="container max-w-7xl mx-auto px-4"
                    initial="initial"
                    whileInView="animate"
                    variants={staggerContainer}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="text-center mb-0"
                        variants={fadeInUp}
                    >
                        {/* <h2 className="text-4xl md:text-5xl font-bold mb-0">
                  About <span className="text-primary">theTaxSearch</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We're a team of experienced tax professionals dedicated to simplifying tax compliance for businesses and individuals.
                </p> */}
                    </motion.div>

                    {/* Mission & Values */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                        variants={staggerContainer}
                    >
                        {[
                            {
                                icon: Target,
                                iconColor: 'text-blue-600',
                                title: "Our Mission",
                                desc: "To make tax compliance simple, affordable, and accessible to everyone",
                            },
                            {
                                icon: Heart,
                                iconColor: 'text-red-600',
                                title: "Our Values",
                                desc: "Integrity, transparency, and commitment to excellence in every interaction",
                            },
                            {
                                icon: Zap,
                                iconColor: 'text-yellow-600',
                                title: "Innovation",
                                desc: "We use latest tools and technology to streamline tax processes",
                            },
                            {
                                icon: Users,
                                iconColor: 'text-green-600',
                                title: "Customer Focus",
                                desc: "Your success is our success. We're here to support your growth",
                            },
                        ].map((item: any, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="bg-background border rounded-lg p-6 text-center hover:border-primary transition-colors"
                            >
                                <item.icon className={`w-10 h-10 mx-auto mb-3 ${item.iconColor}`} />
                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* About Content */}
                    <motion.div
                        // ध्यान दें: 4xl से 7xl किया गया है ताकि कंटेंट और इमेज साइड-बाय-साइड अच्छे से फिट हों।
                        className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-0"
                        variants={fadeInUp}
                    >
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">

                            <div className="p-8 md:p-12 lg:p-16 space-y-8">

                                {/* WHO WE ARE */}
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-lavender-400 mb-2">Our Foundation</p>
                                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Who We Are</h2>
                                    <p className="text-muted-foreground leading-relaxed text-lg">
                                        theTaxSearch is a leading tax compliance and advisory firm, powered by a dedicated team of certified tax professionals, Chartered Accountants, and financial experts. With over a decade of combined experience, we empower thousands of businesses and individuals to navigate the complexities of Indian tax laws with confidence and clarity.
                                    </p>
                                </div>

                                {/* WHAT WE DO - Services List */}
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">What We Do</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        <li className="flex items-start gap-3">
                                            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
                                            <span className="text-slate-600 dark:text-slate-400">Income Tax & GST Compliance</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-1" />
                                            <span className="text-slate-600 dark:text-slate-400">Tax Advisory and Strategic Planning</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-primary shrink-0 mt-1" />
                                            <span className="text-slate-600 dark:text-slate-400">TDS Management and Returns</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Briefcase className="w-5 h-5 text-primary shrink-0 mt-1" />
                                            <span className="text-slate-600 dark:text-slate-400">Company & LLP Formation</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* WHY CHOOSE US - Shortened for Visual Flow */}
                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Why Choose Us</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Our commitment to client-centric excellence, attention to detail, and seamless integration of modern technology ensure efficient, cost-effective, and highly personalized solutions for every client.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-white">
                <motion.div
                    className="container max-w-7xl mx-auto px-4"
                    initial="initial"
                    whileInView="animate"
                    variants={staggerContainer}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="text-center mb-12"
                        variants={fadeInUp}
                    >
                        <h2 className="text-4xl font-bold mb-4 text-black">Meet Our Team</h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">Seasoned tax professionals and chartered accountants ready to help.</p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                        variants={staggerContainer}
                    >
                        {[
                            {
                                name: "Sumit Yadav",
                                role: "Founder & Tax Expert",
                                bio: "7+ years experience in tax planning and corporate advisory.",
                                image: "./SUMIT_IMAGE.png",
                                imageClass: " object-top  pt-0",
                            },
                            {
                                name: "CA Mohsin Saifi",
                                role: "Indirect & Direct Tax Specialist",
                                bio: "6+ years handling indirect & direct taxation, accounting and regulatory compliance.",
                                image: "./default-avatar-gray.png",
                                imageClass: "object-top",
                            },
                            {
                                name: "CA Satyam Sharma",
                                role: "Audit & Consultancy",
                                bio: "Specialist in auditing, statutory compliance and corporate consultancy services.",
                                image: "./satyamsharma.jpeg",
                                imageClass: "object-[center_25%]",
                            },
                        ].map((member) => (
                            <motion.div
                                key={member.name}
                                variants={fadeInUp}
                                className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow transform hover:-translate-y-1"
                            >
                                <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-gradient-to-tr from-primary/10 to-purple-50 blur-2xl pointer-events-none"></div>

                                {/* Avatar */}
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className={`mx-auto w-24 h-24 rounded-2xl object-cover shadow-md mt-4 mb-4 ${member.imageClass}`}
                                    />
                                ) : (
                                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-lavender-500 to-purple-700 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
                                        {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join("")}
                                    </div>
                                )}

                                <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-white">
                                    {member.name}
                                </h3>
                                <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-3">
                                    {member.role}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                    {member.bio}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>


            </section>

            {/* Contact Form removed — contact lives on /contact route */}
            <ContactForm />

            {/* Stats Section */}
            <section className="py-16">
                <motion.div
                    className="container max-w-7xl mx-auto px-4"
                    initial="initial"
                    whileInView="animate"
                    variants={staggerContainer}
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "1500+", label: "Happy Clients" },
                            { number: "5+", label: "Years of Experience" },
                            { number: "13.5Cr+", label: "Tax Filed" },
                            { number: "4.9/5", label: "Customer Rating", isRating: true },
                        ].map((stat, i) => (
                            <motion.div key={i} variants={fadeInUp}>
                                <p className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-1">
                                    {stat.number}
                                    {stat.isRating && <StarIcon className="w-6 h-6 text-purple-600" />}
                                </p>
                                <p className="text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </div >
    )
}
