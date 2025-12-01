import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { formatCurrency, calculateReadingTime } from "@/lib/utils"

interface BlogCardProps {
  slug: string
  title: string
  description: string
  date: string
  tags?: string[]
  readingTime?: number
}

export function BlogCard({ slug, title, description, date, tags, readingTime }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="card-shadow hover:shadow-2xl transition-all duration-300 h-full hover:border-primary cursor-pointer">
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription>{date}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {readingTime && (
            <p className="text-xs text-muted-foreground">
              {readingTime} min read
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
