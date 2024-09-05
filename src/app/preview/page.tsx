import React, { Suspense } from 'react'
import Preview from './Preview'
import Loading from './Load'  // Import the loading component
import MobileLayout from '@/app/MobileLayout'
const Page = () => {
  return (
   
    <Suspense fallback={<Loading />}>
      <Preview />
    </Suspense>
   
  )
}

export default Page;
