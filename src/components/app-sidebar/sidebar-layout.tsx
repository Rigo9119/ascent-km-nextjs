'use client'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { usePathname } from 'next/navigation'
import { useMemo } from "react";

import { User } from "@supabase/supabase-js";
import { Breadcrumb, SiteHeader } from "./site-header";

interface SidebarLayoutProps {
  user: User | null;
  children: React.ReactNode
}

export const SidebarLayout = ({ children, user }: SidebarLayoutProps) => {
  // Inside your component:
  const pathname = usePathname()

  const breadcrumbs: Breadcrumb[] = useMemo(() => {
    // Remove leading slash and split into segments
    const urlSegments = pathname.slice(1).split('/').filter(Boolean)

    return urlSegments.map((segment: string, index: number, array: string[]) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + array.slice(0, index + 1).join('/'),
      isLast: index === array.length - 1
    }))
  }, [pathname])

  return (
    <SidebarProvider style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }>
      <AppSidebar user={user} />
      <SidebarInset>
        <SiteHeader breadcrumbs={breadcrumbs} />
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
