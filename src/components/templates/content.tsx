'use client'

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="py-2 md:py-6">
      <div className="mx-auto flex flex-col gap-2 md:gap-4">{children}</div>
    </main>
  )
}
