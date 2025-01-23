import { Post as PostType } from '@/types/post'

type PostProps = {
  post?: PostType | null
}

export const PostContent = ({ post }: PostProps) => {
  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {post.postTitle}
      </h1>
      <div className="prose max-w-none">
        <div className="text-gray-700 whitespace-pre-wrap">
          {post.postContent}
        </div>
      </div>
    </div>
  )
}
