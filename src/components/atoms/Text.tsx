import { HTMLAttributes, ReactNode, ElementType } from 'react'

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'
export type TextColor = 'default' | 'muted' | 'primary' | 'danger' | 'success'

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'size'> {
  children: ReactNode
  as?: ElementType
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
  className?: string
}

const Text = ({ 
  children, 
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'default',
  className = '',
  ...props 
}: TextProps) => {
  const sizes: Record<TextSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  }
  
  const weights: Record<TextWeight, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }
  
  const colors: Record<TextColor, string> = {
    default: 'text-gray-900 dark:text-white',
    muted: 'text-gray-600 dark:text-gray-400',
    primary: 'text-indigo-600 dark:text-indigo-400',
    danger: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
  }
  
  // Automatically apply heading font and weight for h1-h6 elements
  const isHeading = typeof Component === 'string' && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(Component)
  const headingFont = isHeading ? 'font-heading' : ''
  
  // Use weight 600 (semibold) for all headings, otherwise use the specified weight (default 400/normal for body text)
  const effectiveWeight = isHeading ? 'semibold' : weight
  
  const classes = `${sizes[size]} ${weights[effectiveWeight]} ${colors[color]} ${headingFont} ${className}`
  
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}

export default Text

