import { Talk } from '@/lib/content'
import { Badge } from '@/components/ui/badge'

interface TalksSectionProps {
  talks: Talk[]
}

function TalkTypeVariant(type: string): 'keynote' | 'talk' | 'poster' | 'default' {
  if (type === 'keynote') return 'keynote'
  if (type === 'talk') return 'talk'
  if (type === 'poster') return 'poster'
  return 'default'
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function TalksSection({ talks }: TalksSectionProps) {
  return (
    <section id="talks" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="mb-12">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#888888]">
            Presentations
          </p>
          <h2 className="text-2xl font-bold text-[#e5e5e5] sm:text-3xl">Talks</h2>
        </div>

        {talks.length === 0 ? (
          <p className="text-sm text-[#888888]">No talks to display yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {talks.map((talk) => (
              <div
                key={talk.id}
                className="flex flex-col gap-3 rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-200 hover:border-[#333333] hover:bg-[#1c1c1c]"
              >
                {/* Type badge + date row */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={TalkTypeVariant(talk.type)}>
                    {talk.type.charAt(0).toUpperCase() + talk.type.slice(1)}
                  </Badge>
                  <time
                    dateTime={talk.date}
                    className="text-xs text-[#888888]"
                  >
                    {formatDate(talk.date)}
                  </time>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold leading-snug text-pink-muted sm:text-base">
                  {talk.title}
                </h3>

                {/* Event and location */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm text-[#e5e5e5]">{talk.event}</p>
                  <p className="text-xs text-[#888888]">{talk.location}</p>
                </div>

                {/* Tags */}
                {talk.tags && talk.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {talk.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(talk.slides_url || talk.recording_url) && (
                  <div className="flex gap-3 pt-1">
                    {talk.slides_url && (
                      <a
                        href={talk.slides_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#888888] underline underline-offset-2 transition-colors hover:text-pink-muted"
                      >
                        Slides
                      </a>
                    )}
                    {talk.recording_url && (
                      <a
                        href={talk.recording_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#888888] underline underline-offset-2 transition-colors hover:text-pink-muted"
                      >
                        Recording
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
