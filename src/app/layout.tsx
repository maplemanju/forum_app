import '@material-symbols/font-400/rounded.css'
import { notoSansJP, notoSans } from '@/utils/fonts'
import Wrapper from '../components/templates/wrapper'
import '@mdxeditor/editor/style.css'
import './styles/globals.css'
import './styles/mdxEditor.scss'
import './styles/content.scss'
import { s3Repository } from '../process/repositories/s3Repository'

// Initialize services
s3Repository.initBucket()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${notoSansJP.variable} ${notoSans.variable} font-main antialiased`}
      >
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  )
}
