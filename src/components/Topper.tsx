import { site } from '../data/content'

/** The dark banner every page opens with, after the Harvard Chan lab template. */
export default function Topper() {
  return (
    <header className="bg-brick text-white">
      <div className="mx-auto max-w-content px-5 pb-14 pt-10 sm:px-8 lg:pb-16 lg:pt-12">
        <p className="text-xs uppercase tracking-[0.18em] text-khaki">
          Harvard T.H. Chan School of Public Health
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <h1 className="font-display text-5xl font-semibold leading-none sm:text-6xl">
            {site.name}
          </h1>
          <a
            href="https://hsph.harvard.edu/department/biostatistics/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-khaki/60 px-4 py-1.5 text-sm font-medium
                       text-khaki transition-colors hover:bg-khaki hover:text-brick-dark"
          >
            {site.department}
          </a>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <p className="max-w-3xl text-[1.0625rem] leading-relaxed text-white/85">{site.blurb}</p>

          <address className="space-y-5 not-italic text-sm text-white/85">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-khaki">
                Email
              </div>
              <div className="mt-1">
                Administrative Contact:{' '}
                <a className="underline underline-offset-2 hover:text-khaki" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-khaki">
                Location
              </div>
              <div className="mt-1">{site.location}</div>
            </div>
          </address>
        </div>
      </div>
    </header>
  )
}
