import { Metadata } from 'next'

type GenerateMetadataProps = {
  title?: string
  description?: string
  image?: string
  type?: 'article' | 'website' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  noIndex?: boolean
  category?: string
}

export function generateSiteMetadata({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noIndex = false,
  category,
}: GenerateMetadataProps): Metadata {
  // Base title
  const baseTitle = process.env.NEXT_PUBLIC_SITE_NAME
  const finalTitle = title ? `${title} | ${baseTitle}` : baseTitle

  // Base description
  const baseDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION
  const finalDescription = description || baseDescription

  return {
    title: finalTitle,
    description: finalDescription,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      siteName: baseTitle,
      type,
      ...(image && {
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
          },
        ],
      }),
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      ...(image && { images: [image] }),
    },
    // Schema.org JSON-LD
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': type,
        headline: finalTitle,
        description: finalDescription,
        ...(author && { author }),
        ...(publishedTime && { datePublished: publishedTime }),
        ...(modifiedTime && { dateModified: modifiedTime }),
        ...(image && { image }),
        ...(category && { articleSection: category }),
      }),
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  }
}
