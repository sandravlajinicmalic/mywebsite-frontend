import { InputHTMLAttributes, ChangeEvent } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

/**
 * Input atom komponenta
 * Osnovna input komponenta za formularne inpute
 */
const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  ...props 
}: InputProps) => {
  const baseStyles = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const normalStyles = 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500'
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white'
  
  const inputClasses = `${baseStyles} ${error ? errorStyles : normalStyles} ${disabledStyles} ${className}`
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input

