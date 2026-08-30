import { Link } from 'react-router-dom'
import Page from '../components/Page'

export default function NotFound() {
  return (
    <Page title="Page not found">
      <p>
        That page does not exist here. Try the{' '}
        <Link className="font-medium text-crimson underline underline-offset-2" to="/">
          home page
        </Link>
        , or the{' '}
        <a
          className="font-medium text-crimson underline underline-offset-2"
          href="https://hsph.harvard.edu/research/lin-lab/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Harvard Chan Lin Lab site
        </a>
        .
      </p>
    </Page>
  )
}
