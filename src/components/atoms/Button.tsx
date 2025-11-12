import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  className?: string
}

/**
 * Button atom komponenta
 * Osnovna button komponenta koja se može koristiti svugdje u aplikaciji
 */
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[#06B6D4] hover:bg-[#0891B2] text-white focus:ring-[#06B6D4] shadow-[0_0_10px_#06B6D4]',
    secondary: 'bg-brand-gray-dark hover:bg-brand-gray-darker text-white focus:ring-brand-gray-dark',
    outline: 'border-2 border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white focus:ring-[#06B6D4]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  }
  
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  const disabledStyles = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : ''
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

