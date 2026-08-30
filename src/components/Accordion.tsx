import { useState, type ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  /** Open on first paint — used for the single-section pages. */
  defaultOpen?: boolean
}

export default function Accordion({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-black/10">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="font-display text-xl font-semibold text-brick sm:text-2xl">
            {title}
          </span>
          <span
            aria-hidden
            className={`shrink-0 text-2xl leading-none text-crimson transition-transform ${
              open ? 'rotate-45' : ''
            }`}
          >
            +
          </span>
        </button>
      </h2>
      {open && <div className="pb-8 pr-1">{children}</div>}
    </div>
  )
}
