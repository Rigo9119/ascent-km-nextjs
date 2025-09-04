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
  DiamondPlus,
} from 'lucide-react'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
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
import { useAuth } from '@/hooks/use-auth'

export function AppSidebar() {
  const sidebar = useSidebar()
  const { user, isLoading } = useAuth()

  const menuItems = [
    {
      title: 'Inicio',
      url: '/',
      icon: Handshake
    },
    // {
    //   title: 'Comunidades',
    //   url: '/communities',
    //   icon: Handshake
    // },
    {
      title: 'Recursos',
      url: '/resources',
      icon: FileSearch
    },
  ]

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <div className="flex flex-row items-center justify-between">
          <h2 className="font-semibold text-emerald-600">Menú</h2>
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
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItems menuItems={menuItems} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Button variant='ghost' className='text-emerald-500 hover:text-emerald-700 cursor-pointer'>
                <DiamondPlus />
                Create a community
              </Button>
              <Button variant='ghost' className='text-emerald-500 hover:text-emerald-700 cursor-pointer'>
                <DiamondPlus />
                Create a discussion
              </Button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} NextRoots. Todos los derechos reservados.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
