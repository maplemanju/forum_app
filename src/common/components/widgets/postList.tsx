import { Post } from '@/types/post'
import Link from 'next/link'

type PostListProps = {
  posts?: Post[]
}

export const PostList = ({ posts }: PostListProps) => {
  if (!posts || posts.length === 0) {
    return <div>No posts found</div>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <Link href={`/${post.categoryId}/${post.id}`}>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
              {post.postTitle}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {post.postContent}
          </p>
        </div>
      ))}
    </div>
  )
}
