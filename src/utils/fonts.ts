import { Noto_Sans_JP, Noto_Sans } from 'next/font/google'

export const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
})

export const notoSans = Noto_Sans({
  variable: '--font-noto-sans',
  subsets: ['latin'],
})
