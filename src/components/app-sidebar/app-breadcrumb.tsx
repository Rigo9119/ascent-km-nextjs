'use client'

import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

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
    <Breadcrumb className="h-auto w-fit">
      <BreadcrumbList className="h-auto flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((breadcrumb: BreadcrumbData, index: number) => (
          <React.Fragment key={index}>
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
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
