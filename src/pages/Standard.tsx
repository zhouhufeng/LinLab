import Page from '../components/Page'
import Sections from '../components/Sections'
import type { Section } from '../data/content'

interface Props {
  title: string
  intro?: string
  sections: Section[]
  expanded?: boolean
}

/** Every page whose body is just extracted sections. */
export default function Standard({ title, intro, sections, expanded }: Props) {
  return (
    <Page title={title} intro={intro}>
      <Sections sections={sections} expanded={expanded} />
    </Page>
  )
}
