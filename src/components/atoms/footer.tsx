'use client'

export const Footer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <footer className="w-full  border-t border-gray-200 dark:border-gray-800 px-4 py-6">
      {children && (
        <div className="max-w-7xl mx-auto flex justify-between items-start gap-8 py-4">
          {children}
        </div>
      )}
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © 2024 Forum App. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
