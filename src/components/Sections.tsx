import Accordion from './Accordion'
import RichText from './RichText'
import type { Section } from '../data/content'

interface Props {
  sections: Section[]
  /** Open every accordion by default — right for short pages like Research. */
  expanded?: boolean
}

/**
 * Renders an extracted page body. Untitled sections are plain prose; titled
 * ones (which were accordions in the source CMS) stay collapsible.
 */
export default function Sections({ sections, expanded = false }: Props) {
  return (
    <>
      {sections.map((s, i) =>
        s.title ? (
          <Accordion key={i} title={s.title} defaultOpen={expanded}>
            <RichText html={s.html} />
          </Accordion>
        ) : (
          <RichText key={i} html={s.html} className="mb-6" />
        ),
      )}
    </>
  )
}
