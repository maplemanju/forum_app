import { Content } from '@/common/components/content'
import { PostList } from '@/common/components/widgets/postList'
import {
  getRecentlyUpdatedPosts,
  getPostsByKeyword,
} from '@/process/actions/postAction'
import SearchBox from '@/common/components/widgets/searchBox'
import { PostType } from '@/types/post'
import { getTags } from '@/process/actions/tagAction'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  const keyword = (await searchParams)?.q
  let posts: PostType[] = []
  if (keyword) {
    const keywords = keyword.split(' ')
    posts = await getPostsByKeyword({ keyword: keywords })
  } else {
    posts = await getRecentlyUpdatedPosts()
  }
  const tags = await getTags()

  return (
    <>
      <Content>
        <SearchBox tags={tags} />
        <PostList posts={posts} showCategory={true} />
      </Content>
    </>
  )
}
