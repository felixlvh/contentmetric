'use client'

import { clsx } from 'clsx'
import React from 'react'

interface GradientProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  rounded?: boolean
}

export function Gradient({ className, rounded = false, ...props }: GradientProps) {
  return (
    <div
      className={clsx(
        'absolute inset-0 ring-1 ring-black/5 ring-inset bg-gradient-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff]',
        rounded ? 'rounded-4xl' : '',
        className
      )}
      {...props}
    />
  )
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-[36rem] transform-gpu md:right-0',
          'bg-gradient-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff]',
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}
