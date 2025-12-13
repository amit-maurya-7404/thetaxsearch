"use client"

import { Calculator } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import Link from "next/link"

interface CalculatorCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  details?: string[]
}

export function CalculatorCard({ title, description, href, icon, details }: CalculatorCardProps) {
  return (
    <Link href={href}>
      <Card className="card-shadow hover:shadow-lg transition-all duration-300 h-full hover:border-primary cursor-pointer bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-2">
          <CardDescription className="text-sm">{description}</CardDescription>
          {details && details.length > 0 && (
            <ul className="space-y-1">
              {details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary font-bold flex-shrink-0">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
