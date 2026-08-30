import { useState } from 'react'
import type { Person } from '../data/content'

/** Fallback avatar: initials on a beige tile, for the alumni with no headshot. */
function Initials({ name, className = 'text-2xl' }: { name: string; className?: string }) {
  const initials = name
    .replace(/,.*$/, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
  return (
    <div
      aria-hidden
      className={`flex h-full w-full items-center justify-center bg-beige font-display
                  font-semibold leading-none text-brick/70 ${className}`}
    >
      {initials}
    </div>
  )
}

export default function PersonCard({ person }: { person: Person }) {
  const [open, setOpen] = useState(false)
  const hasDetail = person.bio.length > 0 || person.links.length > 0

  return (
    <div className="border-b border-black/10">
      <button
        type="button"
        onClick={() => hasDetail && setOpen((v) => !v)}
        aria-expanded={hasDetail ? open : undefined}
        disabled={!hasDetail}
        className="flex w-full items-center justify-between gap-4 py-5 text-left
                   disabled:cursor-default"
      >
        <span className="flex min-w-0 items-center gap-4">
          {/* Thumbnail in the collapsed row: a lab page reads better with faces
              on it than with a bare list of names. */}
          <span className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-full bg-beige sm:block">
            {person.image ? (
              <img
                src={person.image}
                alt=""
                loading="lazy"
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            ) : (
              <Initials name={person.name} className="text-base" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl font-semibold text-brick">
              {person.name}
            </span>
            {person.meta.map((m, i) => (
              <span key={i} className="mt-0.5 block text-sm text-slate">
                {m}
              </span>
            ))}
          </span>
        </span>
        {hasDetail && (
          <span
            aria-hidden
            className={`shrink-0 text-2xl leading-none text-crimson transition-transform ${
              open ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
        )}
      </button>

      {open && (
        <div className="grid gap-6 pb-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:pl-[4.5rem]">
          <figure className="hidden h-40 w-40 overflow-hidden rounded-sm bg-beige sm:block">
            {person.image ? (
              <img
                src={person.image}
                alt={person.alt || `${person.name} headshot`}
                loading="lazy"
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            ) : (
              <Initials name={person.name} />
            )}
          </figure>

          <div>
            {person.bio.map((p, i) => (
              <p key={i} className="mb-4 text-[1.0625rem] leading-relaxed last:mb-0">
                {p}
              </p>
            ))}
            {person.links.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {person.links.map((l, i) => (
                  <li key={i}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className="inline-block rounded-full border border-crimson px-4 py-1.5
                                 text-sm font-medium text-crimson transition-colors
                                 hover:bg-crimson hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
