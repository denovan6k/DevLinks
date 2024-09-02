import { Skeleton } from "@/components/ui/skeleton";
import React from 'react'

const EditFormSkeleton = () => {
  return (
    <div>
        <div className="flex justify-center">
        <div className="flex flex-col">
        <Skeleton className="h-[18px] w-[56px]" />
        <Skeleton className="h-[46px] flex flex-grow" />
        </div>
        <div className="flex flex-col">
        <Skeleton className="h-[18px] w-[56px]" />
        <Skeleton className="h-[46px] flex flex-grow" />
        </div>
        <div className="flex flex-col">
        <Skeleton className="h-[18px] w-[56px]" />
        <Skeleton className="h-[46px] flex flex-grow" />
        </div>
        </div>
        <Skeleton className="flex flex-grow" />
    </div>
  )
}

export default EditFormSkeleton