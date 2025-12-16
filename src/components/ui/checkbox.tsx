import * as React from "react"

import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: 'checkbox' | 'switch'
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, type = 'checkbox', ...props }, ref) => {
    if (type === 'switch') {
      return (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <div className={cn(
            "relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer",
            "peer-checked:after:translate-x-full peer-checked:after:border-white",
            "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
            "peer-checked:bg-blue-500",
            className
          )} />
        </label>
      )
    }
    
    return (
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
