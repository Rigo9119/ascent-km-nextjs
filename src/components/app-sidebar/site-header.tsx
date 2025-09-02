'use client'

import { SidebarTrigger } from "../ui/sidebar";
import { AppBreadcrumbs } from "./app-breadcrumb";
import { HomeSearch } from "../home-search";
import { UserMenu } from "../user-menu";

export type Breadcrumb = {
  label: string;
  href: string;
  isLast: boolean;
};

interface SiteHeaderProps {
  breadcrumbs: Breadcrumb[];
}

export function SiteHeader({ breadcrumbs }: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="w-full flex items-center gap-4 px-4 py-6 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="bg-emerald-300 -ml-1" />
          {breadcrumbs.length > 0 && (<AppBreadcrumbs breadcrumbs={breadcrumbs} />)}
        </div>
        <div className="flex-1 flex justify-center items-center">
          <HomeSearch />
        </div>
        <div>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
