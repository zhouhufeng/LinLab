import { useState } from 'react'

interface Props {
  images: { src: string; alt: string }[]
}

export default function Gallery({ images }: Props) {
  const [i, setI] = useState(0)
  if (images.length === 0) return null

  const go = (delta: number) => setI((n) => (n + delta + images.length) % images.length)
  const current = images[i]!

  return (
    <section aria-label="Photo gallery" className="mt-16">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">
        Photo Gallery
      </h2>

      <figure className="mt-4 overflow-hidden rounded-sm bg-charcoal/5">
        <img
          src={current.src}
          alt={current.alt || 'Lin Lab photo'}
          loading="lazy"
          className="aspect-[3/2] w-full object-cover"
        />
      </figure>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate">{current.alt || `Photo ${i + 1}`}</p>
        <div className="flex items-center gap-2">
          <span className="mr-2 text-sm tabular-nums text-slate">
            {i + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="h-9 w-9 rounded-full border border-black/15 text-brick
                       transition-colors hover:border-crimson hover:text-crimson"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="h-9 w-9 rounded-full border border-black/15 text-brick
                       transition-colors hover:border-crimson hover:text-crimson"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
