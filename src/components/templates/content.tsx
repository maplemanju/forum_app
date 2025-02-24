'use client'

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="py-6">
      <div className="mx-auto flex flex-col gap-4">{children}</div>
    </main>
  )
}
