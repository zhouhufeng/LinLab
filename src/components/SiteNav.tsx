import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { nav, type NavItem } from '../data/nav'

function isActiveGroup(item: NavItem, pathname: string) {
  return (item.children ?? []).some((c) => c.to === pathname)
}

function Leaf({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <NavLink
      to={item.to!}
      end={item.to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'block border-l-2 py-2 pl-4 pr-2 text-sm transition-colors',
          isActive
            ? 'border-crimson bg-beige/60 font-semibold text-brick'
            : 'border-transparent text-slate hover:border-khaki hover:text-brick',
        ].join(' ')
      }
    >
      {item.label}
    </NavLink>
  )
}

/**
 * Sticky section menu. On small screens it collapses into a disclosure so the
 * content, not the menu, is what you land on.
 */
export default function SiteNav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  return (
    <nav aria-label="Lin Lab sections" className="lg:sticky lg:top-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-y border-black/10 bg-beige/50
                   px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-brick lg:hidden"
      >
        Menu
        <span aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      <div className={`${open ? 'block' : 'hidden'} py-2 lg:block lg:py-0`}>
        <p className="hidden pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate lg:block">
          Menu
        </p>
        <ul className="space-y-1">
          {nav.map((item) =>
            item.children ? (
              <li key={item.label}>
                <div
                  className={[
                    'border-l-2 py-2 pl-4 text-sm font-semibold',
                    isActiveGroup(item, pathname)
                      ? 'border-crimson text-brick'
                      : 'border-transparent text-brick',
                  ].join(' ')}
                >
                  {item.label}
                </div>
                <ul className="ml-4 space-y-1">
                  {item.children.map((c) => (
                    <li key={c.to}>
                      <Leaf item={c} onNavigate={() => setOpen(false)} />
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.to}>
                <Leaf item={item} onNavigate={() => setOpen(false)} />
              </li>
            ),
          )}
        </ul>
      </div>
    </nav>
  )
}
