import { Skeleton } from "@/components/ui/skeleton"

export const SkeletonLoader = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-[250px]" />
    <div className="grid grid-cols-3 gap-4">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
    <Skeleton className="h-[200px] w-full" />
    <div className="grid grid-cols-3 gap-4">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
  </div>
)

