import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#262626] bg-[#141414] p-6',
        hover &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:border-[#333333] hover:bg-[#1c1c1c] hover:shadow-lg hover:shadow-black/30',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3 className={cn('text-base font-semibold text-[#e5e5e5]', className)}>
      {children}
    </h3>
  )
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('text-sm text-[#888888]', className)}>{children}</div>
}
