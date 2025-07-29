'use client'

import {
  House,
  Map,
  User as UserIcon,
  Ticket,
  Handshake,
  CircleX,
  Heart,
  FileSearch,
  Settings,
  BookOpen,
  Calendar,
  Users,
  MessageSquare,
} from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import MenuItems from '@/components/app-sidebar/menu-items'

interface AppSidebarProps {
  user: User | null | undefined
}

export function AppSidebar({ user }: AppSidebarProps) {
  const sidebar = useSidebar()

  const handleLogout = async () => {
    // await supabase.auth.signOut()
    // router.push('/')
    // router.refresh()
  }

  // Menu items
  const menuItems = [
    {
      title: 'Home',
      url: '/',
      icon: House
    },
    {
      title: 'Events',
      url: '/event',
      icon: Ticket
    },
    {
      title: 'Locations',
      url: '/location',
      icon: Map
    },
    {
      title: 'Communities',
      url: '/communities',
      icon: Handshake,
      subitems: [
        {
          title: 'Discussions',
          url: '/communities/discussions',
          icon: MessageSquare
        }
      ]
    },
    {
      title: 'Resources',
      url: '/resources',
      icon: FileSearch
    },
    {
      title: 'Blog',
      url: '/blog',
      icon: BookOpen
    }
  ]

  // Protected menu items
  const protectedItems = [
    {
      title: 'Profile',
      url: '/profile',
      icon: UserIcon
    },
    {
      title: 'My Events',
      url: '/profile/my-events',
      icon: Calendar
    },
    {
      title: 'My Communities',
      url: '/profile/my-communities',
      icon: Users
    },
    {
      title: 'Favourites',
      url: '/favourites',
      icon: Heart
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-semibold text-emerald-600">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => sidebar.toggleSidebar()}
          >
            <CircleX color="oklch(59.6% 0.145 163.225)" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className='overflow-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItems menuItems={menuItems} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {user === undefined ? (
          <Skeleton className="h-20 w-full" />
        ) : user ? (
          <SidebarGroup>
            <SidebarGroupLabel>Profile</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <MenuItems menuItems={protectedItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        {user === undefined ? (
          // Optionally, show a spinner or nothing while loading
          null
        ) : !user ? (
          <div className="flex flex-col gap-2">
            <Button
              asChild
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Link href="/auth?mode=login">Log in</Link>
            </Button>
            <Button
              asChild
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Link href="/auth?mode=sign-up">Sign up</Link>
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleLogout}
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            Log out
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
