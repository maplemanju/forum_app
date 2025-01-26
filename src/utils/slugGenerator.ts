import { nanoid } from 'nanoid'

export function generateSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return `${baseSlug}-${nanoid(6)}`
  // Example: "my-blog-post-x4k9m2"
}
