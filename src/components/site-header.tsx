"use client";

import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { api } from "~/trpc/react";
import { Skeleton } from "./ui/skeleton";

export function SiteHeader() {
  const { data: partner, isLoading } = api.partner.get.useQuery();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <h1 className="text-base font-medium">{partner?.name ?? "Afflo"}</h1>
        )}
      </div>
    </header>
  );
}
