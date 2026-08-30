import type { ReactNode } from 'react'

interface Props {
  title: string
  intro?: string
  children: ReactNode
}

/** Standard inner page: a serif h1 with a rule under it, then the body. */
export default function Page({ title, intro, children }: Props) {
  return (
    <article>
      <h1 className="font-display text-4xl font-semibold text-brick sm:text-5xl">{title}</h1>
      {intro && <p className="mt-4 max-w-3xl text-lg text-slate">{intro}</p>}
      <hr className="mt-8 border-black/10" />
      <div className="mt-8">{children}</div>
    </article>
  )
}
