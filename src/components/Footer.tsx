import { Link } from 'react-router-dom'
import { site } from '../data/content'
import { flatNav } from '../data/nav'

export default function Footer() {
  return (
    <footer className="mt-20 bg-brick-dark text-white/80">
      <div className="mx-auto max-w-content px-5 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{site.name}</h2>
            <p className="mt-1 text-sm text-khaki">{site.department}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed">
              Harvard T.H. Chan School of Public Health
              <br />
              {site.location}
            </p>
            <p className="mt-3 text-sm">
              Administrative Contact:{' '}
              <a className="underline underline-offset-2 hover:text-khaki" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-khaki">
              Explore
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {flatNav.map((n) => (
                <li key={n.to}>
                  <Link className="hover:text-khaki" to={n.to!}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lin Lab, Harvard T.H. Chan School of Public Health.</p>
          <p>
            Also on{' '}
            <a
              className="underline underline-offset-2 hover:text-khaki"
              href="https://hsph.harvard.edu/research/lin-lab/"
              target="_blank"
              rel="noopener noreferrer"
            >
              hsph.harvard.edu
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
