import React from 'react'
import Card from './Card'
import { Skeleton } from '@/components/ui/skeleton'
const Loading = () => {
  return (
<div className='absolute inset-0 px-[24px] flex flex-col justify-center items-center mx-auto'>

       {/* <div className='flex lp:hidden items-center py-[16px] gap-[16px]'>
       <Skeleton className='h-12  min-w-[116px]  rounded-lg'/>
       <Skeleton className='h-12 min-w-[116px] rounded-lg'/>
        
          
       </div> */}
       
       <div className='min-w-[237px] flex flex-col items-center mt-[56px]'>
              <Skeleton className='h-32 w-32 rounded-full'/>
               <div className=' mt-6 flex flex-col gap-4 justify-center items-center'>
               <Skeleton className='min-w-[173px] h-12 rounded-xl'/>
               <Skeleton className='min-w-[140px] h-8 rounded-xl'/> 
               </div>
               <div className='mt-[56px]'>
               {'abcde'.split('').map((option, index) => (
                <Skeleton key={index} className= 'min-w-[237px] mb-[20px] flex items-center p-[16px] '/>
                    
                

               ))}
               </div>
             
       </div>

     </div>
  )
}

export default Loading