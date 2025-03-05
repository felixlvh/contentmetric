'use client'

import { clsx } from 'clsx'
import Image from 'next/image'
import React from 'react'

interface ScreenshotProps {
  src: string
  alt?: string
  width: number
  height: number
  className?: string
}

export function Screenshot({ src, alt = '', width, height, className }: ScreenshotProps) {
  return (
    <div className={clsx('relative rounded-2xl bg-gray-50 p-4', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-lg bg-gray-50 ring-1 ring-gray-900/5"
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
    </div>
  )
}
