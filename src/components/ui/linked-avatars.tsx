'use client'

import { CheckIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const avatars = [
  {
    name: 'Emma Wilson',
    image: '👩‍💼',
  },
  {
    name: 'James Chen',
    image: '👨‍💼',
  },
  {
    name: 'Sarah Miller',
    image: '👩‍💻',
  },
  {
    name: 'Michael Brown',
    image: '👨‍💻',
  },
]

export function LinkedAvatars() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((index) => (index + 1) % avatars.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-4">
      <div className="relative h-14 w-14">
        {avatars.map((avatar, index) => (
          <motion.div
            key={avatar.name}
            className={clsx(
              'absolute inset-0 rounded-full bg-white flex items-center justify-center text-2xl',
              { 'opacity-0': activeIndex !== index }
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeIndex === index ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {avatar.image}
          </motion.div>
        ))}
      </div>
      <div className="ml-2 flex flex-col items-start justify-center">
        <div className="flex items-center gap-1.5">
          {avatars.map((avatar, index) => (
            <motion.div
              key={avatar.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex === index ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
              className={clsx('text-sm font-medium text-white', {
                'opacity-50': activeIndex !== index,
              })}
            >
              {avatar.name}
            </motion.div>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm text-white/70">
          <CheckIcon className="h-4 w-4" />
          <span>Online now</span>
        </div>
      </div>
    </div>
  )
}
