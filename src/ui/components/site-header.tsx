import { Separator } from "~/ui/components/ui/separator";
import { SidebarTrigger } from "~/ui/components/ui/sidebar";
import { Skeleton } from "~/ui/components/ui/skeleton";
import { CancelablePromise, PartnerService } from "../api";

export function SiteHeader() {
  const { data: partner, isLoading } = useQuery(PartnerService.getApiPartner());

  return (
    <header className="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
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
function useQuery(arg0: CancelablePromise<any>): { data: any; isLoading: any } {
  throw new Error("Function not implemented.");
}
