import React from 'react'
import SkeletonShimmer from './SkeletonShimmer';
import './SkeletonStyles.css'

export default function SkeletonElement() {

  const element = [1, 2, 3, 4, 5].map((n) => {
    return (
      <div className='skeleton-wrapper' key={ n }>
        <div className='skeleton'></div>
        <SkeletonShimmer />
      </div>
    );
  })

  return (
    <>
      { element }
    </>
  )
}
