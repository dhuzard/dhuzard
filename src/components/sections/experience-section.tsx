import { Experience } from '@/lib/content'
import { Badge } from '@/components/ui/badge'

interface ExperienceSectionProps {
  experience: Experience[]
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="mb-12">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#888888]">
            Career
          </p>
          <h2 className="text-2xl font-bold text-[#e5e5e5] sm:text-3xl">Experience</h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#262626] md:left-[11px]" />

          <div className="flex flex-col gap-10">
            {experience.map((item) => (
              <div key={item.id} className="relative flex gap-6 md:gap-8">
                {/* Timeline dot */}
                <div className="relative mt-1.5 flex-shrink-0">
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-pink-muted bg-[#0d0d0d] md:h-[22px] md:w-[22px]" />
                </div>

                {/* Card */}
                <div className="flex-1 rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-200 hover:border-[#333333] hover:bg-[#1c1c1c]">
                  {/* Header row */}
                  <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-[#e5e5e5]">{item.role}</h3>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-pink-muted transition-colors hover:text-pink-muted/80"
                        >
                          {item.company}
                        </a>
                      ) : (
                        <span className="text-sm text-pink-muted">{item.company}</span>
                      )}
                    </div>
                    <span className="whitespace-nowrap text-xs text-[#888888]">{item.period}</span>
                  </div>

                  {/* Description */}
                  <p className="mb-4 mt-2 text-sm leading-relaxed text-[#888888]">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
