"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  FileText,
  BarChart3,
  Mail,
  LogOut,
  Plus,
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [stats, setStats] = useState([
    { label: "Total Blog Posts", value: "0", icon: FileText, iconColor: 'bg-blue-100 text-blue-600' },
    { label: "Published Articles", value: "0", icon: FileText, iconColor: 'bg-purple-100 text-purple-600' },
    { label: "Total Leads", value: "0", icon: Mail, iconColor: 'bg-pink-100 text-pink-600' },
    { label: "This Month", value: "0", icon: BarChart3, iconColor: 'bg-green-100 text-green-600' },
  ])

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthed(true)
      fetchStats()
    }
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/blog")
      const data = await response.json()
      const posts = data.posts || []
      
      const totalPosts = posts.length
      const publishedPosts = posts.filter((p: any) => p.status === "published" || !p.status).length
      const thisMonthPosts = posts.filter((p: any) => {
        const postDate = new Date(p.date || p.createdAt)
        const now = new Date()
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear()
      }).length

      setStats([
        { label: "Total Blog Posts", value: totalPosts.toString(), icon: FileText, iconColor: 'bg-blue-100 text-blue-600' },
        { label: "Published Articles", value: publishedPosts.toString(), icon: FileText, iconColor: 'bg-purple-100 text-purple-600' },
        { label: "Total Leads", value: "156", icon: Mail, iconColor: 'bg-pink-100 text-pink-600' },
        { label: "This Month", value: thisMonthPosts.toString(), icon: BarChart3, iconColor: 'bg-green-100 text-green-600' },
      ])
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  if (!isAuthed) return null

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="container max-w-7xl mx-auto px-4 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="opacity-90">Manage your blog and content</p>
          </div>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="text-primary"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="card-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-bold text-primary">
                            {stat.value}
                          </p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.iconColor}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Main Actions */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="card-shadow hover:border-primary transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Blog Posts
                  </CardTitle>
                  <CardDescription>Create and manage blog articles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Total Posts: 24 | Published: 18 | Drafts: 6
                  </p>
                  <div className="flex gap-2">
                    <Link href="/admin/new-post" className="flex-1">
                      <Button className="w-full">New Post</Button>
                    </Link>
                    <Link href="/admin/posts" className="flex-1">
                      <Button variant="outline" className="w-full">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="card-shadow hover:border-primary transition-colors h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Recent Leads
                  </CardTitle>
                  <CardDescription>Contact form submissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    This Month: 24 | Total: 156
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Raj Patel</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Priya Kumar</span>
                      <span className="text-muted-foreground">5 hours ago</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Amit Singh</span>
                      <span className="text-muted-foreground">1 day ago</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
