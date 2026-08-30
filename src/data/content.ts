import raw from '../../data/content.json'

export interface Person {
  id: string
  name: string
  meta: string[]
  image: string | null
  alt: string | null
  bio: string[]
  links: { label: string; href: string }[]
}

export interface PeopleGroup {
  group: string | null
  people: Person[]
}

export interface Section {
  /** Accordion heading from the source page; null for a loose content block. */
  title: string | null
  /** Sanitised HTML — safe to render, see scripts/extract_content.py. */
  html: string
  links: { label: string; href: string }[]
}

export interface NewsItem {
  title: string
  href: string
  date: string
  image: string | null
  alt: string
}

interface Content {
  site: {
    name: string
    department: string
    blurb: string
    email: string
    location: string
  }
  members: { title: string; groups: PeopleGroup[] }
  alumni: { title: string; groups: PeopleGroup[] }
  home: { sections: Section[]; news: NewsItem[]; gallery: { src: string; alt: string }[] }
  research: { title: string; sections: Section[] }
  projects: { title: string; sections: Section[] }
  software: { title: string; sections: Section[] }
  consortia: { title: string; sections: Section[] }
  openPositions: { title: string; sections: Section[] }
  researchGrants: { title: string; sections: Section[] }
  genomicsTrainingGrant: { title: string; sections: Section[] }
  pqgTravelFund: { title: string; sections: Section[] }
}

export const content = raw as unknown as Content
export const site = content.site
