import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'keynote' | 'talk' | 'poster'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-pink-muted/15 text-pink-muted': variant === 'default',
          'border border-[#262626] text-[#888888]': variant === 'outline',
          'bg-amber-500/15 text-amber-400 border border-amber-500/20':
            variant === 'keynote',
          'bg-blue-500/15 text-blue-400 border border-blue-500/20':
            variant === 'talk',
          'bg-purple-500/15 text-purple-400 border border-purple-500/20':
            variant === 'poster',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
