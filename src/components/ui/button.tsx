import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-muted/50 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-pink-muted text-[#0d0d0d] hover:bg-pink-muted/90':
            variant === 'default',
          'border border-[#262626] text-[#e5e5e5] hover:border-[#333333] hover:bg-[#1c1c1c]':
            variant === 'outline',
          'text-[#888888] hover:bg-[#1c1c1c] hover:text-[#e5e5e5]':
            variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
