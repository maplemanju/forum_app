'use client'

import { CategoryList } from '@/components/organisms/categoryList'
import { CategoryType } from '@/types/category'
import { use, useState, useEffect } from 'react'
import { Button } from '@/components/atoms/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ResponseType } from '@/utils/errors'
import Link from 'next/link'

type SidebarProps = {
  categoryListPromise?: Promise<ResponseType<CategoryType[]>>
  subCategoryListPromise?: Promise<ResponseType<CategoryType>>
}
export const Drawer = ({
  categoryListPromise,
  subCategoryListPromise,
}: SidebarProps) => {
  const categoryListResponse = categoryListPromise
    ? use(categoryListPromise)
    : null
  const subCategoryListResponse = subCategoryListPromise
    ? use(subCategoryListPromise)
    : null
  const categoryList = categoryListResponse?.data
  const subCategoryList = subCategoryListResponse?.data?.childCategories
  const [isOpen, setIsOpen] = useState(false)

  /** set body to unscrollable */
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => document.body.classList.remove('overflow-hidden') // Cleanup
  }, [isOpen])

  return (
    <>
      {/* Toggle Button (Mobile) */}
      <motion.div
        className="fixed top-3 z-51 md:hidden"
        initial={{ x: 12 }}
        animate={{
          x: isOpen ? window.innerWidth - 48 : 12, // 80 = width of button + some spacing
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          leftIcon={isOpen ? 'arrow_back' : 'menu'}
          size="medium"
          boxStyle="box"
          color="neutral"
          title="Explore More Categories"
          aria-label="Explore More Categories"
        />
      </motion.div>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />

            <motion.aside
              key="sidebar"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="bg-background fixed top-0 left-0 z-50 h-screen w-full overflow-y-auto pb-12 md:hidden"
              aria-live="polite"
            >
              <div className="flex h-[56px] items-center px-4">
                <Link
                  href="/"
                  title="Go to top page"
                  aria-label="Go to top page"
                >
                  <span className="material-symbols-rounded">Home</span>
                </Link>
              </div>
              <div className="space-y-4">
                {subCategoryList && subCategoryList.length > 0 && (
                  <div>
                    <CategoryList
                      categories={subCategoryList}
                      label="Sub Categories"
                    />
                  </div>
                )}
                <div>
                  {categoryList && categoryList.length > 0 && (
                    <CategoryList
                      categories={categoryList}
                      label="Explore More Categories"
                    />
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
