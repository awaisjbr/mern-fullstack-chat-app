import React from 'react';
import { Skeleton } from "../ui/skeleton"

const MessagesLoadingSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 py-20 px-10">
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-10 w-72 rounded-xl self-end" />
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-10 w-72 rounded-xl self-end" />
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-10 w-72 rounded-xl self-end" />
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-10 w-72 rounded-xl self-end" />
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-10 w-72 rounded-xl self-end" />
    </div>
  )
}

export default MessagesLoadingSkeleton
