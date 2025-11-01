import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

export interface BreadcrumbProps {
  url: string | undefined;
  label: string;
}

export default function BreadcrumbCustom({ breadcrumb }: { breadcrumb: BreadcrumbProps[] }) {
  return (
    <Breadcrumb className="container-md bg-muted/30 py-5">
      <BreadcrumbList>
        {breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            {item.url ? (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={item.url}>{item.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
            {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}