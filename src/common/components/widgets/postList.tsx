import { PostType } from '@/types/post'
import Link from 'next/link'

type PostListProps = {
  posts?: PostType[]
}

export const PostList = ({ posts }: PostListProps) => {
  if (!posts || posts.length === 0) {
    return <div className="text-gray-500 italic">No posts found</div>
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <Link href={`${post.categoryId}/${post.id}`}>
                <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                  {post.postTitle}
                </h3>
              </Link>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                <span>Posted by {post.createdBy || 'Anonymous'}</span>
                <span>•</span>
                <span>a ago</span>
                <span>•</span>
                <span>{post.comments?.length || 0} comments</span>
              </div>
            </div>
            <div className="text-center text-gray-600">
              <div className="font-medium">{post.votes?.length || 0}</div>
              <div className="text-sm">votes</div>
            </div>
          </div>
          <p className="text-gray-600 mt-3 line-clamp-3">{post.postContent}</p>
          {/* <div className="mt-4 flex items-center space-x-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div> */}
        </div>
      ))}
    </div>
  )
}
