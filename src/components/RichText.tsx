interface Props {
  html: string
  className?: string
}

/**
 * Renders a body extracted from the source CMS.
 *
 * The HTML is not arbitrary: scripts/extract_content.py strips it to a small
 * tag whitelist with only href/src/alt surviving, and it is baked into the
 * bundle at build time rather than fetched at runtime.
 */
export default function RichText({ html, className = '' }: Props) {
  return <div className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}
