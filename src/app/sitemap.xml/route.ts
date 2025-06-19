// app/sitemap.xml/route.js

import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'
import { config } from '@/utils/config'
import categoryRepository from '@/process/repositories/categoryRepository'
import postRepository from '@/process/repositories/postRepository'

export const dynamic = 'force-dynamic'

// Replace this with your actual data source (e.g., CMS or database)
async function getCategories() {
  return await categoryRepository.getAllCategories()
}
async function getPosts() {
  return await postRepository.getAllPost()
}

export async function GET() {
  const baseUrl = config.siteUrl

  // Static routes
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/search', changefreq: 'monthly', priority: 0.7 },
  ]

  const categoryList = await getCategories()
  const dynamicCategories = categoryList.map((category) => ({
    url: `/${category.slug}`,
    changefreq: 'weekly',
    priority: 0.9,
  }))

  const postList = await getPosts()
  const dynamicPosts = postList.map((post) => ({
    url: `/${post.category.slug}/${post.slug}`,
    changefreq: 'weekly',
    priority: 0.8,
  }))

  const allPages = [...staticPages, ...dynamicCategories, ...dynamicPosts]

  const stream = new SitemapStream({ hostname: baseUrl })
  const xml = await streamToPromise(Readable.from(allPages).pipe(stream)).then(
    (data) => data.toString()
  )

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
