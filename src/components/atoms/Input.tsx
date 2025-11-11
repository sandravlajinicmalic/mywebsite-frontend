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
  const baseStyles = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-offset-0 text-white bg-black placeholder:text-gray-400'
  
  const normalStyles = 'border-pink-500/30 focus:border-pink-500/50 focus:ring-pink-500 focus:ring-offset-pink-500/50'
  const errorStyles = 'border-pink-500/30 focus:border-pink-500/50 focus:ring-pink-500 focus:ring-offset-pink-500/50'
  const disabledStyles = disabled ? 'bg-gray-900 cursor-not-allowed opacity-50' : ''
  
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
        <p className="mt-1 text-sm text-white">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input

