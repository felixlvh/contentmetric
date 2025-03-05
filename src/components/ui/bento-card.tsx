'use client'

import { clsx } from 'clsx'
import React from 'react'

interface BentoCardProps {
  eyebrow: string
  title: string
  description: string
  graphic: React.ReactNode
  fade?: ('top' | 'bottom')[]
  dark?: boolean
  className?: string
}

export function BentoCard({
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
  dark = false,
  className,
}: BentoCardProps) {
  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-2xl',
        dark ? 'bg-gray-800' : 'bg-white',
        className
      )}
    >
      <div className="absolute inset-0 z-10">
        {fade.map((direction) => (
          <div
            key={direction}
            className={clsx(
              'absolute left-0 right-0 h-48 pointer-events-none',
              {
                'bottom-0 bg-gradient-to-t': direction === 'bottom',
                'top-0 bg-gradient-to-b': direction === 'top',
              },
              dark
                ? 'from-gray-800'
                : 'from-white',
              'to-transparent'
            )}
          />
        ))}
      </div>

      <div className="relative z-20 h-full p-6">
        <p
          className={clsx(
            'text-sm font-semibold',
            dark ? 'text-gray-400' : 'text-gray-500'
          )}
        >
          {eyebrow}
        </p>
        <h3
          className={clsx(
            'mt-3 text-xl font-semibold',
            dark ? 'text-white' : 'text-gray-900'
          )}
        >
          {title}
        </h3>
        <p
          className={clsx(
            'mt-2 text-sm',
            dark ? 'text-gray-300' : 'text-gray-500'
          )}
        >
          {description}
        </p>
        <div className="relative mt-6 h-[18.75rem]">{graphic}</div>
      </div>
    </div>
  )
}
