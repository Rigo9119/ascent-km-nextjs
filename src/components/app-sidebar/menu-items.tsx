'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, LucideIcon } from 'lucide-react'
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'

interface SubItem {
  title: string
  url: string
  icon: LucideIcon
}

interface MenuItem {
  title: string
  url: string
  icon: LucideIcon
  subitems?: SubItem[]
}

interface MenuItemsProps {
  menuItems: MenuItem[]
}

export default function MenuItems({ menuItems }: MenuItemsProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpanded = (itemTitle: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }))
  }

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + '/')
  }

  return (
    <>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          {item.subitems && item.subitems.length > 0 ? (
            <>
              {/* Collapsible menu item with subitems */}
              <SidebarMenuButton asChild>
                <button
                  className={isActive(item.url)
                    ? 'flex w-full items-center justify-between gap-2 rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-600'
                    : 'flex w-full items-center justify-between gap-2 rounded px-2 py-1 transition-colors hover:bg-emerald-50 hover:text-emerald-600'}
                  onClick={() => toggleExpanded(item.title)}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 stroke-2" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight
                    className={`h-3 w-3 transition-transform ${expandedItems[item.title] ? 'rotate-90' : ''}`}
                  />
                </button>
              </SidebarMenuButton>

              {expandedItems[item.title] && (
                <SidebarMenuSub>
                  {/* Main Communities link */}
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link
                        href={item.url}
                        className={pathname === item.url
                          ? 'flex items-center gap-2 rounded bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-600'
                          : 'flex items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-600'}
                      >
                        <span>All {item.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  {/* Subitems */}
                  {item.subitems.map((subitem) => (
                    <SidebarMenuSubItem key={subitem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          href={subitem.url}
                          className={isActive(subitem.url)
                            ? 'flex items-center gap-2 rounded bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-600'
                            : 'flex items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-emerald-50 hover:text-emerald-600'}
                        >
                          <subitem.icon className="h-3 w-3 stroke-2" />
                          <span>{subitem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </>
          ) : (
            /* Regular menu item without subitems */
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className={isActive(item.url)
                  ? 'flex items-center gap-2 rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-600'
                  : 'flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-emerald-50 hover:text-emerald-600'}
              >
                <item.icon className="h-4 w-4 stroke-2" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </>
  )
}
