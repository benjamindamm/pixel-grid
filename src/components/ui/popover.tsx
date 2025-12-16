import * as React from "react"

import { cn } from "@/lib/utils"

interface PopoverProps {
  children: React.ReactNode
  content: string
  position?: 'above' | 'below' | 'left' | 'right'
}

export function Popover({ children, content, position = 'above' }: PopoverProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  const positionClasses = {
    above: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    below: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    above: "before:top-full before:left-1/2 before:-translate-x-1/2 before:border-l-4 before:border-r-4 before:border-t-4 before:border-l-transparent before:border-r-transparent before:border-t-gray-900",
    below: "before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-l-4 before:border-r-4 before:border-b-4 before:border-l-transparent before:border-r-transparent before:border-b-gray-900",
    left: "before:left-full before:top-1/2 before:-translate-y-1/2 before:border-t-4 before:border-b-4 before:border-l-4 before:border-t-transparent before:border-b-transparent before:border-l-gray-900",
    right: "before:right-full before:top-1/2 before:-translate-y-1/2 before:border-t-4 before:border-b-4 before:border-r-4 before:border-t-transparent before:border-b-transparent before:border-r-gray-900",
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xl whitespace-normal max-w-[200px]",
            "before:content-[''] before:absolute before:w-0 before:h-0",
            positionClasses[position],
            arrowClasses[position]
          )}
          style={{
            animation: 'fadeIn 0.2s ease-in-out',
          }}
        >
          {content}
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
