import { SidebarTrigger } from "../ui/sidebar";
import { AppBreadcrumbs } from "./app-breadcrumb";

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
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="bg-emerald-300 -ml-1" />
        {breadcrumbs.length > 0 && (<AppBreadcrumbs breadcrumbs={breadcrumbs} />)}
      </div>
    </header>
  )
}
