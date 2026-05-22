import { Profile } from '@/lib/content'

interface HeroProps {
  profile: Profile
}

export function Hero({ profile }: HeroProps) {
  const ctaLinks = [
    {
      label: 'ORCID',
      href: profile.links.orcid,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 3.872-2.484 3.872-3.722 0-2.016-1.284-3.722-3.884-3.722h-2.285z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: profile.links.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      href: profile.links.github,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
    },
  ]

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Dot-grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />

      {/* Radial gradient overlay — fades grid at edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, #0d0d0d 100%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 md:py-40">
        {/* Eyebrow */}
        <p className="mb-4 text-sm font-medium tracking-widest text-[#888888] uppercase">
          Neuroscientist &amp; Founder
        </p>

        {/* Name */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#e5e5e5] sm:text-5xl md:text-6xl">
          {profile.name},{' '}
          <span className="text-pink-muted">{profile.degree}</span>
        </h1>

        {/* Tagline */}
        <p className="mb-6 max-w-2xl text-base italic text-[#888888] sm:text-lg">
          &ldquo;{profile.tagline}&rdquo;
        </p>

        {/* Bio */}
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-[#888888] sm:text-base">
          {profile.bio}
        </p>

        {/* CTA links */}
        <div className="flex flex-wrap gap-3">
          {ctaLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#262626] bg-[#141414] px-4 py-2 text-sm text-[#e5e5e5] transition-all hover:border-[#333333] hover:bg-[#1c1c1c] hover:text-pink-muted"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
          <a
            href="#experience"
            className="inline-flex items-center gap-2 rounded-lg bg-pink-muted px-4 py-2 text-sm font-medium text-[#0d0d0d] transition-all hover:bg-pink-muted/90"
          >
            View Experience
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
