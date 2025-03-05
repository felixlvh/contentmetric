import React from 'react'
import { BentoCard } from '@/components/ui/bento-card'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Footer } from '@/components/ui/footer'
import { Gradient } from '@/components/ui/gradient'
import { Keyboard } from '@/components/ui/keyboard'
import { Link } from '@/components/ui/link'
import { LinkedAvatars } from '@/components/ui/linked-avatars'
import { LogoCloud } from '@/components/ui/logo-cloud'
import { LogoCluster } from '@/components/ui/logo-cluster'
import { LogoTimeline } from '@/components/ui/logo-timeline'
import { Map } from '@/components/ui/map'
import { Navbar } from '@/components/ui/navbar'
import { Screenshot } from '@/components/ui/screenshot'
import { Testimonials } from '@/components/ui/testimonials'
import { Heading, Subheading } from '@/components/ui/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import { HeroBanner, HeroButtons } from '@/components/ui/client-components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  description:
    'ContentMetric helps you create, manage, and optimize your marketing content with AI-powered automation that understands your brand voice.',
}

function Hero() {
  return (
    <div className="relative">
      <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
      <Container className="relative">
        <Navbar
          banner={
            <Link
              href="/blog/introducing-contentmetric-ai"
              className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
            >
              Introducing ContentMetric AI - The Future of Content Marketing
              <ChevronRightIcon className="size-4" />
            </Link>
          }
        />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className="font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            Create content that converts.
          </h1>
          <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
            Transform your marketing with AI-powered content automation that understands your brand voice and delivers personalized content at scale.
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <Button asChild>
              <Link href="#">Start creating</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/pricing">View plans</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}

function FeatureSection() {
  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Heading as="h2" className="max-w-3xl">
          Your complete content automation workspace.
        </Heading>
        <Screenshot
          width={1216}
          height={768}
          src="/screenshots/app.png"
          className="mt-16 h-[36rem] sm:h-auto sm:w-[76rem]"
        />
      </Container>
    </div>
  )
}

function BentoSection() {
  return (
    <Container>
      <Subheading>Features</Subheading>
      <Heading as="h3" className="mt-2 max-w-3xl">
        AI-powered content creation with your brand voice.
      </Heading>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        <BentoCard
          eyebrow="Brand Voice"
          title="Define your unique voice"
          description="Train our AI to understand and replicate your brand's unique voice, tone, and style. Create content that consistently reflects your brand identity."
          graphic={
            <div className="h-80 bg-[url(/screenshots/profile.png)] bg-[size:1000px_560px] bg-[left_-109px_top_-112px] bg-no-repeat" />
          }
          fade={['bottom']}
          className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
        />
        <BentoCard
          eyebrow="AI Assistant"
          title="Smart content generation"
          description="Let our AI assistant help you create, edit, and refine your marketing content. Get intelligent suggestions and improvements in real-time."
          graphic={
            <div className="absolute inset-0 bg-[url(/screenshots/competitors.png)] bg-[size:1100px_650px] bg-[left_-38px_top_-73px] bg-no-repeat" />
          }
          fade={['bottom']}
          className="lg:col-span-3 lg:rounded-tr-4xl"
        />
        <BentoCard
          eyebrow="Editor"
          title="Powerful content editor"
          description="Create and edit content with our intuitive editor. Use keyboard shortcuts and formatting tools to streamline your workflow."
          graphic={
            <div className="flex size-full pt-10 pl-10">
              <Keyboard highlighted={['LeftCommand', 'LeftShift', 'D']} />
            </div>
          }
          className="lg:col-span-2 lg:rounded-bl-4xl"
        />
        <BentoCard
          eyebrow="Templates"
          title="Ready-to-use templates"
          description="Start with our collection of marketing templates. Customize them with your brand voice for faster content creation."
          graphic={<LogoCluster />}
          className="lg:col-span-2"
        />
        <BentoCard
          eyebrow="Automation"
          title="Content automation"
          description="Automate repetitive content tasks while maintaining quality and brand consistency. Save time on routine content creation."
          graphic={<Map />}
          className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl"
        />
      </div>
    </Container>
  )
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <main>
        <Container className="mt-10">
          <LogoCloud />
        </Container>
        <div className="bg-gradient-to-b from-white from-50% to-gray-100 py-32">
          <FeatureSection />
          <BentoSection />
        </div>
      </main>
      <Testimonials />
      <Footer />
    </div>
  )
}
