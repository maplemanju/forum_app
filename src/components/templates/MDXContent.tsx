'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

type MDXContentProps = {
  source: MDXRemoteSerializeResult
}

export const MDXContent = ({ source }: MDXContentProps) => {
  return <MDXRemote {...source} />
}
