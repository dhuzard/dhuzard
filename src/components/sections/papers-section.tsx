import { Paper } from '@/lib/content'

interface PapersSectionProps {
  papers: Paper[]
}

function groupByYear(papers: Paper[]): Map<number, Paper[]> {
  const map = new Map<number, Paper[]>()
  for (const paper of papers) {
    const year = paper.year
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(paper)
  }
  return map
}

export function PapersSection({ papers }: PapersSectionProps) {
  const grouped = groupByYear(papers)
  const years = Array.from(grouped.keys()).sort((a, b) => b - a)

  return (
    <section id="papers" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <div className="mb-12">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#888888]">
            Research
          </p>
          <h2 className="text-2xl font-bold text-[#e5e5e5] sm:text-3xl">Publications</h2>
        </div>

        {papers.length === 0 ? (
          <div className="rounded-xl border border-[#262626] bg-[#141414] p-8 text-center">
            <p className="mb-2 text-sm text-[#e5e5e5]">Publications loading&hellip;</p>
            <p className="text-xs text-[#888888]">
              Run{' '}
              <code className="rounded bg-[#1c1c1c] px-1.5 py-0.5 font-mono text-pink-muted">
                npm run sync:orcid
              </code>{' '}
              to fetch papers from ORCID.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {years.map((year) => (
              <div key={year}>
                {/* Year heading */}
                <div className="mb-4 flex items-center gap-4">
                  <h3 className="text-sm font-semibold text-pink-muted">{year}</h3>
                  <div className="h-px flex-1 bg-[#262626]" />
                </div>

                {/* Papers for this year */}
                <div className="flex flex-col gap-4">
                  {grouped.get(year)!.map((paper, idx) => (
                    <div
                      key={paper.doi ?? paper.orcid_put_code ?? idx}
                      className="rounded-xl border border-[#262626] bg-[#141414] p-5 transition-all duration-200 hover:border-[#333333] hover:bg-[#1c1c1c]"
                    >
                      {/* Title */}
                      <h4 className="mb-2 text-sm font-semibold leading-snug text-[#e5e5e5] sm:text-base">
                        {paper.doi ? (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-pink-muted"
                          >
                            {paper.title}
                          </a>
                        ) : (
                          paper.title
                        )}
                      </h4>

                      {/* Authors */}
                      {paper.authors && paper.authors.length > 0 && (
                        <p className="mb-1.5 text-xs text-[#888888]">
                          {paper.authors.join(', ')}
                        </p>
                      )}

                      {/* Journal + meta row */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#888888]">
                        {paper.journal && (
                          <span className="italic">{paper.journal}</span>
                        )}
                        {paper.doi && (
                          <>
                            <span className="text-[#262626]">&bull;</span>
                            <a
                              href={`https://doi.org/${paper.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[#888888] transition-colors hover:text-pink-muted"
                            >
                              DOI: {paper.doi}
                            </a>
                          </>
                        )}
                        {paper.citation_count !== undefined && (
                          <>
                            <span className="text-[#262626]">&bull;</span>
                            <span>{paper.citation_count} citations</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
