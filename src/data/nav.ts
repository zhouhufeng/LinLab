export interface NavItem {
  label: string
  to?: string
  children?: NavItem[]
}

/** Mirrors the menu on the source site, with URLs kept parallel to it. */
export const nav: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'People',
    children: [
      { label: 'Lab Members', to: '/lab-members' },
      { label: 'Alumni', to: '/alumni' },
    ],
  },
  { label: 'Research', to: '/research' },
  { label: 'Projects', to: '/projects' },
  { label: 'Software', to: '/software' },
  {
    label: 'Grants',
    children: [
      { label: 'Research Grants', to: '/grants/research-grants' },
      { label: 'Genomics Training Grant', to: '/grants/genomics-training-grant' },
      { label: 'PQG Student/Postdoc Travel Fund', to: '/grants/pqg-student-postdoc-travel-fund' },
    ],
  },
  { label: 'Consortia and Affiliates', to: '/consortia-and-affiliates' },
  { label: 'Open Positions', to: '/open-positions' },
]

/** Every routable path, used to build the sitemap and to flatten the menu. */
export const flatNav = nav.flatMap((n) => (n.to ? [n] : (n.children ?? [])))
