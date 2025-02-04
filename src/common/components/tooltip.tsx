'use client'

import React, { useState } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactNode
  width?: string
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  width = '100px',
  className,
}) => {
  const [visible, setVisible] = useState(false)

  const showTooltip = () => setVisible(true)
  const hideTooltip = () => setVisible(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div
          style={{ width: width }}
          className={`absolute bg-black dark:bg-gray-800 text-white  text-xs  p-2 rounded z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 ${
            className ?? ''
          }`}
        >
          {text}
        </div>
      )}
    </div>
  )
}

export default Tooltip
