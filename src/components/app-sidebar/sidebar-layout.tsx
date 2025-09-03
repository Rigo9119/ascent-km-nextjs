'use client'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { usePathname } from 'next/navigation'
import { useMemo } from "react";
import { Breadcrumb, SiteHeader } from "./site-header";

interface SidebarLayoutProps {
  children: React.ReactNode
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  // Inside your component:
  const pathname = usePathname()

  const breadcrumbs: Breadcrumb[] = useMemo(() => {
    // Remove leading slash and split into segments
    const urlSegments = pathname.slice(1).split('/').filter(Boolean)

    return urlSegments.map((segment: string, index: number, array: string[]) => {
      // Check if segment looks like a UUID (contains hyphens and is long)
      const isId = segment.includes('-') && segment.length > 20
      
      let label: string
      if (isId) {
        // Shorten IDs to first 8 characters + "..."
        label = segment.substring(0, 8) + '...'
      } else {
        // Normal segment processing
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      }

      return {
        label,
        href: '/' + array.slice(0, index + 1).join('/'),
        isLast: index === array.length - 1
      }
    })
  }, [pathname])

  return (
    <SidebarProvider style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader breadcrumbs={breadcrumbs} />
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
