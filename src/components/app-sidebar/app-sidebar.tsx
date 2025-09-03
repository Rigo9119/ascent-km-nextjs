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

  // Protected menu items TODO: delete and clean up after new menu moves to the header
  const protectedItems = [
    {
      title: 'Perfil',
      url: '/profile',
      icon: UserIcon
    },
    // {
    //   title: 'My Events',
    //   url: '/profile/my-events',
    //   icon: Calendar
    // },
    {
      title: 'Mis Comunidades',
      url: '/profile/my-communities',
      icon: Users
    },
    {
      title: 'Favoritos',
      url: '/favourites',
      icon: Heart
    },
    {
      title: 'Configuración',
      url: '/settings',
      icon: Settings
    }
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
          <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItems menuItems={menuItems} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : user ? (
          <SidebarGroup>
            <SidebarGroupLabel>Perfil</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <MenuItems menuItems={protectedItems} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} NextRoots. Todos los derechos reservados.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
