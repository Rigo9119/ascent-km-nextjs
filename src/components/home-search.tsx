'use client'

import { SearchBar } from "./search-bar"

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'event' | 'location' | 'community' | 'resource'
  href: string
}

export function HomeSearch() {
  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Search failed')
      }
      return await response.json()
    } catch (error) {
      console.error('Search error:', error)
      return []
    }
  }

  return (
    <SearchBar 
      onSearch={handleSearch}
      placeholder="Search events, locations, communities..."
      className="mb-8"
    />
  )
}