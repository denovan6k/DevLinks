import React from 'react'
import Image from 'next/image'
import img1 from '../test/Group 356.png'
import Preview from '../test/Preview'

const IphoneFrame = () => {
  return (
    <div className='flex justify-center '>



<div className="relative flex justify-center items-center max-h-[834px]">
  <Image src={img1} alt='' className='' />
  <Preview className="absolute inset-0 flex justify-center px-[24px] flex-col  mx-auto mt-[40px]" />
</div>


        
    </div>
  )
}

export default IphoneFrame