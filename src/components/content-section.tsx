import Link from "next/link"
import { ContentCard } from "./content-card"
import { Button } from "./ui/button"

export type ContentItem = {
  id: string
  title: string
  description: string
  image: string
}

interface ContentSectionProps {
  title: string
  items: ContentItem[]
  viewAllHref: string
  getItemHref: (id: string) => string
}

export function ContentSection({ title, items, viewAllHref, getItemHref }: ContentSectionProps) {
  // Show maximum of 4 items
  const displayItems = items.slice(0, 4)

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Button asChild variant="outline" className="bg-emerald-400 text-white">
          <Link href={viewAllHref}>
            View All
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayItems.map((item) => (
          <ContentCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
            href={getItemHref(item.id)}
          />
        ))}
      </div>

      {displayItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No {title.toLowerCase()} available at the moment.</p>
        </div>
      )}
    </section>
  )
}
