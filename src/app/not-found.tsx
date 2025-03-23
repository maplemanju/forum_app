import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <h3 className="text-xl mb-6">Page Not Found</h3>
      <p className="text-subtext mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}
