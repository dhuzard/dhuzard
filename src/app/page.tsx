import { getProfile, getExperience, getExpertise, getTalks, getPapers } from '@/lib/content'
import { Hero } from '@/components/sections/hero'
import { ExperienceSection } from '@/components/sections/experience-section'
import { ExpertiseSection } from '@/components/sections/expertise-section'
import { TalksSection } from '@/components/sections/talks-section'
import { PapersSection } from '@/components/sections/papers-section'

export default async function Home() {
  const [profile, experience, expertise, talks, papers] = await Promise.all([
    getProfile(),
    getExperience(),
    getExpertise(),
    getTalks(),
    getPapers(),
  ])

  return (
    <>
      <Hero profile={profile} />
      <ExperienceSection experience={experience} />
      <ExpertiseSection expertise={expertise} />
      <TalksSection talks={talks} />
      <PapersSection papers={papers} />
    </>
  )
}
