import React from 'react'

export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: '#0003',
      display: 'grid',
      placeContent: 'center',
      color: 'white'
    }}>
      <div className='loader'></div>
    </div>
  )
}
