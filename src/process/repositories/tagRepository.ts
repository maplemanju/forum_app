import prisma from '@/utils/prisma'

export const tagRepository = {
  getTags: async (): Promise<string[]> => {
    const tags = await prisma.postTags.findMany({
      select: {
        tags: true,
      },
    })
    return [...new Set(tags.flatMap((tag: { tags: string[] }) => tag.tags))]
  },
}
