'use client'

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full px-4 py-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">{children}</div>
    </main>
  )
}
