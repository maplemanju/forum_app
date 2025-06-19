'use client'
import { config } from '@/utils/config'
import footerImage from '/public/images/logo-footer.png'
import Image from 'next/image'

export const Footer = ({ children }: { children?: React.ReactNode }) => {
  const date = new Date()
  return (
    <footer className="bg-background-secondary w-full px-4 py-6">
      {children && (
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-8 py-4">
          {children}
        </div>
      )}

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-2">
        <Image
          src={footerImage}
          alt={config.siteName}
          width={200}
          className="dark:invert-90"
        />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © {date.getFullYear()} {config.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
