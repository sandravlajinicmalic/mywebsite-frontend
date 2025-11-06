import { ImgHTMLAttributes } from 'react'

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  rounded?: boolean
  roundedFull?: boolean
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
}

/**
 * Image atom komponenta
 * Osnovna image komponenta za prikaz slika sa različitim stilovima
 */
const Image = ({ 
  src,
  alt,
  className = '',
  rounded = false,
  roundedFull = false,
  objectFit = 'cover',
  loading = 'lazy',
  ...props 
}: ImageProps) => {
  const baseStyles = 'block'
  
  const roundedStyles = roundedFull ? 'rounded-full' : rounded ? 'rounded-lg' : ''
  
  const objectFitStyles = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }
  
  const classes = `${baseStyles} ${roundedStyles} ${objectFitStyles[objectFit]} ${className}`
  
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={classes}
      {...props}
    />
  )
}

export default Image

