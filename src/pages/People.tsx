import Page from '../components/Page'
import PersonCard from '../components/PersonCard'
import type { PeopleGroup } from '../data/content'

interface Props {
  title: string
  intro?: string
  groups: PeopleGroup[]
}

export default function People({ title, intro, groups }: Props) {
  return (
    <Page title={title} intro={intro}>
      {groups.map((g, i) => (
        <section key={i} className="mb-12 last:mb-0">
          {g.group && (
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              {g.group}
            </h2>
          )}
          <div className="border-t border-black/10">
            {g.people.map((p) => (
              <PersonCard key={p.id || p.name} person={p} />
            ))}
          </div>
        </section>
      ))}
    </Page>
  )
}
