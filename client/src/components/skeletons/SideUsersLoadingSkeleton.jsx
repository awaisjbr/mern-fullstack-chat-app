import React from 'react';
import { Skeleton } from "../ui/skeleton"

const SideUsersLoadingSkeleton = () => {
  return (
     <div className="flex flex-col space-y-3 mt-44 w-[450px]">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
    </div>
  )
}

export default SideUsersLoadingSkeleton
