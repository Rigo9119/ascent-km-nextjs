export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      {children}
    </div>
  )
}
