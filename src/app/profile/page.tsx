import React, { Suspense } from 'react'
import Skeload from './skeload'
import Profile from './Profile'
const test = () => {
  return (
    <div>
    <Suspense fallback={<Skeload />}>
      <Profile />
    </Suspense> 
    </div>
  )
}

export default test