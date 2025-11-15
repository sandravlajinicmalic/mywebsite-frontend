import { InputHTMLAttributes, ChangeEvent } from 'react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  error?: string
  disabled?: boolean
  className?: string
  variant?: 'default' | 'white'
}

const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  variant = 'default',
  ...props 
}: InputProps) => {
  // Default variant: border, black background, white text (for Login form)
  const defaultBaseStyles = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-offset-0 text-white bg-black placeholder:text-gray-400'
  const defaultNormalStyles = 'border-[rgba(244,114,182,0.3)] focus:border-[rgba(244,114,182,0.5)] focus:ring-[rgba(244,114,182,0.5)] focus:ring-offset-[rgba(244,114,182,0.5)]'
  const defaultErrorStyles = 'border-[rgba(244,114,182,0.3)] focus:border-[rgba(244,114,182,0.5)] focus:ring-[rgba(244,114,182,0.5)] focus:ring-offset-[rgba(244,114,182,0.5)]'
  const defaultDisabledStyles = disabled ? 'bg-gray-900 cursor-not-allowed opacity-50' : ''
  
  // White variant: no border, white background, black text (for Contact form and SmartCat)
  const whiteBaseStyles = 'w-full px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none text-black bg-white placeholder:text-gray-500'
  const whiteNormalStyles = ''
  const whiteErrorStyles = ''
  const whiteDisabledStyles = disabled ? 'bg-gray-200 cursor-not-allowed opacity-50' : ''
  
  const isWhiteVariant = variant === 'white'
  const baseStyles = isWhiteVariant ? whiteBaseStyles : defaultBaseStyles
  const normalStyles = isWhiteVariant ? whiteNormalStyles : defaultNormalStyles
  const errorStyles = isWhiteVariant ? whiteErrorStyles : defaultErrorStyles
  const disabledStyles = isWhiteVariant ? whiteDisabledStyles : defaultDisabledStyles
  
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
        <p className={`mt-1 text-sm ${variant === 'white' ? 'text-black' : 'text-white'}`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input

