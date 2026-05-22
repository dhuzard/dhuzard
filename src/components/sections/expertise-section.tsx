import { ExpertiseDomain } from '@/lib/content'
import { Card } from '@/components/ui/card'

interface ExpertiseSectionProps {
  expertise: ExpertiseDomain[]
}

export function ExpertiseSection({ expertise }: ExpertiseSectionProps) {
  return (
    <section id="expertise" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="mb-12">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#888888]">
            Skills
          </p>
          <h2 className="text-2xl font-bold text-[#e5e5e5] sm:text-3xl">Expertise</h2>
        </div>

        {/* 2×2 Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {expertise.map((domain) => (
            <Card
              key={domain.domain}
              hover
              className="flex flex-col gap-4"
            >
              {/* Domain header */}
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none" role="img" aria-label={domain.domain}>
                  {domain.icon}
                </span>
                <h3 className="text-base font-semibold text-pink-muted">{domain.domain}</h3>
              </div>

              {/* Skills list */}
              <ul className="flex flex-col gap-1.5">
                {domain.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 text-sm text-[#888888]"
                  >
                    <span
                      className="h-1 w-1 flex-shrink-0 rounded-full bg-pink-muted/50"
                      aria-hidden="true"
                    />
                    {skill}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
