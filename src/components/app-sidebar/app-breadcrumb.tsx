'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { Fragment, useMemo } from 'react'

interface BreadcrumbData {
  label: string
  href: string
  isLast: boolean
}

interface AppBreadcrumbsProps {
  breadcrumbs: BreadcrumbData[]
}

export function AppBreadcrumbs({ breadcrumbs }: AppBreadcrumbsProps) {

  return (
    <Breadcrumb className='mt-1 ml-2'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((breadcrumb: BreadcrumbData, index: number) => (
          <Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage>
                  {breadcrumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={breadcrumb.href}>
                  {breadcrumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
