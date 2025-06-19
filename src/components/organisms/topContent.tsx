'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import Image from 'next/image'
import banner from '/public/images/banner.jpg'

export const TopContent: React.FC = () => {
  return (
    <article
      aria-labelledby="top-header"
      className="relative mb-6 flex h-[400px] flex-col justify-center overflow-hidden rounded-sm p-4 text-white dark:text-gray-200"
    >
      <Image
        src={banner}
        alt="Sakura tree over a traditional Japanse House"
        className="absolute top-0 left-0 -z-2 h-full w-full object-cover"
      />
      <div
        className="absolute top-0 left-0 -z-1 h-full w-full bg-black/10 dark:bg-black/30"
        aria-hidden
      ></div>
      <h1 id="top-header" className="mb-4 text-3xl font-bold">
        A Modern Forum App
      </h1>
      <p className="post-content mt-3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quis
        ullamcorper velit. Mauris finibus diam id nulla sagittis molestie. Nulla
        dapibus nisi eu nisl ullamcorper, at viverra nunc viverra.
      </p>
    </article>
  )
}
