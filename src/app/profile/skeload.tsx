import React from 'react'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
const Skeload = () => {
  return (
    <div className='flex justify-center items-center'>

   <Skeleton style={{width:'193px', height: "193px" }} > </Skeleton>


    </div>
  )
}

export default Skeload