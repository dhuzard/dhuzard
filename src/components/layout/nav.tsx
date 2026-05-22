'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Experience', href: '#experience' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Talks', href: '#talks' },
  { label: 'Papers', href: '#papers' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Determine active section
      const sections = navLinks.map((l) => l.href.slice(1))
      let current = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) current = id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-[#262626] bg-[#0d0d0d]/90 backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        {/* Logo / Name */}
        <a
          href="#"
          className="text-sm font-semibold text-[#e5e5e5] transition-colors hover:text-pink-muted"
        >
          Damien Huzard
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'text-sm transition-colors',
                  activeSection === link.href.slice(1)
                    ? 'text-pink-muted'
                    : 'text-[#888888] hover:text-[#e5e5e5]'
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 p-1 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              'h-0.5 w-5 bg-[#e5e5e5] transition-all',
              menuOpen && 'translate-y-2 rotate-45'
            )}
          />
          <span
            className={cn(
              'h-0.5 w-5 bg-[#e5e5e5] transition-all',
              menuOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'h-0.5 w-5 bg-[#e5e5e5] transition-all',
              menuOpen && '-translate-y-2 -rotate-45'
            )}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-[#262626] bg-[#0d0d0d]/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'block text-sm transition-colors',
                    activeSection === link.href.slice(1)
                      ? 'text-pink-muted'
                      : 'text-[#888888] hover:text-[#e5e5e5]'
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
