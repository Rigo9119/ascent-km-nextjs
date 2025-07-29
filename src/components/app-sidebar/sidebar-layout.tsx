'use client'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { usePathname } from 'next/navigation'
import { useMemo } from "react";
import { AppBreadcrumbs } from "./app-breadcrumb";
import { User } from "@supabase/supabase-js";

interface SidebarLayoutProps {
  user: User | null;
  children: React.ReactNode
}

export const SidebarLayout = ({ children, user }: SidebarLayoutProps) => {
  // Inside your component:
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    // Remove leading slash and split into segments
    const urlSegments = pathname.slice(1).split('/').filter(Boolean)

    return urlSegments.map((segment: string, index: number, array: string[]) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + array.slice(0, index + 1).join('/'),
      isLast: index === array.length - 1
    }))
  }, [pathname])

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-8 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          {breadcrumbs.length > 0 && (<AppBreadcrumbs breadcrumbs={breadcrumbs} />)}
        </header>
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
