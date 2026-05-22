import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Damien Huzard, PhD — Neuroscientist & Founder',
  description:
    'Neuroscientist, founder of NeuroNautix & Metadatapp, and pioneer of the FAIRRR framework for ethical, reproducible preclinical research.',
  openGraph: {
    title: 'Damien Huzard, PhD',
    description:
      'Neuroscientist, FAIR data advocate, and founder building tools for ethical preclinical research.',
    url: 'https://dhuzard.github.io',
    siteName: 'Damien Huzard',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Damien Huzard, PhD',
    description: 'Neuroscientist & founder. FAIRRR framework. FAIR data for preclinical research.',
    creator: '@dhuzard',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
