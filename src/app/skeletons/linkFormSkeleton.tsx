import { Skeleton } from "@/components/ui/skeleton";
import React from 'react'

const linkFormSkeleton = () => {
  return (
    <div>
            <div className="mb-4 p-[20px] rounded-xl flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 tb:min-w-[640px]"> 

          <Skeleton className="h-[24px] flex flex-grow"/>

            </div>
         
           
          </div>
          <div className="p-4 tb:min-w-[640px]">
            <div className="space-y-2">
              <Skeleton className="h-[13px] w-[300px]"/>
              
               
                <Skeleton className="flex flex-grow"/>
                
              
            </div>
            <div className="space-y-2 mt-4 w-[295px] tb:min-w-[640px]">
              <Skeleton className="h-[13px] w-[10px] tb:min-w-[300px]"/>
              
               
              <Skeleton className="flex flex-grow"/>
              </div>
            </div>
          </div>
    </div>
  )
}

export default linkFormSkeleton