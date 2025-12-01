"use client"

import { Calculator } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"

interface CalculatorCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export function CalculatorCard({ title, description, href, icon }: CalculatorCardProps) {
  return (
    <Link href={href}>
      <Card className="card-shadow hover:shadow-2xl transition-all duration-300 h-full hover:border-primary cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
