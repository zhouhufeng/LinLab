import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import SiteNav from './components/SiteNav'
import Topper from './components/Topper'
import { content } from './data/content'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import People from './pages/People'
import Standard from './pages/Standard'

/** Scroll to the top and retitle the tab on every navigation. */
function useRouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const heading = document.querySelector('main h1')?.textContent?.trim()
    document.title =
      heading && heading !== 'Lin Lab'
        ? `${heading} | Lin Lab`
        : 'Lin Lab | Harvard T.H. Chan School of Public Health'
  }, [pathname])
}

export default function App() {
  useRouteEffects()

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
                   focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-brick"
      >
        Skip to content
      </a>

      <Topper />

      <div className="mx-auto max-w-content px-0 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          <div className="lg:py-12">
            <SiteNav />
          </div>

          <main id="main" tabIndex={-1} className="px-5 py-10 sm:px-0 lg:py-12">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route
                path="/lab-members"
                element={<People title={content.members.title} groups={content.members.groups} />}
              />
              <Route path="/current-lab-members" element={<Navigate to="/lab-members" replace />} />
              <Route path="/people/lab-members" element={<Navigate to="/lab-members" replace />} />

              <Route
                path="/alumni"
                element={
                  <People
                    title={content.alumni.title}
                    intro="Former members of the Lin Lab and where their work took them."
                    groups={content.alumni.groups}
                  />
                }
              />

              <Route
                path="/research"
                element={
                  <Standard
                    title={content.research.title}
                    sections={content.research.sections}
                    expanded
                  />
                }
              />
              <Route
                path="/projects"
                element={
                  <Standard
                    title={content.projects.title}
                    intro="Work presented by lab members at recent conferences."
                    sections={content.projects.sections}
                    expanded
                  />
                }
              />
              <Route
                path="/software"
                element={<Standard title={content.software.title} sections={content.software.sections} />}
              />

              <Route
                path="/grants/research-grants"
                element={
                  <Standard
                    title={content.researchGrants.title}
                    sections={content.researchGrants.sections}
                  />
                }
              />
              <Route
                path="/grants/genomics-training-grant"
                element={
                  <Standard
                    title={content.genomicsTrainingGrant.title}
                    sections={content.genomicsTrainingGrant.sections}
                  />
                }
              />
              <Route
                path="/grants/pqg-student-postdoc-travel-fund"
                element={
                  <Standard
                    title={content.pqgTravelFund.title}
                    sections={content.pqgTravelFund.sections}
                  />
                }
              />

              <Route
                path="/consortia-and-affiliates"
                element={
                  <Standard title={content.consortia.title} sections={content.consortia.sections} />
                }
              />
              <Route
                path="/open-positions"
                element={
                  <Standard
                    title={content.openPositions.title}
                    sections={content.openPositions.sections}
                  />
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>

      <Footer />
    </>
  )
}
