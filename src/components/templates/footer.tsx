'use client'
import { config } from '@/utils/config'

export const Footer = ({ children }: { children?: React.ReactNode }) => {
  const date = new Date()
  return (
    <footer className="bg-background-secondary w-full px-4 py-6">
      {children && (
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-8 py-4">
          {children}
        </div>
      )}
      <div className="mx-auto flex max-w-7xl items-center justify-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © {date.getFullYear()} {config.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
