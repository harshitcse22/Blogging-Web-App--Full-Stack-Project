import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({ 
  label, 
  error, 
  className, 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={clsx(
          'w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200',
          'focus:ring-2 focus:ring-purple-500 focus:border-purple-500',
          'placeholder-gray-400',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input