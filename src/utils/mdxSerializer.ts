import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'

export const mdxSerializer = async (content: string) => {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  })
}
