import { Content } from '@/common/components/content'
import { PostList } from '@/common/components/widgets/postList'
import {
  getRecentlyUpdatedPosts,
  getPostsByKeyword,
} from '@/process/actions/postAction'
import SearchBox from '@/common/components/widgets/searchBox'
import { PostType } from '@/types/post'
import { ResponseType } from '@/utils/errors'
import { getTags } from '@/process/actions/tagAction'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  const keyword = (await searchParams)?.q
  let postsResponse: ResponseType<PostType[]> | undefined
  if (keyword) {
    const keywords = keyword.split(' ')
    postsResponse = await getPostsByKeyword({ keyword: keywords })
  }
  const tagsResponse = await getTags()

  return (
    <>
      <Content>
        <SearchBox tags={tagsResponse.data} />
        <PostList posts={postsResponse?.data} showCategory={true} />
      </Content>
    </>
  )
}
