import { Link } from 'react-router-dom'
import Gallery from '../components/Gallery'
import RichText from '../components/RichText'
import { content } from '../data/content'

const HIGHLIGHTS = [
  {
    to: '/software',
    label: 'Software',
    text: 'FAVOR, STAAR, STAARpipeline and a dozen more R packages built in the lab.',
  },
  {
    to: '/research',
    label: 'Research',
    text: 'Scalable statistics and machine learning for the genome, exome, exposome and phenome.',
  },
  {
    to: '/lab-members',
    label: 'People',
    text: 'Research scientists, postdoctoral fellows and doctoral students across biostatistics and statistics.',
  },
]

export default function Home() {
  const { sections, news, gallery } = content.home

  return (
    <div>
      {sections.map((s, i) => (
        <RichText key={i} html={s.html} className="mb-5" />
      ))}

      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <li key={h.to}>
            <Link
              to={h.to}
              className="group block h-full border border-black/10 p-5 transition-colors
                         hover:border-crimson hover:bg-beige/40"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-crimson">
                {h.label}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-slate">{h.text}</span>
            </Link>
          </li>
        ))}
      </ul>

      {news.length > 0 && (
        <section aria-labelledby="news-heading" className="mt-16">
          <h2
            id="news-heading"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-slate"
          >
            In the Media
          </h2>
          <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
            {news.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 py-4"
                >
                  {n.image && (
                    <img
                      src={n.image}
                      alt={n.alt}
                      loading="lazy"
                      className="hidden h-16 w-24 shrink-0 rounded-sm object-cover sm:block"
                    />
                  )}
                  <span>
                    <span className="block font-medium text-brick group-hover:text-crimson">
                      {n.title}
                    </span>
                    <span className="mt-1 block text-sm text-slate">{n.date}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate">
            Headlines from the Harvard Chan School newsroom, captured when this site was built.
          </p>
        </section>
      )}

      <Gallery images={gallery} />
    </div>
  )
}
