import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ContentCardProps {
  id: string
  title: string
  description: string
  image: string
  href: string
  className?: string
}

export function ContentCard({ id, title, description, image, href, className }: ContentCardProps) {
  return (
    <Link id={id} href={href} className="group block">
      <Card className={`overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] p-0 ${className}`}>
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="group-hover:text-emerald-600 transition-colors line-clamp-1">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
