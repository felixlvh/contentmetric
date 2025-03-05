'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { clsx } from 'clsx'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: clsx(
          'inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
          'rounded-full border border-transparent bg-gray-950 shadow-md',
          'text-base font-medium whitespace-nowrap text-white',
          'data-disabled:bg-gray-950 data-disabled:opacity-40 data-hover:bg-gray-800',
        ),
        secondary: clsx(
          'relative inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
          'rounded-full border border-transparent bg-white/15 ring-1 shadow-md ring-[#D15052]/15',
          'after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_#ffffff4d]',
          'text-base font-medium whitespace-nowrap text-gray-950',
          'data-disabled:bg-white/15 data-disabled:opacity-40 data-hover:bg-white/20',
        ),
        outline: clsx(
          'inline-flex items-center justify-center px-2 py-[calc(--spacing(1.5)-1px)]',
          'rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
          'text-sm font-medium whitespace-nowrap text-gray-950',
          'data-disabled:bg-transparent data-disabled:opacity-40 data-hover:bg-gray-50',
        ),
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
