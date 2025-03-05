'use client'

import { clsx } from 'clsx'
import React from 'react'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  dark?: boolean
  className?: string
}

export function Heading({
  as: Component = 'h2',
  size = 'xl',
  dark = false,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={clsx(
        'font-display tracking-tight',
        {
          'text-2xl': size === 'sm',
          'text-3xl': size === 'md',
          'text-4xl': size === 'lg',
          'text-5xl': size === 'xl',
          'text-6xl': size === '2xl',
        },
        dark ? 'text-white' : 'text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

interface SubheadingProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  dark?: boolean
  className?: string
}

export function Subheading({
  as: Component = 'p',
  dark = false,
  className,
  children,
  ...props
}: SubheadingProps) {
  return (
    <Component
      className={clsx(
        'text-sm font-semibold uppercase tracking-wider',
        dark ? 'text-gray-400' : 'text-gray-500',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export function Lead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={clsx(className, 'text-2xl font-medium text-gray-500')}
      {...props}
    />
  )
}
