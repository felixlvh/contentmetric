'use client'

import { Button } from './button'
import { Link } from './link'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

export function HeroButtons() {
  return (
    <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
      <Button href="#">Get started</Button>
      <Button variant="outline" color="gray" href="/pricing">
        See pricing
      </Button>
    </div>
  )
}

export function HeroBanner() {
  return (
    <Link
      href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
      className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
    >
      Radiant raises $100M Series A from Tailwind Ventures
      <ChevronRightIcon className="size-4" />
    </Link>
  )
} 